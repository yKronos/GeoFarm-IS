<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use App\Models\CropSeason;
use App\Models\Farmer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CropEstimatorController extends Controller
{
    public function index()
    {
        $farmers = Farmer::select('id', DB::raw("CONCAT(first_name, ' ', last_name, ' (', COALESCE(rsbsa_no, id), ')') as name"))
            ->orderBy('first_name')
            ->get();

        $crops = Crop::select('id', 'crop_name', 'seeding_rate_kg_per_ha', 'fertilizer_bags_per_ha')
            ->orderBy('crop_name')
            ->get();

        return Inertia::render('Admin/CropEstimator/Index', [
            'farmers' => $farmers,
            'crops' => $crops,
        ]);
    }

    public function estimate(Request $request)
    {
        $request->validate([
            'crop_id' => 'required|exists:crops,id',
            'area_hectares' => 'required|numeric|min:0.01',
            'farmer_id' => 'nullable|exists:farmers,id',
            'planting_date' => 'nullable|date',
            'season' => 'nullable|in:dry,wet',
        ]);

        $crop = Crop::findOrFail($request->crop_id);
        
        // Get historical data for this crop
        $query = CropSeason::where('crop_id', $request->crop_id)
            ->whereNotNull('yield_kg')
            ->whereNotNull('area_planted_ha')
            ->where('area_planted_ha', '>', 0);

        // If farmer specified, prioritize their data but also include general data
        if ($request->farmer_id) {
            $farmerData = (clone $query)
                ->whereHas('parcel', function($q) use ($request) {
                    $q->where('farmer_id', $request->farmer_id);
                })
                ->get();
            
            // If farmer has enough data, use it; otherwise use general data
            if ($farmerData->count() >= 3) {
                $historicalData = $farmerData;
            } else {
                $historicalData = $query->get();
            }
        } else {
            $historicalData = $query->get();
        }

        // Calculate yield per hectare for each record
        $yieldsPerHa = $historicalData->map(function($season) {
            return $season->yield_kg / $season->area_planted_ha;
        });

        // Calculate average yield per hectare
        $avgYieldPerHa = $yieldsPerHa->avg() ?: 0;

        // Calculate estimated total yield
        $estimatedTotalYield = $avgYieldPerHa * $request->area_hectares;

        // Calculate input requirements
        $recommendedSeeds = ($crop->seeding_rate_kg_per_ha ?? 0) * $request->area_hectares;
        $recommendedFertilizer = ($crop->fertilizer_bags_per_ha ?? 0) * $request->area_hectares;

        // Get seasonal breakdown
        $seasonalData = CropSeason::select(
                'season',
                'cropping_year',
                DB::raw('AVG(yield_kg / area_planted_ha) as avg_yield'),
                DB::raw('AVG(DATEDIFF(harvest_date, planting_date)) as avg_days_to_harvest')
            )
            ->where('crop_id', $request->crop_id)
            ->whereNotNull('yield_kg')
            ->whereNotNull('area_planted_ha')
            ->where('area_planted_ha', '>', 0)
            ->whereNotNull('planting_date')
            ->whereNotNull('harvest_date')
            ->groupBy('season', 'cropping_year')
            ->orderBy('cropping_year', 'desc')
            ->orderBy('season')
            ->limit(10)
            ->get();

        // Calculate average days to harvest
        $avgDaysToHarvest = CropSeason::where('crop_id', $request->crop_id)
            ->whereNotNull('planting_date')
            ->whereNotNull('harvest_date')
            ->selectRaw('AVG(DATEDIFF(harvest_date, planting_date)) as avg_days')
            ->value('avg_days') ?? 120; // Default 120 days if no data

        // Estimate harvest date if planting date provided
        $estimatedHarvestDate = null;
        $plantingMonth = null;
        $harvestMonth = null;
        $riskAssessment = null;

        if ($request->planting_date) {
            $plantingDate = new \DateTime($request->planting_date);
            $estimatedHarvestDate = (clone $plantingDate)->modify("+{$avgDaysToHarvest} days");
            
            $plantingMonth = (int)$plantingDate->format('n');
            $harvestMonth = (int)$estimatedHarvestDate->format('n');
            
            // Risk assessment based on season and months
            $riskAssessment = $this->assessRisk($plantingMonth, $harvestMonth, $request->season);
        }

        // Get best planting months from historical data
        $bestPlantingMonths = CropSeason::select(
                DB::raw('MONTH(planting_date) as month'),
                DB::raw('AVG(yield_kg / area_planted_ha) as avg_yield'),
                DB::raw('COUNT(*) as count')
            )
            ->where('crop_id', $request->crop_id)
            ->whereNotNull('planting_date')
            ->whereNotNull('yield_kg')
            ->whereNotNull('area_planted_ha')
            ->where('area_planted_ha', '>', 0)
            ->groupBy('month')
            ->orderBy('avg_yield', 'desc')
            ->limit(3)
            ->get()
            ->map(function($item) {
                return [
                    'month' => $item->month,
                    'month_name' => date('F', mktime(0, 0, 0, $item->month, 1)),
                    'avg_yield' => round($item->avg_yield, 2),
                    'count' => $item->count,
                ];
            });

        return response()->json([
            'avg_yield_per_ha' => round($avgYieldPerHa, 2),
            'estimated_total_yield_kg' => round($estimatedTotalYield, 2),
            'recommended_seeds_kg' => round($recommendedSeeds, 2),
            'recommended_fertilizer_bags' => round($recommendedFertilizer, 2),
            'data_points' => $historicalData->count(),
            'seasonal_data' => $seasonalData,
            'crop_name' => $crop->crop_name,
            'area_hectares' => $request->area_hectares,
            'avg_days_to_harvest' => round($avgDaysToHarvest),
            'estimated_harvest_date' => $estimatedHarvestDate ? $estimatedHarvestDate->format('Y-m-d') : null,
            'planting_date' => $request->planting_date,
            'risk_assessment' => $riskAssessment,
            'best_planting_months' => $bestPlantingMonths,
        ]);
    }

    private function assessRisk($plantingMonth, $harvestMonth, $season)
    {
        // Wet season: June to November (typhoon season)
        // Dry season: December to May
        
        $wetMonths = [6, 7, 8, 9, 10, 11]; // June to November
        $typhoonPeakMonths = [7, 8, 9, 10]; // July to October
        
        $risks = [];
        $riskLevel = 'low';
        
        // Check if harvest falls during typhoon season
        if (in_array($harvestMonth, $typhoonPeakMonths)) {
            $risks[] = 'Harvest period falls during peak typhoon season (July-October)';
            $riskLevel = 'high';
        } elseif (in_array($harvestMonth, $wetMonths)) {
            $risks[] = 'Harvest period during wet season - risk of heavy rainfall';
            $riskLevel = 'medium';
        }
        
        // Check if planting during heavy rain months
        if (in_array($plantingMonth, $typhoonPeakMonths)) {
            $risks[] = 'Planting during peak typhoon season may affect germination';
            if ($riskLevel === 'low') $riskLevel = 'medium';
        }
        
        // Dry season planting (Dec-May) is generally safer
        if (!in_array($plantingMonth, $wetMonths) && !in_array($harvestMonth, $wetMonths)) {
            $risks[] = 'Good timing - both planting and harvest during dry season';
            $riskLevel = 'low';
        }
        
        // Season mismatch warning
        if ($season === 'wet' && !in_array($plantingMonth, $wetMonths)) {
            $risks[] = 'Warning: Selected wet season but planting date is in dry months';
        } elseif ($season === 'dry' && in_array($plantingMonth, $wetMonths)) {
            $risks[] = 'Warning: Selected dry season but planting date is in wet months';
        }
        
        return [
            'level' => $riskLevel,
            'risks' => $risks,
            'recommendation' => $this->getRecommendation($riskLevel, $plantingMonth),
        ];
    }
    
    private function getRecommendation($riskLevel, $plantingMonth)
    {
        if ($riskLevel === 'high') {
            return 'Consider postponing planting to avoid typhoon season. Best planting months are December to March.';
        } elseif ($riskLevel === 'medium') {
            return 'Moderate risk. Ensure proper drainage and prepare for possible heavy rainfall. Monitor weather forecasts closely.';
        } else {
            return 'Good planting schedule. Maintain regular monitoring and follow recommended agricultural practices.';
        }
    }
}
