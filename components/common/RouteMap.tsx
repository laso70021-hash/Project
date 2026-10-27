'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import {
  Truck,
  Warehouse,
  Navigation,
  Activity,
  Layers,
  Crosshair,
  Gauge,
  User,
  Package,
  MapPin,
  Clock,
  Compass,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  X,
  Radio,
  Thermometer,
  Maximize2,
  Minimize2,
  Check,
  Search,
  Globe,
  Anchor,
  Plane,
  Ship,
  ChevronDown,
} from 'lucide-react';
import {
  LocationPoint,
  ShipmentLeg,
  TransportMode,
  WORLDWIDE_LOGISTICS_HUBS,
  searchWorldwideLocations,
  isValidCoordinate,
  calculateHaversineDistanceKm,
} from '@/lib/geocoding';
import { calculateWorldwideRoute, RouteCalculationResult } from '@/lib/multimodal-routing';
import { useAppStore } from '@/lib/store-context';
import { Shipment } from '@/lib/types';

interface RouteMapProps {
  title?: string;
  variant?: 'admin' | 'driver' | 'customer' | 'transporter';
  activeStopIndex?: number;
  heightClass?: string;
  interactive?: boolean;
  selectedShipmentId?: string;
}

interface FleetVehicle {
  id: string;
  plate: string;
  type: 'truck' | 'van' | 'vessel' | 'aircraft';
  driver: string;
  phone: string;
  status: 'In Transit' | 'Delivering' | 'Scheduled';
  speedKmH: number;
  heading: string;
  currentLocation: { lat: number; lng: number };
  destination: string;
  origin: string;
  eta: string;
  shipmentId: string;
  cargo: string;
  tempCelsius?: number;
  mode: TransportMode;
  lastUpdated: string;
  isStale?: boolean;
}

interface LogisticsHub {
  code: string;
  name: string;
  city: string;
  country: string;
  type: 'hub' | 'port' | 'depot' | 'airport';
  location: { lat: number; lng: number };
  capacity: string;
  occupancyPct: number;
  manager: string;
}

// Global & Regional Hubs across continents
const ALL_HUBS: LogisticsHub[] = [
  // East Africa Master Hubs (Preserving reference screenshot)
  {
    code: 'DAR-WH01',
    name: 'Dar es Salaam Central Terminal & Port',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    type: 'port',
    location: { lat: -6.852, lng: 39.278 },
    capacity: '1,000 pallets',
    occupancyPct: 82,
    manager: 'Rashid Mohamed',
  },
  {
    code: 'ZNZ-WH01',
    name: 'Zanzibar Malindi Port Facility',
    city: 'Zanzibar',
    country: 'Tanzania',
    type: 'port',
    location: { lat: -6.155, lng: 39.192 },
    capacity: '600 pallets',
    occupancyPct: 54,
    manager: 'Fatma Said',
  },
  {
    code: 'ARU-WH01',
    name: 'Arusha Northern Depot',
    city: 'Arusha',
    country: 'Tanzania',
    type: 'depot',
    location: { lat: -3.385, lng: 36.685 },
    capacity: '300 pallets',
    occupancyPct: 60,
    manager: 'David Mrosso',
  },
  {
    code: 'MWZ-WH01',
    name: 'Mwanza Lake Depot',
    city: 'Mwanza',
    country: 'Tanzania',
    type: 'depot',
    location: { lat: -2.535, lng: 32.925 },
    capacity: '300 pallets',
    occupancyPct: 40,
    manager: 'Grace Lyimo',
  },
  // Key International Strategic Gateways
  {
    code: 'RTM-PORT',
    name: 'Port of Rotterdam Maasvlakte Hub',
    city: 'Rotterdam',
    country: 'Netherlands',
    type: 'port',
    location: { lat: 51.9545, lng: 4.0256 },
    capacity: '50,000 TEU',
    occupancyPct: 88,
    manager: 'Jan van Dijk',
  },
  {
    code: 'DXB-CARGO',
    name: 'Dubai Jebel Ali & DWC Hub',
    city: 'Dubai',
    country: 'United Arab Emirates',
    type: 'hub',
    location: { lat: 25.0089, lng: 55.0673 },
    capacity: '35,000 TEU',
    occupancyPct: 76,
    manager: 'Tariq Al-Mansoor',
  },
  {
    code: 'SIN-PORT',
    name: 'Singapore Pasir Panjang Terminal',
    city: 'Singapore',
    country: 'Singapore',
    type: 'port',
    location: { lat: 1.2844, lng: 103.7828 },
    capacity: '65,000 TEU',
    occupancyPct: 91,
    manager: 'Tan Wei Ming',
  },
  {
    code: 'JFK-CARGO',
    name: 'New York JFK Intermodal Gateway',
    city: 'New York',
    country: 'United States',
    type: 'airport',
    location: { lat: 40.6413, lng: -73.7781 },
    capacity: '15,000 pallets',
    occupancyPct: 84,
    manager: 'Robert Sterling',
  },
];

