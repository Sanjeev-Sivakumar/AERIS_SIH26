export type ProvenanceType = 'MODELLED' | 'COUNTERFACTUAL' | 'OBSERVED' | 'INFERRED' | 'SCENARIO';

export interface SystemHealth {
  status: string;
  system_name: string;
  version: string;
  dmdc_model: {
    status: string;
    rank: number;
    raw_spectral_radius: number;
    stabilized_spectral_radius: number;
    state_dimension: number;
    control_dimension: number;
  };
  attribution_engine: string;
  mpc_engine: string;
  uncertainty_engine: string;
  spatial_grid_records: number;
  operating_mode: string;
  scientific_disclaimer: string;
}

export interface CurrentState {
  timestamp: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
  aqi: number;
  category: string;
  aqi_category?: string;
  dominant_pollutant: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  boundary_layer_height: number;
  temperature_2m_k: number;
  temperature_2m_c: number;
  relative_humidity: number;
  surface_pressure: number;
  wind_speed_10m: number;
  u_wind_10m: number;
  v_wind_10m: number;
  inversion_strength: number;
  cams_aerosol: number;
  stability_index: string;
  data_status: string;
  provenance: ProvenanceType;
}

export interface ForecastHour {
  hour: number;
  horizon_label: string;
  pm25: number;
  pm25_lower: number;
  pm25_upper: number;
  pm10: number;
  pm10_lower?: number;
  pm10_upper?: number;
  o3: number;
  o3_lower?: number;
  o3_upper?: number;
  no2: number;
  no2_lower?: number;
  no2_upper?: number;
  boundary_layer_height: number;
  inversion_strength: number;
  wind_speed_10m: number;
  aqi: number;
  aqi_lower?: number;
  aqi_upper?: number;
  category: string;
  dominant_pollutant: string;
}

export interface ForecastData {
  horizon_hours: number;
  rollout_latency_ms: number;
  scientific_disclaimer: string;
  uncertainty_label: string;
  hourly_timeline: ForecastHour[];
  provenance: ProvenanceType;
}

export interface GridCell {
  lat: number;
  lon: number;
  val?: number;
  value?: number;
  grid_id?: string;
  u_wind?: number;
  v_wind?: number;
}

export interface SpatialGridData {
  variable: string;
  time_step: number;
  total_cells_in_slice: number;
  domain_bounds: {
    lat_min: number;
    lat_max: number;
    lon_min: number;
    lon_max: number;
  };
  cells: GridCell[];
  provenance: ProvenanceType;
}

export interface SectorShare {
  sector: string;
  displayName?: string;
  share_percent: number;
  pm25_equivalent_ugm3?: number;
  pm25_reduction_ugm3?: number;
  zero_out_reduction_ugm3?: number;
  provenance?: ProvenanceType;
}

export interface AttributionData {
  provenance_notice: string;
  source_breakdown: {
    local_urban_percent: number;
    regional_crop_fires_percent: number;
    transboundary_background_percent: number;
  };
  sector_contributions: SectorShare[];
}

export interface PlumeEstimate {
  cluster_id: string;
  centroid_lat: number;
  centroid_lon: number;
  fire_count: number;
  total_frp_mw: number;
  distance_to_delhi_km: number;
  bearing_deg: number;
  aligned_with_wind: boolean;
  transit_speed_kmh: number;
  estimated_arrival_hours: number;
  urgency: string;
  confidence: string | number;
  provenance: ProvenanceType;
  cluster_center_lat?: number;
  cluster_center_lon?: number;
  total_frp?: number;
  distance_km?: number;
  estimated_transit_hours?: number;
  estimated_arrival_timestamp?: string;
  transport_potential_score?: number;
  is_upwind?: boolean;
}

export interface PlumeData {
  active_fire_clusters_count: number;
  target_airshed: string;
  plume_estimates: PlumeEstimate[];
  plume_clock_status: string;
  scientific_disclaimer: string;
  provenance: ProvenanceType;
}

export interface DriverScore {
  driver: string;
  driver_name: string;
  score: number;
  description: string;
}

export interface WhyAQIRisesData {
  timestamp: string;
  horizon_hours: number;
  initial_aqi: number;
  predicted_aqi: number;
  delta_aqi: number;
  dominant_driver: string;
  driver_scores: DriverScore[];
  drivers?: any[];
  spectral_mode_association: string | any[];
  narrative_summary: string;
  provenance: ProvenanceType;
}

export interface MPCStrategyResult {
  feasible: boolean;
  feasibility_status?: string;
  infeasibility_reason?: string | null;
  target_aqi_requested?: number;
  target_aqi_achieved?: number;
  final_predicted_aqi?: number;
  final_predicted_pm25?: number;
  curtailment_percent: Record<string, number>;
  optimal_curtailments?: Record<string, number>;
  expected_pm25_reduction_ugm3: number;
  cost_index: number;
  trajectory_comparison: {
    hour: number;
    baseline_pm25: number;
    controlled_pm25: number;
    averted_pm25: number;
  }[];
  scientific_disclaimer: string;
  provenance: ProvenanceType;
}

export interface DemoStep {
  step: number;
  title: string;
  target_section: string;
  narrative: string;
}

export interface ActivityEvent {
  timestamp: string;
  service: string;
  message: string;
  latency_ms: number;
}

export interface BackendActivity {
  pipeline_status: {
    data_ingestion: string;
    wrfchem_state: string;
    dmdc_forecast: string;
    attribution: string;
    mpc_engine: string;
  };
  last_updated: string;
  events: ActivityEvent[];
  operating_mode: string;
  system_status: string;
}

export type NavigationPage = 
  | 'overview'
  | 'monitoring'
  | 'forecast'
  | 'atmosphere'
  | 'sources'
  | 'intervention'
  | 'model';

