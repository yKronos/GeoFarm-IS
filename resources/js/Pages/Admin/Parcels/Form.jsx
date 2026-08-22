import { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import TumauiniMapFallback from '@/Components/ui/TumauiniMapFallback';
import * as maplibregl from 'maplibre-gl';
import bbox from '@turf/bbox';
import { Check, LocateFixed, PenLine, RotateCcw, Trash2, X } from 'lucide-react';
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

function parseGeometry(value) {
  if (!value) return null;

  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return null;
  }
}

function featureFromGeometry(geometry) {
  if (!geometry) return EMPTY_FEATURE_COLLECTION;
  return {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', properties: {}, geometry }],
  };
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
  }

  return { type: 'FeatureCollection', features };
}

export default function ParcelForm({ parcel, farmers, farmTypes, geojson }) {
  const isEdit = Boolean(parcel);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const drawingRef = useRef(false);
  const draftPointsRef = useRef([]);
  const finishDrawingRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPointCount, setDraftPointCount] = useState(0);

  const { data, setData, post, put, processing, errors } = useForm({
    farmer_id: parcel?.farmer_id ?? '',
    parcel_number: parcel?.parcel_number ?? '',
    location_address: parcel?.location_address ?? '',
    barangay: parcel?.barangay ?? '',
    city_municipality: parcel?.city_municipality ?? 'Tumauini',
    province: parcel?.province ?? 'Isabela',
    total_area_ha: parcel?.total_area_ha ?? '',
    farm_type_id: parcel?.farm_type_id ?? '',
    ownership_type: parcel?.ownership_type ?? '',
    land_owner_name: parcel?.land_owner_name ?? '',
    within_ancestral: parcel?.within_ancestral ?? false,
    arb: parcel?.arb ?? false,
    geojson: geojson ?? '',
  });

  const setBoundaryData = useCallback((geometry) => {
    mapRef.current?.getSource('parcel-boundary')?.setData(featureFromGeometry(geometry));
  }, []);

  const setDraftData = useCallback((points, cursorPoint = null) => {
    mapRef.current?.getSource('draft-boundary')?.setData(buildDraftData(points, cursorPoint));
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

  const finishDrawing = useCallback(() => {
    const geometry = polygonFromPoints(draftPointsRef.current);
    if (!geometry) return;

    setData('geojson', JSON.stringify(geometry));
    setBoundaryData(geometry);
    clearDraft();
  }, [clearDraft, setBoundaryData, setData]);

  useEffect(() => {
    finishDrawingRef.current = finishDrawing;
  }, [finishDrawing]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!supportsWebGL()) {
      setMapUnavailable(true);
      return;
    }

    const initialGeometry = parseGeometry(geojson);
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getBasemapStyle(),
      center: TUMAUINI_CENTER,
      zoom: 12.4,
      maxBounds: TUMAUINI_BOUNDS,
      minZoom: 11,
      maxZoom: 19,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapContainerRef.current);
    requestAnimationFrame(() => map.resize());

    map.on('error', (event) => {
      console.error('MapLibre error:', event?.error || event);
      if (String(event?.error?.message || '').toLowerCase().includes('webgl')) {
        setMapUnavailable(true);
      }
    });

    map.on('load', () => {
      map.addSource('tumauini-boundary', {
        type: 'geojson',
        data: TUMAUINI_BOUNDARY_COLLECTION,
      });

      map.addSource('parcel-boundary', {
        type: 'geojson',
        data: featureFromGeometry(initialGeometry),
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
          'fill-opacity': 0.07,
        },
      });

      map.addLayer({
        id: 'tumauini-boundary-line',
        type: 'line',
        source: 'tumauini-boundary',
        paint: {
          'line-color': '#14532d',
          'line-width': 2,
          'line-dasharray': [2, 1.5],
        },
      });

      map.addLayer({
        id: 'parcel-boundary-fill',
        type: 'fill',
        source: 'parcel-boundary',
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.34,
        },
      });

      map.addLayer({
        id: 'parcel-boundary-line',
        type: 'line',
        source: 'parcel-boundary',
        paint: {
          'line-color': '#047857',
          'line-width': 2,
        },
      });

      map.addLayer({
        id: 'draft-boundary-fill',
        type: 'fill',
        source: 'draft-boundary',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'fill-color': '#2563eb',
          'fill-opacity': 0.22,
        },
      });

      map.addLayer({
        id: 'draft-boundary-line',
        type: 'line',
        source: 'draft-boundary',
        filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']],
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 3,
        },
      });

      map.addLayer({
        id: 'draft-boundary-points',
        type: 'circle',
        source: 'draft-boundary',
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 5,
          'circle-color': '#ffffff',
          'circle-stroke-color': '#1d4ed8',
          'circle-stroke-width': 2,
        },
      });

      if (initialGeometry) {
        map.fitBounds(bbox({ type: 'Feature', properties: {}, geometry: initialGeometry }), {
          padding: 60,
          maxZoom: 17,
          duration: 0,
        });
      }

      setMapReady(true);
    });

    map.on('click', (event) => {
      if (!drawingRef.current) return;
      draftPointsRef.current = [...draftPointsRef.current, [event.lngLat.lng, event.lngLat.lat]];
      setDraftData(draftPointsRef.current);
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
      map.remove();
      mapRef.current = null;
    };
  }, [geojson, setDraftData]);

  const beginDrawing = () => {
    if (mapUnavailable || !mapReady) return;
    drawingRef.current = true;
    draftPointsRef.current = [];
    setIsDrawing(true);
    setDraftData([]);
    mapRef.current?.doubleClickZoom.disable();
  };

  const clearGeometry = () => {
    if (mapUnavailable) return;
    clearDraft();
    setBoundaryData(null);
    setData('geojson', '');
  };

  const focusTumauini = () => {
    if (mapUnavailable) return;
    mapRef.current?.fitBounds(TUMAUINI_BOUNDS, { padding: 48, maxZoom: 13, duration: 700 });
  };

  const submit = (event) => {
    event.preventDefault();
    isEdit ? put(`/admin/parcels/${parcel.id}`) : post('/admin/parcels');
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Parcel' : 'Add Farm Parcel'}>
      <form onSubmit={submit} className="max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Farmer</label>
            <select
              value={data.farmer_id}
              onChange={(event) => setData('farmer_id', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Select farmer</option>
              {farmers.map((farmer) => (
                <option key={farmer.id} value={farmer.id}>{farmer.last_name}, {farmer.first_name}</option>
              ))}
            </select>
            {errors.farmer_id && <p className="mt-1 text-xs text-red-600">{errors.farmer_id}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Farm Type</label>
            <select
              value={data.farm_type_id}
              onChange={(event) => setData('farm_type_id', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Select type</option>
              {farmTypes.map((type) => <option key={type.id} value={type.id}>{type.type_name}</option>)}
            </select>
          </div>

          {[
            ['Parcel Number', 'parcel_number'],
            ['Total Area (ha)', 'total_area_ha', 'number'],
            ['Barangay', 'barangay'],
            ['City/Municipality', 'city_municipality'],
            ['Province', 'province'],
            ['Land Owner Name', 'land_owner_name'],
          ].map(([label, key, type = 'text']) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
              <input
                type={type}
                value={data[key]}
                onChange={(event) => setData(key, event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Ownership Type</label>
            <select
              value={data.ownership_type}
              onChange={(event) => setData('ownership_type', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Select</option>
              {['Registered Owner', 'Lessee', 'Tenant', 'Other'].map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={data.within_ancestral}
                onChange={(event) => setData('within_ancestral', event.target.checked)}
              />
              Within Ancestral Domain
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={data.arb}
                onChange={(event) => setData('arb', event.target.checked)}
              />
              ARB
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Parcel Boundary</h3>
              <p className="text-sm text-slate-500">
                Draw one farm polygon inside Tumauini. Basemap: {getBasemapProvider()}.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {!isDrawing ? (
                <button
                  type="button"
                  onClick={beginDrawing}
                  disabled={!mapReady}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  <PenLine className="h-4 w-4" />
                  Draw
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishDrawing}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
                >
                  <Check className="h-4 w-4" />
                  Finish
                </button>
              )}
              <button
                type="button"
                onClick={isDrawing ? clearDraft : clearGeometry}
                disabled={!mapReady}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {isDrawing ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                {isDrawing ? 'Cancel' : 'Clear'}
              </button>
              <button
                type="button"
                onClick={focusTumauini}
                disabled={!mapReady}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <LocateFixed className="h-4 w-4" />
                Focus
              </button>
            </div>
          </div>

          <div className="relative h-96 overflow-hidden rounded-lg border border-slate-200">
            {mapUnavailable ? (
              <TumauiniMapFallback className="absolute inset-0" />
            ) : (
              <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />
            )}
            {isDrawing && (
              <div className="absolute bottom-3 left-3 rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-slate-800 shadow">
                Draft points: {draftPointCount}. Double-click or press Finish to capture.
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <RotateCcw className="h-4 w-4 text-slate-400" />
            <span className={data.geojson ? 'text-emerald-700' : 'text-slate-500'}>
              {data.geojson ? 'Geometry captured and ready to save.' : 'No boundary captured yet.'}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={processing}
            className="rounded-md bg-emerald-700 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {processing ? 'Saving...' : isEdit ? 'Update Parcel' : 'Add Parcel'}
          </button>
          <a href="/admin/parcels" className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </a>
        </div>
      </form>
    </AdminLayout>
  );
}