// Active Telematics Fleet with Worldwide Coordinates
const GLOBAL_FLEET_VEHICLES: FleetVehicle[] = [
  // Local East African fleet
  {
    id: 'TRK-DAR-01',
    plate: 'TZ 4821 AA',
    type: 'truck',
    mode: 'road',
    driver: 'Juma Bakari',
    phone: '+255 754 819 201',
    status: 'In Transit',
    speedKmH: 68,
    heading: 'NW',
    currentLocation: { lat: -6.638, lng: 38.125 }, // Chalinze Corridor
    destination: 'Dodoma Hub',
    origin: 'Dar es Salaam Port',
    eta: '4h 15m',
    shipmentId: 'TZL-20261025-001',
    cargo: 'Solar Inverters & Lithium Packs (24T)',
    lastUpdated: '1 min ago',
    isStale: false,
  },
  {
    id: 'VAN-ZNZ-03',
    plate: 'ZN 1092 BB',
    type: 'van',
    mode: 'road',
    driver: 'Hamisi Khamis',
    phone: '+255 777 412 889',
    status: 'Delivering',
    speedKmH: 34,
    heading: 'N',
    currentLocation: { lat: -6.163, lng: 39.199 }, // Zanzibar Stone Town
    destination: 'Mnazi Mmoja Clinic',
    origin: 'ZNZ-WH01 Malindi',
    eta: '25 mins',
    shipmentId: 'TZL-20261025-002',
    cargo: 'Cold-Chain Vaccines & Diagnostics',
    tempCelsius: 4.2,
    lastUpdated: '3 mins ago',
    isStale: false,
  },
  {
    id: 'TRK-ARU-08',
    plate: 'TZ 9904 CD',
    type: 'truck',
    mode: 'road',
    driver: 'Peter Mwangi',
    phone: '+255 768 334 112',
    status: 'In Transit',
    speedKmH: 72,
    heading: 'N',
    currentLocation: { lat: -2.85, lng: 36.72 }, // Namanga Cross-Border
    destination: 'Nairobi ICD',
    origin: 'Arusha Depot',
    eta: '1h 50m',
    shipmentId: 'TZL-20261024-015',
    cargo: 'Fresh Horticultural Exports (18T)',
    tempCelsius: 7.5,
    lastUpdated: '2 mins ago',
    isStale: false,
  },
  // Maritime vessel
  {
    id: 'VESSEL-IND-01',
    plate: 'IMO 9695121',
    type: 'vessel',
    mode: 'sea',
    driver: 'Capt. Eric Vance',
    phone: '+8816 315 2891',
    status: 'In Transit',
    speedKmH: 22,
    heading: 'SW',
    currentLocation: { lat: 1.2844, lng: 103.7828 }, // Singapore Strait
    destination: 'Dar es Salaam Port (DAR-WH01)',
    origin: 'Shanghai Yangshan Port',
    eta: '5 days',
    shipmentId: 'SHP-GLB-001',
    cargo: 'Commercial Inverters & Grid Batteries (48 Containers)',
    lastUpdated: '5 mins ago',
    isStale: false,
  },
  // Air cargo aircraft
  {
    id: 'FLT-EK-982',
    plate: 'A6-EFG (B777F)',
    type: 'aircraft',
    mode: 'air',
    driver: 'Capt. Sarah Jenkins',
    phone: '+971 4 708 1111',
    status: 'In Transit',
    speedKmH: 840,
    heading: 'NW',
    currentLocation: { lat: 25.2532, lng: 55.3657 }, // Middle East Air Corridor
    destination: 'London Heathrow (LHR)',
    origin: 'Nairobi (NBO)',
    eta: '6h 15m',
    shipmentId: 'SHP-GLB-002',
    cargo: 'Optic Fiber Transceivers & Avionics',
    lastUpdated: '2 mins ago',
    isStale: false,
  },
];

