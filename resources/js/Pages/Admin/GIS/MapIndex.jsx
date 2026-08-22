import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { usePermissions } from '@/hooks/usePermissions';
import TumauiniMapFallback from '@/Components/ui/TumauiniMapFallback';
import toast from 'react-hot-toast';
import * as maplibregl from 'maplibre-gl';
import area from '@turf/area';
import bbox from '@turf/bbox';
import center from '@turf/center';
import { Check, Eye, Layers, LocateFixed, MapPinned, PenLine, RefreshCcw, Trash2, X } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  TUMAUINI_BOUNDS,
  TUMAUINI_BOUNDARY_COLLECTION,
  TUMAUINI_CENTER,
  getBasemapProvider,
  getBasemapStyle,
} from '@/config/tumauiniMap';

const EMPTY_FEATURE_COLLECTION = { type: 'FeatureCollection', features: [] };

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function normalizeFeatureCollection(data) {
  if (!data?.type) return EMPTY_FEATURE_COLLECTION;
  if (data.type === 'FeatureCollection') return data;
  if (data.type === 'Feature') return { type: 'FeatureCollection', features: [data] };

  return {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', properties: {}, geometry: data }],
  };
}

function formatArea(squareMeters) {
  if (!Number.isFinite(squareMeters)) return '0 ha';
  return `${(squareMeters / 10000).toLocaleString(undefined, { maximumFractionDigits: 2 })} ha`;
}

function polygonFromPoints(points) {
  if (points.length < 3) return null;
  return {
    type: 'Polygon',
    coordinates: [[...points, points[0]]],
  };
}

function buildDraftData(points, cursorPoint = null) {
  const features = points.map((point, index) => ({
    type: 'Feature',
    properties: { index: index + 1 },
    geometry: { type: 'Point', coordinates: point },
  }));

  const lineCoordinates = cursorPoint && points.length ? [...points, cursorPoint] : points;
  if (lineCoordinates.length >= 2) {
    features.push({
      type: 'Feature',
      properties: { kind: 'line' },
      geometry: { type: 'LineString', coordinates: lineCoordinates },
    });
  }

  const polygon = polygonFromPoints(points);
  if (polygon) {
    features.push({
      type: 'Feature',
      properties: { kind: 'polygon' },
      geometry: polygon,
    });
    features.push({
      type: 'Feature',
      properties: { kind: 'outline' },
      geometry: { type: 'LineString', coordinates: polygon.coordinates[0] },
    });
  }

  return { type: 'FeatureCollection', features };
}