// Corridor Paths
const CENTRAL_CORRIDOR_PATH = [
  { lat: -6.852, lng: 39.278 },
  { lat: -6.638, lng: 38.125 },
  { lat: -6.827, lng: 37.659 },
  { lat: -6.163, lng: 35.751 },
  { lat: -4.816, lng: 34.743 },
  { lat: -3.663, lng: 33.425 },
  { lat: -2.535, lng: 32.925 },
];

const NORTHERN_CORRIDOR_PATH = [
  { lat: -6.852, lng: 39.278 },
  { lat: -6.638, lng: 38.125 },
  { lat: -5.394, lng: 38.489 },
  { lat: -4.846, lng: 38.488 },
  { lat: -3.344, lng: 37.340 },
  { lat: -3.385, lng: 36.685 },
  { lat: -2.545, lng: 36.790 },
  { lat: -1.292, lng: 36.821 },
];

const FERRY_CORRIDOR_PATH = [
  { lat: -6.815, lng: 39.295 },
  { lat: -6.155, lng: 39.192 },
];

// SVG projection helper supporting both East Africa local and Global views
function projectCoords(
  lat: number,
  lng: number,
  isGlobalView: boolean = false
): { x: number; y: number } {
  if (!isValidCoordinate(lat, lng)) {
    return { x: 250, y: 180 };
  }

  if (isGlobalView) {
    // Equirectangular projection for worldwide map (-180 to 180, -70 to 70)
    const x = ((lng + 180) / 360) * 500;
    const y = ((70 - lat) / 140) * 360;
    return {
      x: Math.max(5, Math.min(495, x)),
      y: Math.max(5, Math.min(355, y)),
    };
  }

  // Local East Africa projection matching reference screenshot bounds
  const minLng = 28.5;
  const maxLng = 41.0;
  const minLat = -8.0;
  const maxLat = 1.0;

  // If coordinate is outside East Africa, project it smoothly towards the boundary
  const clampedLng = Math.max(minLng, Math.min(maxLng, lng));
  const clampedLat = Math.max(minLat, Math.min(maxLat, lat));

  const x = ((clampedLng - minLng) / (maxLng - minLng)) * 500;
  const y = ((maxLat - clampedLat) / (maxLat - minLat)) * 360;
  return { x: Math.max(8, Math.min(492, x)), y: Math.max(8, Math.min(352, y)) };
}

// Global Camera Controller
function GlobalMapController({
  targetCenter,
  targetZoom,
}: {
  targetCenter?: { lat: number; lng: number } | null;
  targetZoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !targetCenter) return;
    map.panTo(targetCenter);
    if (targetZoom) {
      map.setZoom(targetZoom);
    }
  }, [map, targetCenter, targetZoom]);

  return null;
}

export function RouteMap({
  variant = 'admin',
  heightClass = 'h-[250px]',
  selectedShipmentId,
}: RouteMapProps) {
  const { shipments } = useAppStore();

  const [activeRegion, setActiveRegion] = useState<'east_africa' | 'global' | 'europe' | 'asia' | 'americas'>('east_africa');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationPoint[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [selectedHub, setSelectedHub] = useState<LogisticsHub | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [calculatedRoute, setCalculatedRoute] = useState<RouteCalculationResult | null>(null);

  // Default East Africa Center matching the screenshot
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number }>({ lat: -5.85, lng: 37.8 });
  const [cameraZoom, setCameraZoom] = useState<number>(6);

  // Google Maps demo / provisioned key
  const demoApiKey = 'AIzaSyCS8UiQb4hdx1Zm6XDGuRsCovqRr4PrEvI';
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || demoApiKey;

  // Handle region switching
  const handleSelectRegion = (region: 'east_africa' | 'global' | 'europe' | 'asia' | 'americas') => {
    setActiveRegion(region);
    setSelectedLocation(null);
    setSelectedVehicle(null);
    setSelectedHub(null);

    switch (region) {
      case 'east_africa':
        setCameraCenter({ lat: -5.85, lng: 37.8 });
        setCameraZoom(6);
        break;
      case 'global':
        setCameraCenter({ lat: 20.0, lng: 15.0 });
        setCameraZoom(2);
        break;
      case 'europe':
        setCameraCenter({ lat: 51.5, lng: 5.0 });
        setCameraZoom(5);
        break;
      case 'asia':
        setCameraCenter({ lat: 18.0, lng: 105.0 });
        setCameraZoom(4);
        break;
      case 'americas':
        setCameraCenter({ lat: 38.0, lng: -95.0 });
        setCameraZoom(4);
        break;
    }
  };

  // Worldwide Location Search debounced
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchWorldwideLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle selecting a search result location
  const handlePickLocation = (loc: LocationPoint) => {
    setSelectedLocation(loc);
    setSearchQuery('');
    setSearchResults([]);
    setCameraCenter({ lat: loc.lat, lng: loc.lng });
    setCameraZoom(10);
    setActiveRegion('global');

    // If we have a selected warehouse hub, compute route
    const originPoint = WORLDWIDE_LOGISTICS_HUBS[0]; // Dar es Salaam Central
    try {
      const route = calculateWorldwideRoute(originPoint, loc);
      setCalculatedRoute(route);
    } catch {
      // Ignored
    }
  };

  return (
    <div className={`relative w-full ${heightClass} ${isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)] shadow-2xl rounded-2xl' : 'rounded-xl'} overflow-hidden border border-slate-200/90 bg-slate-900 shadow-xs flex flex-col select-none`}>
      {/* Top Floating Controls Bar */}
      <div className="absolute top-2 left-2 right-2 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Global Region Switcher */}
        <div className="flex items-center gap-1 rounded-lg bg-white/95 p-1 shadow-md border border-slate-200 text-[10px] font-semibold text-slate-700 backdrop-blur-xs">
          <button
            onClick={() => handleSelectRegion('east_africa')}
            className={`px-2 py-0.5 rounded transition ${
              activeRegion === 'east_africa' ? 'bg-[#1677ff] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            East Africa
          </button>
          <button
            onClick={() => handleSelectRegion('global')}
            className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
              activeRegion === 'global' ? 'bg-[#1677ff] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Globe className="h-3 w-3" />
            <span>Worldwide</span>
          </button>
          <button
            onClick={() => handleSelectRegion('europe')}
            className={`px-2 py-0.5 rounded transition hidden sm:inline-block ${
              activeRegion === 'europe' ? 'bg-[#1677ff] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Europe (Rotterdam)
          </button>
          <button
            onClick={() => handleSelectRegion('asia')}
            className={`px-2 py-0.5 rounded transition hidden sm:inline-block ${
              activeRegion === 'asia' ? 'bg-[#1677ff] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Asia (Shanghai/Dubai)
          </button>
        </div>

        {/* Global Search & Fullscreen CTA */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <div className="flex items-center rounded-lg bg-white/95 px-2 py-1 shadow-md border border-slate-200 text-xs text-slate-700 backdrop-blur-xs">
              <Search className="h-3 w-3 text-slate-400 mr-1.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any global city/address..."
                className="w-36 sm:w-44 bg-transparent text-[10px] text-slate-800 placeholder-slate-400 outline-hidden font-medium"
              />
              {isSearching && <RefreshCw className="h-2.5 w-2.5 animate-spin text-blue-600" />}
            </div>

            {/* Search Suggestions Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute right-0 mt-1 w-64 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 text-[10.5px]">
                <div className="px-2 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Worldwide Geocoded Locations
                </div>
                {searchResults.map((res) => (
                  <button
                    key={res.id || `${res.lat}-${res.lng}`}
                    onClick={() => handlePickLocation(res)}
                    className="flex w-full items-start gap-2 rounded-lg p-1.5 text-left text-slate-700 hover:bg-blue-50 transition"
                  >
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{res.name}</p>
                      <p className="text-[9.5px] text-slate-500 truncate">
                        {res.country ? `${res.city || ''}, ${res.country}` : res.address}
                      </p>
                      <p className="text-[8.5px] font-mono text-blue-600">
                        {res.lat.toFixed(4)}°, {res.lng.toFixed(4)}°
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-slate-50 backdrop-blur-xs transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Worldwide Map'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="relative flex-1 w-full h-full">
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="DEMO_MAP_ID"
            center={cameraCenter}
            zoom={cameraZoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            className="w-full h-full"
          >
            <GlobalMapController targetCenter={cameraCenter} targetZoom={cameraZoom} />

            {/* Worldwide Hubs */}
            {ALL_HUBS.map((hub) => (
              <AdvancedMarker
                key={hub.code}
                position={hub.location}
                title={`${hub.code} - ${hub.name}`}
                onClick={() => {
                  setSelectedHub(hub);
                  setSelectedVehicle(null);
                }}
              >
                <div className="group relative flex flex-col items-center cursor-pointer">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-600 text-white shadow-md ring-2 ring-white transition-transform group-hover:scale-110">
                    {hub.type === 'port' ? <Anchor className="h-3 w-3" /> : hub.type === 'airport' ? <Plane className="h-3 w-3" /> : <Warehouse className="h-3 w-3" />}
                  </div>
                  <span className="mt-0.5 rounded bg-slate-900/90 px-1 py-0.2 text-[8px] font-bold text-white shadow-xs whitespace-nowrap">
                    {hub.code}
                  </span>
                </div>
              </AdvancedMarker>
            ))}

            {/* Active Global Fleet Vehicles */}
            {GLOBAL_FLEET_VEHICLES.map((v) => (
              <AdvancedMarker
                key={v.id}
                position={v.currentLocation}
                title={`${v.plate} (${v.driver})`}
                onClick={() => {
                  setSelectedVehicle(v);
                  setSelectedHub(null);
                }}
              >
                <div className="group relative flex flex-col items-center cursor-pointer">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition-transform group-hover:scale-110 ${
                      v.mode === 'sea' ? 'bg-teal-600' : v.mode === 'air' ? 'bg-indigo-600' : 'bg-blue-600'
                    }`}
                  >
                    {v.mode === 'sea' ? <Ship className="h-3.5 w-3.5" /> : v.mode === 'air' ? <Plane className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 rounded bg-slate-900/90 px-1 py-0.2 text-[8px] font-semibold text-white">
                    <span>{v.plate}</span>
                    <span className="text-emerald-400 font-mono">{v.speedKmH}km/h</span>
                  </div>
                </div>
              </AdvancedMarker>
            ))}

            {/* Selected Searched Location Marker */}
            {selectedLocation && (
              <AdvancedMarker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}>
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-white animate-bounce">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                    {selectedLocation.name}
                  </span>
                </div>
              </AdvancedMarker>
            )}

            {/* InfoWindow for Selected Vehicle */}
            {selectedVehicle && (
              <InfoWindow
                position={selectedVehicle.currentLocation}
                onCloseClick={() => setSelectedVehicle(null)}
                headerContent={
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
                    <span>Live Telematics: {selectedVehicle.plate}</span>
                  </div>
                }
              >
                <div className="p-1 min-w-[210px] text-[11px] text-slate-700 space-y-1">
                  <div>Transport Mode: <strong className="uppercase text-blue-600">{selectedVehicle.mode}</strong></div>
                  <div>Driver / Captain: <strong>{selectedVehicle.driver}</strong></div>
                  <div>Speed: <strong className="text-emerald-600">{selectedVehicle.speedKmH} km/h</strong> ({selectedVehicle.heading})</div>
                  <div>Coordinates: <span className="font-mono text-[10px] text-slate-600">{selectedVehicle.currentLocation.lat.toFixed(4)}°, {selectedVehicle.currentLocation.lng.toFixed(4)}°</span></div>
                  <div>Route: <span>{selectedVehicle.origin} → {selectedVehicle.destination}</span></div>
                  <div>Freshness: <span className="text-emerald-700 font-semibold">{selectedVehicle.lastUpdated}</span></div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Floating Bottom Live Telematics Badge */}
      <div className="absolute bottom-2 left-2 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-lg bg-slate-950/90 px-2.5 py-1 text-[10px] text-white shadow-md border border-slate-800 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold">Global GPS Engine Active</span>
          <span className="text-slate-400 font-mono hidden sm:inline">| Lat -90..+90 | Lng -180..+180</span>
        </div>

        {selectedLocation && (
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-600 text-white px-2 py-1 text-[10px] font-semibold shadow-md">
            <span>Pinned: {selectedLocation.name}</span>
            <button onClick={() => setSelectedLocation(null)} className="hover:opacity-75">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Floating Bottom Right Multimodal Legend */}
      <div className="absolute bottom-2 right-2 z-20 hidden md:flex items-center gap-2 rounded-lg bg-white/95 px-2.5 py-1 text-[9.5px] font-medium text-slate-700 shadow-md border border-slate-200 backdrop-blur-xs pointer-events-auto">
        <span className="flex items-center gap-1">
          <Truck className="h-3 w-3 text-blue-600" /> Road
        </span>
        <span className="flex items-center gap-1">
          <Ship className="h-3 w-3 text-teal-600" /> Sea Maritime
        </span>
        <span className="flex items-center gap-1">
          <Plane className="h-3 w-3 text-indigo-600" /> Air Cargo
        </span>
      </div>
    </div>
  );
}

export default RouteMap;