export default function MapIndex({ parcels }) {
  const { can } = usePermissions();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const parcelsRef = useRef(parcels);
  const selectedParcelRef = useRef('');
  const drawingRef = useRef(false);
  const draftPointsRef = useRef([]);
  const finishDrawingRef = useRef(null);
  const [selectedParcel, setSelectedParcel] = useState('');
  const [geoJsonData, setGeoJsonData] = useState(EMPTY_FEATURE_COLLECTION);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPointCount, setDraftPointCount] = useState(0);

  const canEdit = can('edit parcels');
  const canDelete = can('delete parcels');
  const basemapProvider = getBasemapProvider();

  const mappedCount = geoJsonData.features.length;
  const totalMappedArea = useMemo(
    () => geoJsonData.features.reduce((sum, feature) => sum + area(feature), 0),
    [geoJsonData],
  );

  const selectedParcelDetails = useMemo(
    () => parcels.find((parcel) => String(parcel.id) === String(selectedParcel)),
    [parcels, selectedParcel],
  );

  useEffect(() => {
    parcelsRef.current = parcels;
  }, [parcels]);

  useEffect(() => {
    selectedParcelRef.current = selectedParcel;
  }, [selectedParcel]);

  const setDraftData = useCallback((points, cursorPoint = null) => {
    const source = mapRef.current?.getSource('draft-boundary');
    source?.setData(buildDraftData(points, cursorPoint));
    setDraftPointCount(points.length);
  }, []);

  const clearDraft = useCallback(() => {
    drawingRef.current = false;
    draftPointsRef.current = [];
    setIsDrawing(false);
    setDraftData([]);
    mapRef.current?.doubleClickZoom.enable();
    if (mapRef.current) mapRef.current.getCanvas().style.cursor = '';
  }, [setDraftData]);

  const loadParcels = useCallback(() => {
    fetch('/admin/gis/parcels-geojson')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(normalizeFeatureCollection(data)))
      .catch((err) => {
        console.error('Error loading parcels:', err);
        toast.error('Unable to load farm boundary layers');
      });
  }, []);

  const saveGeometry = useCallback((parcelId, geometry) => {
    if (!parcelId) {
      toast.error('Select a parcel before saving a boundary');
      return;
    }

    setLoading(true);
    router.post(
      `/admin/gis/parcels/${parcelId}/geometry`,
      { geojson: JSON.stringify(geometry) },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Farm boundary saved');
          clearDraft();
          loadParcels();
        },
        onError: () => toast.error('Failed to save boundary'),
        onFinish: () => setLoading(false),
      },
    );
  }, [clearDraft, loadParcels]);

  const finishDrawing = useCallback(() => {
    const activeParcelId = selectedParcelRef.current;
    const geometry = polygonFromPoints(draftPointsRef.current);

    if (!activeParcelId) {
      toast.error('Select a parcel before saving a boundary');
      return;
    }

    if (!geometry) {
      toast.error('Add at least 3 points to create a farm boundary');
      return;
    }

    saveGeometry(activeParcelId, geometry);
  }, [saveGeometry]);

  useEffect(() => {
    finishDrawingRef.current = finishDrawing;
  }, [finishDrawing]);

  useEffect(() => {
    loadParcels();
  }, [loadParcels]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!supportsWebGL()) {
      setMapUnavailable(true);
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getBasemapStyle(),
      center: TUMAUINI_CENTER,
      zoom: 12.35,
      pitch: 35,
      bearing: -8,
      maxBounds: TUMAUINI_BOUNDS,
      minZoom: 11,
      maxZoom: 19,
      attributionControl: false,
    });

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapContainerRef.current);
    requestAnimationFrame(() => map.resize());

    map.on('error', (event) => {
      console.error('MapLibre error:', event?.error || event);
      if (String(event?.error?.message || '').toLowerCase().includes('webgl')) {
        setMapUnavailable(true);
      }
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      map.addSource('tumauini-boundary', {
        type: 'geojson',
        data: TUMAUINI_BOUNDARY_COLLECTION,
      });

      map.addSource('farm-parcels', {
        type: 'geojson',
        data: geoJsonData,
      });

      map.addSource('draft-boundary', {
        type: 'geojson',
        data: EMPTY_FEATURE_COLLECTION,
      });

      map.addLayer({
        id: 'tumauini-boundary-fill',
        type: 'fill',
        source: 'tumauini-boundary',
        paint: {
          'fill-color': '#16a34a',
          'fill-opacity': 0.08,
        },
      });

      map.addLayer({
        id: 'tumauini-boundary-line',
        type: 'line',
        source: 'tumauini-boundary',
        paint: {
          'line-color': '#facc15',
          'line-width': 3,
          'line-dasharray': [2, 1.2],
        },
      });

      map.addLayer({
        id: 'farm-parcels-fill',
        type: 'fill',
        source: 'farm-parcels',
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.36,
        },
      });

      map.addLayer({
        id: 'farm-parcels-line-halo',
        type: 'line',
        source: 'farm-parcels',
        paint: {
          'line-color': '#020617',
          'line-width': 7,
          'line-opacity': 0.92,
        },
      });

      map.addLayer({
        id: 'farm-parcels-line',
        type: 'line',
        source: 'farm-parcels',
        paint: {
          'line-color': '#fef08a',
          'line-width': 4,
          'line-opacity': 1,
        },
      });

      map.addLayer({
        id: 'draft-boundary-fill',
        type: 'fill',
        source: 'draft-boundary',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'fill-color': '#38bdf8',
          'fill-opacity': 0.32,
        },
      });

      map.addLayer({
        id: 'draft-boundary-line-halo',
        type: 'line',
        source: 'draft-boundary',
        filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']],
        paint: {
          'line-color': '#020617',
          'line-width': 8,
          'line-opacity': 0.95,
        },
      });

      map.addLayer({
        id: 'draft-boundary-line',
        type: 'line',
        source: 'draft-boundary',
        filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']],
        paint: {
          'line-color': '#22d3ee',
          'line-width': 5,
          'line-opacity': 1,
        },
      });

      map.addLayer({
        id: 'draft-boundary-points',
        type: 'circle',
        source: 'draft-boundary',
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 6,
          'circle-color': '#fef08a',
          'circle-stroke-color': '#020617',
          'circle-stroke-width': 3,
        },
      });

      setMapReady(true);
    });

    map.on('click', (event) => {
      if (drawingRef.current) {
        draftPointsRef.current = [...draftPointsRef.current, [event.lngLat.lng, event.lngLat.lat]];
        setDraftData(draftPointsRef.current);
        return;
      }

      const feature = map.queryRenderedFeatures(event.point, { layers: ['farm-parcels-fill'] })?.[0];
      if (!feature) return;

      const props = feature.properties || {};
      setSelectedFeature(props);
      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({ closeButton: true, maxWidth: '300px' })
        .setLngLat(event.lngLat)
        .setHTML(`
          <div class="text-sm">
            <strong>${props.parcel_number || 'Farm parcel'}</strong>
            <div>Farmer: ${props.farmer_name || 'Unknown'}</div>
            <div>Barangay: ${props.barangay || 'Unspecified'}</div>
            <div>Recorded area: ${props.area_ha || 'N/A'} ha</div>
          </div>
        `)
        .addTo(map);
    });

    map.on('mousemove', (event) => {
      if (!drawingRef.current) return;
      map.getCanvas().style.cursor = 'crosshair';
      setDraftData(draftPointsRef.current, [event.lngLat.lng, event.lngLat.lat]);
    });

    map.on('dblclick', (event) => {
      if (!drawingRef.current) return;
      event.preventDefault();
      finishDrawingRef.current?.();
    });

    mapRef.current = map;

    return () => {
      resizeObserver.disconnect();
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [setDraftData]);

  useEffect(() => {
    const source = mapRef.current?.getSource('farm-parcels');
    source?.setData(geoJsonData);
  }, [geoJsonData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer('tumauini-boundary-fill')) return;

    const visibility = showBoundary ? 'visible' : 'none';
    map.setLayoutProperty('tumauini-boundary-fill', 'visibility', visibility);
    map.setLayoutProperty('tumauini-boundary-line', 'visibility', visibility);
  }, [showBoundary]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer('farm-parcels-fill')) return;

    const visibility = showParcels ? 'visible' : 'none';
    map.setLayoutProperty('farm-parcels-fill', 'visibility', visibility);
    map.setLayoutProperty('farm-parcels-line-halo', 'visibility', visibility);
    map.setLayoutProperty('farm-parcels-line', 'visibility', visibility);
  }, [showParcels]);

  const focusTumauini = () => {
    mapRef.current?.fitBounds(TUMAUINI_BOUNDS, {
      padding: 44,
      pitch: 35,
      bearing: -8,
      duration: 900,
    });
  };

  const focusSelectedParcel = () => {
    const feature = geoJsonData.features.find((item) => String(item.properties?.id) === String(selectedParcel));
    if (!feature) {
      toast.error('This parcel has no saved boundary yet');
      return;
    }

    const bounds = bbox(feature);
    mapRef.current?.fitBounds(bounds, { padding: 72, maxZoom: 17, duration: 900 });
    setSelectedFeature(feature.properties);
  };

  const beginDrawing = () => {
    if (mapUnavailable) {
      toast.error('Full GIS editing needs a WebGL-capable browser');
      return;
    }

    if (!canEdit) {
      toast.error('Your account needs the edit parcels permission to draw boundaries');
      return;
    }

    if (!mapReady) {
      toast.error('Map is still loading');
      return;
    }

    if (!selectedParcel) {
      toast.error('Select a parcel first');
      return;
    }

    popupRef.current?.remove();
    drawingRef.current = true;
    draftPointsRef.current = [];
    setIsDrawing(true);
    setDraftData([]);
    mapRef.current?.doubleClickZoom.disable();
    toast.success('Drawing started. Click boundary points, then double-click or press Finish.');
  };

  const deleteSelectedBoundary = () => {
    if (!canDelete || !selectedParcel) return;

    const feature = geoJsonData.features.find((item) => String(item.properties?.id) === String(selectedParcel));
    if (!feature) {
      toast.error('No saved boundary found for this parcel');
      return;
    }

    router.delete(`/admin/gis/parcels/${selectedParcel}/geometry`, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Boundary deleted');
        setSelectedFeature(null);
        clearDraft();
        loadParcels();
      },
      onError: () => toast.error('Failed to delete boundary'),
    });
  };

  const selectedCentroid = useMemo(() => {
    const feature = geoJsonData.features.find((item) => String(item.properties?.id) === String(selectedParcel));
    if (!feature) return null;

    const [lng, lat] = center(feature).geometry.coordinates;
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }, [geoJsonData, selectedParcel]);

  return (
    <AdminLayout title="GIS Farm Mapping">
      <div className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="relative min-h-[680px] overflow-hidden rounded-lg border border-slate-200">
              {mapUnavailable ? (
                <TumauiniMapFallback className="absolute inset-0" />
              ) : (
                <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />
              )}
              {loading && (
                <div className="absolute left-4 top-4 rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-emerald-800 shadow">
                  Saving boundary...
                </div>
              )}
              {isDrawing && (
                <div className="absolute bottom-4 left-4 rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-slate-800 shadow">
                  Draft points: {draftPointCount}. Double-click the map or press Finish to save.
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-800">
                  <MapPinned className="h-4 w-4" />
                  Tumauini Focus
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Municipal farm intelligence map</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Navigation is constrained to Tumauini, Isabela using the local focus extent 17.2340-17.3140 N and
                  121.7699-121.8499 E.
                </p>
                <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  Basemap: <span className="font-medium">{basemapProvider}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs font-medium uppercase text-slate-500">Mapped Parcels</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">{mappedCount}</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs font-medium uppercase text-slate-500">Drawn Area</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">{formatArea(totalMappedArea)}</div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <label className="text-sm font-medium text-slate-700">Target parcel</label>
                <select
                  value={selectedParcel}
                  onChange={(event) => {
                    setSelectedParcel(event.target.value);
                    setSelectedFeature(null);
                    clearDraft();
                  }}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select a parcel</option>
                  {parcels.map((parcel) => (
                    <option key={parcel.id} value={parcel.id}>
                      {parcel.parcel_number || `Parcel #${parcel.id}`} - {parcel.farmer?.first_name} {parcel.farmer?.last_name} ({parcel.barangay || 'No barangay'})
                    </option>
                  ))}
                </select>

                {selectedParcelDetails && (
                  <div className="mt-3 text-sm text-slate-600">
                    <div className="font-medium text-slate-800">{selectedParcelDetails.barangay || 'Unspecified barangay'}</div>
                    <div>{selectedParcelDetails.total_area_ha || 'N/A'} ha recorded area</div>
                    {selectedCentroid && <div>Centroid: {selectedCentroid}</div>}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {!isDrawing ? (
                    <button
                      type="button"
                      onClick={beginDrawing}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                      title="Draw boundary"
                    >
                      <PenLine className="h-4 w-4" />
                      Draw
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={finishDrawing}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
                      title="Finish boundary"
                    >
                      <Check className="h-4 w-4" />
                      Finish
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={focusSelectedParcel}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    title="Zoom to selected parcel"
                  >
                    <LocateFixed className="h-4 w-4" />
                    Locate
                  </button>
                  <button
                    type="button"
                    onClick={deleteSelectedBoundary}
                    disabled={!canDelete}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Delete selected boundary"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={isDrawing ? clearDraft : loadParcels}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    title={isDrawing ? 'Cancel drawing' : 'Refresh layers'}
                  >
                    {isDrawing ? <X className="h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
                    {isDrawing ? 'Cancel' : 'Refresh'}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Layers className="h-4 w-4" />
                  Layers
                </div>
                <label className="flex items-center justify-between gap-3 py-2 text-sm text-slate-700">
                  Municipal focus boundary
                  <input type="checkbox" checked={showBoundary} onChange={(event) => setShowBoundary(event.target.checked)} />
                </label>
                <label className="flex items-center justify-between gap-3 py-2 text-sm text-slate-700">
                  Farm parcel boundaries
                  <input type="checkbox" checked={showParcels} onChange={(event) => setShowParcels(event.target.checked)} />
                </label>
                <button
                  type="button"
                  onClick={focusTumauini}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4" />
                  Recenter Tumauini
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-800">Selected Feature</h3>
                {selectedFeature ? (
                  <dl className="mt-3 space-y-2 text-sm text-slate-600">
                    <div><dt className="font-medium text-slate-800">Parcel</dt><dd>{selectedFeature.parcel_number || 'N/A'}</dd></div>
                    <div><dt className="font-medium text-slate-800">Farmer</dt><dd>{selectedFeature.farmer_name || 'Unknown'}</dd></div>
                    <div><dt className="font-medium text-slate-800">Barangay</dt><dd>{selectedFeature.barangay || 'Unspecified'}</dd></div>
                  </dl>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Click a mapped parcel or locate a selected parcel to inspect it.</p>
                )}
              </div>

              <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                <div className="font-medium text-slate-800">Boundary context</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <span>North: Cabagan</span>
                  <span>East: Divilacan</span>
                  <span>South: Ilagan City</span>
                  <span>West: Cagayan River, Delfin Albano</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
