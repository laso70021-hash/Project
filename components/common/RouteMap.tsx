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
} from 'lucide-react';

interface RouteMapProps {
  title?: string;
  variant?: 'admin' | 'driver' | 'customer' | 'transporter';
  activeStopIndex?: number;
  heightClass?: string;
  interactive?: boolean;
}

interface FleetVehicle {
  id: string;
  plate: string;
  type: 'truck' | 'van';
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
}

interface LogisticsHub {
  code: string;
  name: string;
  type: 'hub' | 'port' | 'depot';
  location: { lat: number; lng: number };
  capacity: string;
  occupancyPct: number;
  manager: string;
}

interface RegionalCity {
  name: string;
  country: string;
  location: { lat: number; lng: number };
}

interface BorderPoint {
  code: string;
  name: string;
  countries: string;
  location: { lat: number; lng: number };
}

// Key Tanzanian & East African hubs
const LOGISTICS_HUBS: LogisticsHub[] = [
  {
    code: 'DAR-WH01',
    name: 'Dar es Salaam Central Terminal',
    type: 'hub',
    location: { lat: -6.852, lng: 39.278 },
    capacity: '1,000 pallets',
    occupancyPct: 82,
    manager: 'Rashid Mohamed',
  },
  {
    code: 'ZNZ-WH01',
    name: 'Zanzibar Port Facility',
    type: 'port',
    location: { lat: -6.155, lng: 39.192 },
    capacity: '600 pallets',
    occupancyPct: 54,
    manager: 'Fatma Said',
  },
  {
    code: 'ARU-WH01',
    name: 'Arusha Northern Depot',
    type: 'depot',
    location: { lat: -3.385, lng: 36.685 },
    capacity: '300 pallets',
    occupancyPct: 60,
    manager: 'David Mrosso',
  },
  {
    code: 'MWZ-WH01',
    name: 'Mwanza Lake Depot',
    type: 'depot',
    location: { lat: -2.535, lng: 32.925 },
    capacity: '300 pallets',
    occupancyPct: 40,
    manager: 'Grace Lyimo',
  },
];

// Regional Cities across East Africa for Coverage Map
const REGIONAL_CITIES: RegionalCity[] = [
  { name: 'Kampala', country: 'Uganda', location: { lat: 0.3476, lng: 32.5825 } },
  { name: 'Nairobi', country: 'Kenya', location: { lat: -1.2921, lng: 36.8219 } },
  { name: 'Kigali', country: 'Rwanda', location: { lat: -1.9441, lng: 30.0619 } },
  { name: 'Bujumbura', country: 'Burundi', location: { lat: -3.3822, lng: 29.3644 } },
  { name: 'Mwanza', country: 'Tanzania', location: { lat: -2.535, lng: 32.925 } },
  { name: 'Arusha', country: 'Tanzania', location: { lat: -3.385, lng: 36.685 } },
  { name: 'Dodoma', country: 'Tanzania', location: { lat: -6.163, lng: 35.751 } },
  { name: 'Zanzibar', country: 'Tanzania', location: { lat: -6.155, lng: 39.192 } },
  { name: 'Dar es Salaam', country: 'Tanzania', location: { lat: -6.852, lng: 39.278 } },
];

// Key Cross-Border Points
const BORDER_POINTS: BorderPoint[] = [
  { code: 'NMG', name: 'Namanga', countries: 'Tanzania - Kenya', location: { lat: -2.545, lng: 36.790 } },
  { code: 'MTK', name: 'Mutukula', countries: 'Tanzania - Uganda', location: { lat: -1.000, lng: 31.417 } },
  { code: 'RSM', name: 'Rusumo', countries: 'Tanzania - Rwanda', location: { lat: -2.383, lng: 30.783 } },
  { code: 'KBG', name: 'Kabanga', countries: 'Tanzania - Burundi', location: { lat: -2.850, lng: 30.500 } },
];

// Active fleet with real coordinates along major transport corridors
const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'TRK-DAR-01',
    plate: 'TZ 4821 AA',
    type: 'truck',
    driver: 'Juma Bakari',
    phone: '+255 754 819 201',
    status: 'In Transit',
    speedKmH: 68,
    heading: 'NW',
    currentLocation: { lat: -6.638, lng: 38.125 }, // Chalinze Corridor (A7/T2)
    destination: 'Dodoma Hub',
    origin: 'Dar es Salaam Port',
    eta: '4h 15m',
    shipmentId: 'SHP-2026-9481',
    cargo: 'Solar Inverters & Lithium Packs (24T)',
  },
  {
    id: 'VAN-ZNZ-03',
    plate: 'ZN 1092 BB',
    type: 'van',
    driver: 'Hamisi Khamis',
    phone: '+255 777 412 889',
    status: 'Delivering',
    speedKmH: 34,
    heading: 'N',
    currentLocation: { lat: -6.163, lng: 39.199 }, // Stone Town Urban
    destination: 'Mnazi Mmoja Clinic',
    origin: 'ZNZ-WH01 Malindi',
    eta: '25 mins',
    shipmentId: 'SHP-2026-3108',
    cargo: 'Cold-Chain Vaccines & Diagnostics',
    tempCelsius: 4.2,
  },
  {
    id: 'TRK-ARU-08',
    plate: 'TZ 9904 CD',
    type: 'truck',
    driver: 'Peter Mwangi',
    phone: '+255 768 334 112',
    status: 'In Transit',
    speedKmH: 72,
    heading: 'N',
    currentLocation: { lat: -2.85, lng: 36.72 }, // Namanga Cross-Border Corridor
    destination: 'Nairobi ICD',
    origin: 'Arusha Depot',
    eta: '1h 50m',
    shipmentId: 'SHP-2026-7840',
    cargo: 'Fresh Horticultural Exports (18T)',
    tempCelsius: 7.5,
  },
  {
    id: 'TRK-MWZ-04',
    plate: 'TZ 3310 EF',
    type: 'truck',
    driver: 'Rashid Selemani',
    phone: '+255 715 009 634',
    status: 'In Transit',
    speedKmH: 58,
    heading: 'NW',
    currentLocation: { lat: -3.65, lng: 33.42 }, // Shinyanga Corridor
    destination: 'Mwanza Lake Depot',
    origin: 'Dodoma',
    eta: '3h 10m',
    shipmentId: 'SHP-2026-5521',
    cargo: 'Industrial Fasteners & Spares (12T)',
  },
];

// Corridor Routes for real polyline rendering
const CENTRAL_CORRIDOR_PATH = [
  { lat: -6.852, lng: 39.278 }, // Dar es Salaam
  { lat: -6.638, lng: 38.125 }, // Chalinze
  { lat: -6.827, lng: 37.659 }, // Morogoro
  { lat: -6.163, lng: 35.751 }, // Dodoma
  { lat: -4.816, lng: 34.743 }, // Singida
  { lat: -3.663, lng: 33.425 }, // Shinyanga
  { lat: -2.535, lng: 32.925 }, // Mwanza
];

const NORTHERN_CORRIDOR_PATH = [
  { lat: -6.852, lng: 39.278 }, // Dar es Salaam
  { lat: -6.638, lng: 38.125 }, // Chalinze
  { lat: -5.394, lng: 38.489 }, // Segera
  { lat: -4.846, lng: 38.488 }, // Korogwe
  { lat: -3.344, lng: 37.340 }, // Moshi
  { lat: -3.385, lng: 36.685 }, // Arusha
  { lat: -2.545, lng: 36.790 }, // Namanga Border
  { lat: -1.292, lng: 36.821 }, // Nairobi
];

const FERRY_CORRIDOR_PATH = [
  { lat: -6.815, lng: 39.295 }, // Dar Port Ferry
  { lat: -6.155, lng: 39.192 }, // Zanzibar Port
];

// Cross-Border Western Corridor Path (to Uganda, Rwanda, Burundi)
const CROSS_BORDER_WEST_PATH = [
  { lat: -2.535, lng: 32.925 }, // Mwanza
  { lat: -1.000, lng: 31.417 }, // Mutukula Border
  { lat: 0.3476, lng: 32.5825 }, // Kampala
];

const RWANDA_BURUNDI_PATH = [
  { lat: -2.535, lng: 32.925 }, // Mwanza
  { lat: -2.383, lng: 30.783 }, // Rusumo Border
  { lat: -1.9441, lng: 30.0619 }, // Kigali
  { lat: -2.850, lng: 30.500 }, // Kabanga Border
  { lat: -3.3822, lng: 29.3644 }, // Bujumbura
];

// Helper projection to map GPS coordinates to SVG viewBox (500 x 360)
function projectCoords(lat: number, lng: number) {
  const minLng = 28.5;
  const maxLng = 41.0;
  const minLat = -8.0;
  const maxLat = 1.0;

  const x = ((lng - minLng) / (maxLng - minLng)) * 500;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 360;
  return { x: Math.max(8, Math.min(492, x)), y: Math.max(8, Math.min(352, y)) };
}

// Component to imperatively render Polylines using Google Maps SDK
function CorridorPolylineOverlay({
  showActiveDeliveries = true,
  showPlannedRoutes = true,
}: {
  showActiveDeliveries?: boolean;
  showPlannedRoutes?: boolean;
}) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');

  useEffect(() => {
    if (!map || !mapsLib) return;

    const lines: google.maps.Polyline[] = [];

    if (showActiveDeliveries) {
      // Central Corridor Line
      const central = new mapsLib.Polyline({
        path: CENTRAL_CORRIDOR_PATH,
        strokeColor: '#2563eb', // Royal Blue
        strokeOpacity: 0.85,
        strokeWeight: 3.5,
        map,
      });
      lines.push(central);

      // Northern Corridor Line
      const northern = new mapsLib.Polyline({
        path: NORTHERN_CORRIDOR_PATH,
        strokeColor: '#0284c7', // Sky Blue
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });
      lines.push(northern);

      // Sea Ferry Line
      const ferry = new mapsLib.Polyline({
        path: FERRY_CORRIDOR_PATH,
        strokeColor: '#0d9488', // Teal
        strokeOpacity: 0.85,
        strokeWeight: 2.5,
        map,
      });
      lines.push(ferry);
    }

    if (showPlannedRoutes) {
      // Cross-border link to Kampala
      const ugandaLine = new mapsLib.Polyline({
        path: CROSS_BORDER_WEST_PATH,
        strokeColor: '#6366f1',
        strokeOpacity: 0.7,
        strokeWeight: 2.5,
        map,
      });
      lines.push(ugandaLine);

      // Cross-border link to Kigali and Bujumbura
      const rwandaBurundiLine = new mapsLib.Polyline({
        path: RWANDA_BURUNDI_PATH,
        strokeColor: '#8b5cf6',
        strokeOpacity: 0.7,
        strokeWeight: 2.5,
        map,
      });
      lines.push(rwandaBurundiLine);
    }

    return () => {
      lines.forEach((l) => l.setMap(null));
    };
  }, [map, mapsLib, showActiveDeliveries, showPlannedRoutes]);

  return null;
}

// Inner Map Controller component for interactive camera panning
function MapController({
  selectedVehicle,
  selectedHub,
  selectedCity,
  selectedBorder,
}: {
  selectedVehicle: FleetVehicle | null;
  selectedHub: LogisticsHub | null;
  selectedCity: RegionalCity | null;
  selectedBorder: BorderPoint | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedVehicle) {
      map.panTo(selectedVehicle.currentLocation);
      map.setZoom(9);
    } else if (selectedHub) {
      map.panTo(selectedHub.location);
      map.setZoom(11);
    } else if (selectedCity) {
      map.panTo(selectedCity.location);
      map.setZoom(9);
    } else if (selectedBorder) {
      map.panTo(selectedBorder.location);
      map.setZoom(10);
    }
  }, [map, selectedVehicle, selectedHub, selectedCity, selectedBorder]);

  return null;
}

// Status monitor inside APIProvider to detect Auth Failure or Referrer Restriction
function ApiStatusMonitor({ onAuthFailure }: { onAuthFailure: () => void }) {
  const status = useApiLoadingStatus();

  useEffect(() => {
    if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
      onAuthFailure();
    }
  }, [status, onAuthFailure]);

  return null;
}

// Interactive Vector Fallback Map Component (Fully feature-complete with live telematics)
function InteractiveVectorMap({
  heightClass,
  variant,
  filterType,
  setFilterType,
  filteredVehicles,
  showTransporters,
  showActiveDeliveries,
  showPlannedRoutes,
  showHubs,
  showBorderPoints,
  showCities,
  toggleLegendLayer,
  selectedVehicle,
  setSelectedVehicle,
  selectedHub,
  setSelectedHub,
  selectedCity,
  setSelectedCity,
  selectedBorder,
  setSelectedBorder,
  referrerNoticeDismissed,
  setReferrerNoticeDismissed,
  onRetryMaps,
}: {
  heightClass: string;
  variant: string;
  filterType: 'all' | 'truck' | 'van' | 'hub';
  setFilterType: (f: 'all' | 'truck' | 'van' | 'hub') => void;
  filteredVehicles: FleetVehicle[];
  showTransporters: boolean;
  showActiveDeliveries: boolean;
  showPlannedRoutes: boolean;
  showHubs: boolean;
  showBorderPoints: boolean;
  showCities: boolean;
  toggleLegendLayer: (layer: string) => void;
  selectedVehicle: FleetVehicle | null;
  setSelectedVehicle: (v: FleetVehicle | null) => void;
  selectedHub: LogisticsHub | null;
  setSelectedHub: (h: LogisticsHub | null) => void;
  selectedCity: RegionalCity | null;
  setSelectedCity: (c: RegionalCity | null) => void;
  selectedBorder: BorderPoint | null;
  setSelectedBorder: (b: BorderPoint | null) => void;
  referrerNoticeDismissed: boolean;
  setReferrerNoticeDismissed: (d: boolean) => void;
  onRetryMaps: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const isTransporter = variant === 'transporter';

  // SVG projected paths for corridors
  const centralPathD = useMemo(() => {
    return CENTRAL_CORRIDOR_PATH.map((pt, idx) => {
      const p = projectCoords(pt.lat, pt.lng);
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');
  }, []);

  const northernPathD = useMemo(() => {
    return NORTHERN_CORRIDOR_PATH.map((pt, idx) => {
      const p = projectCoords(pt.lat, pt.lng);
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');
  }, []);

  const ferryPathD = useMemo(() => {
    return FERRY_CORRIDOR_PATH.map((pt, idx) => {
      const p = projectCoords(pt.lat, pt.lng);
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');
  }, []);

  const westUgandaPathD = useMemo(() => {
    return CROSS_BORDER_WEST_PATH.map((pt, idx) => {
      const p = projectCoords(pt.lat, pt.lng);
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');
  }, []);

  const rwandaBurundiPathD = useMemo(() => {
    return RWANDA_BURUNDI_PATH.map((pt, idx) => {
      const p = projectCoords(pt.lat, pt.lng);
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');
  }, []);

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl border border-slate-200/90 bg-[#0f172a] shadow-xs flex flex-col select-none`}>
      {/* Informative Referrer Notice Banner if in preview environment */}
      {!referrerNoticeDismissed && (
        <div className="absolute top-0 inset-x-0 z-40 bg-amber-500/95 text-slate-950 px-3 py-1 text-[11px] font-medium flex items-center justify-between shadow-sm backdrop-blur-xs">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-slate-950" />
            <span className="truncate">
              <strong>Google Maps Platform:</strong> Authorize origin in Cloud Console for full map tiles. Interactive East Africa Corridor tracking is active.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={onRetryMaps}
              className="inline-flex items-center gap-1 rounded bg-slate-900/10 px-2 py-0.5 text-[10px] font-bold hover:bg-slate-900/20 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
            <button
              onClick={() => setReferrerNoticeDismissed(true)}
              className="text-slate-900 hover:text-black p-0.5"
              aria-label="Dismiss notice"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas for East Africa Regional Corridor */}
      <div className="relative w-full h-full overflow-hidden bg-[#0a1122]">
        <svg
          viewBox="0 0 500 360"
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* Subtle Grid Pattern */}
          <defs>
            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="truckGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Map */}
          <rect width="500" height="360" fill="#090e1a" />
          <rect width="500" height="360" fill="url(#grid)" />

          {/* Country Borders Representation (Uganda, Kenya, Rwanda, Burundi, Tanzania) */}
          <path
            d="M 40 10 L 460 10 Q 440 90 415 150 Q 395 210 425 255 Q 445 295 410 340 Q 350 355 120 355 L 40 355 Z"
            fill="#111c33"
            stroke="#1e3a5f"
            strokeWidth="1.2"
            opacity="0.85"
          />

          {/* Country Region Labels */}
          <text x="140" y="45" fontSize="10" fill="#64748b" fontWeight="800" opacity="0.6" letterSpacing="2">
            UGANDA
          </text>
          <text x="330" y="45" fontSize="10" fill="#64748b" fontWeight="800" opacity="0.6" letterSpacing="2">
            KENYA
          </text>
          <text x="55" y="110" fontSize="8" fill="#64748b" fontWeight="700" opacity="0.6">
            RWANDA
          </text>
          <text x="45" y="150" fontSize="8" fill="#64748b" fontWeight="700" opacity="0.6">
            BURUNDI
          </text>
          <text x="260" y="270" fontSize="12" fill="#64748b" fontWeight="900" opacity="0.4" letterSpacing="4">
            TANZANIA
          </text>

          {/* Lake Victoria */}
          <ellipse cx="170" cy="115" rx="42" ry="36" fill="#0a1d37" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="2 2" />
          <text x="170" y="118" fontSize="8" fill="#38bdf8" textAnchor="middle" opacity="0.6" fontWeight="600">
            LAKE VICTORIA
          </text>

          {/* Lake Tanganyika Accent */}
          <path
            d="M 50 170 Q 70 240 85 340"
            fill="none"
            stroke="#0284c7"
            strokeWidth="6"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />

          {/* Indian Ocean & Coastline Accent */}
          <path
            d="M 435 10 Q 410 120 405 190 Q 400 230 435 260 Q 450 300 425 355 L 500 355 L 500 10 Z"
            fill="#061224"
            opacity="0.95"
          />
          <text x="465" y="160" fontSize="8" fill="#0284c7" textAnchor="middle" opacity="0.5" fontWeight="600" transform="rotate(75, 465, 160)">
            INDIAN OCEAN
          </text>

          {/* Zanzibar Island */}
          <ellipse cx="438" cy="245" rx="7" ry="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
          <text x="449" y="248" fontSize="7" fill="#93c5fd" fontWeight="700">Zanzibar</text>

          {/* 1. Planned Routes (Dashed Lines) */}
          {showPlannedRoutes && (
            <g>
              <path d={westUgandaPathD} fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" opacity="0.8" />
              <path d={rwandaBurundiPathD} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" opacity="0.8" />
            </g>
          )}

          {/* 2. Active Deliveries Corridors */}
          {showActiveDeliveries && (
            <g>
              <path d={centralPathD} fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              <path d={centralPathD} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" />
              <path d={northernPathD} fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
              <path d={ferryPathD} fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
            </g>
          )}

          {/* 3. Cities */}
          {showCities &&
            REGIONAL_CITIES.map((c, idx) => {
              const pos = projectCoords(c.location.lat, c.location.lng);
              const isSelected = selectedCity?.name === c.name;
              return (
                <g
                  key={idx}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCity(c);
                    setSelectedVehicle(null);
                    setSelectedHub(null);
                    setSelectedBorder(null);
                  }}
                >
                  <circle cx="0" cy="0" r={isSelected ? 4.5 : 3} fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
                  <text x="5" y="3" fontSize="8" fill="#e2e8f0" fontWeight="600">
                    {c.name}
                  </text>
                </g>
              );
            })}

          {/* 4. Border Points */}
          {showBorderPoints &&
            BORDER_POINTS.map((bp) => {
              const pos = projectCoords(bp.location.lat, bp.location.lng);
              const isSelected = selectedBorder?.code === bp.code;
              return (
                <g
                  key={bp.code}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedBorder(bp);
                    setSelectedVehicle(null);
                    setSelectedHub(null);
                    setSelectedCity(null);
                  }}
                >
                  <circle cx="0" cy="0" r="5" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="2" fill="#a855f7" />
                  <text x="6" y="-3" fontSize="7" fill="#c084fc" fontWeight="700">
                    {bp.name}
                  </text>
                </g>
              );
            })}

          {/* 5. Logistics Hubs / Warehouses */}
          {showHubs &&
            LOGISTICS_HUBS.map((hub) => {
              const pos = projectCoords(hub.location.lat, hub.location.lng);
              const isSelected = selectedHub?.code === hub.code;
              return (
                <g
                  key={hub.code}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedHub(hub);
                    setSelectedVehicle(null);
                    setSelectedCity(null);
                    setSelectedBorder(null);
                  }}
                >
                  <circle cx="0" cy="0" r="14" fill="url(#hubGlow)" />
                  <circle cx="0" cy="0" r={isSelected ? 8 : 6} fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="7" y="10" fontSize="7" fill="#f87171" fontWeight="700">
                    {hub.code}
                  </text>
                </g>
              );
            })}

          {/* 6. Transporters / Fleet Vehicles */}
          {showTransporters &&
            filteredVehicles.map((vehicle) => {
              const pos = projectCoords(vehicle.currentLocation.lat, vehicle.currentLocation.lng);
              const isSelected = selectedVehicle?.id === vehicle.id;
              return (
                <g
                  key={vehicle.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setSelectedHub(null);
                    setSelectedCity(null);
                    setSelectedBorder(null);
                  }}
                >
                  <circle cx="0" cy="0" r={isSelected ? 18 : 14} fill="url(#truckGlow)" />
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? 8 : 6}
                    fill={vehicle.type === 'truck' ? '#2563eb' : '#6366f1'}
                    stroke={isSelected ? '#fbbf24' : '#ffffff'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <rect
                    x="-30"
                    y="-17"
                    width="60"
                    height="12"
                    rx="3"
                    fill="#020617"
                    stroke="#334155"
                    strokeWidth="0.8"
                    opacity="0.95"
                  />
                  <text x="0" y="-8" fontSize="6.5" fill="#f8fafc" fontWeight="700" textAnchor="middle">
                    {vehicle.plate} • {vehicle.speedKmH}km/h
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Selected Vehicle Info Card */}
        {selectedVehicle && (
          <div className="absolute top-10 right-3 z-30 w-72 rounded-xl bg-slate-900/95 p-3 text-white shadow-xl border border-slate-700 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{selectedVehicle.id}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedVehicle.plate}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-2 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Driver:</span>
                <span className="font-semibold text-slate-200">{selectedVehicle.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telematics:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {selectedVehicle.speedKmH} km/h • {selectedVehicle.heading}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route:</span>
                <span className="font-medium text-slate-200 truncate max-w-[140px]">
                  {selectedVehicle.origin} → {selectedVehicle.destination}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ETA:</span>
                <span className="font-bold text-blue-400">{selectedVehicle.eta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cargo:</span>
                <span className="font-mono text-slate-300 truncate max-w-[140px]">{selectedVehicle.cargo}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-slate-700/80 pt-2">
              <button
                onClick={() => alert(`Calling driver: ${selectedVehicle.driver} at ${selectedVehicle.phone}`)}
                className="flex-1 rounded-md bg-blue-600 py-1.5 text-center text-[10px] font-bold text-white hover:bg-blue-500 transition-colors shadow-xs"
              >
                Call Driver
              </button>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="rounded-md bg-slate-800 px-2.5 py-1.5 text-[10px] font-medium text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Selected Hub Card */}
        {selectedHub && (
          <div className="absolute top-10 right-3 z-30 w-64 rounded-xl bg-slate-900/95 p-3 text-white shadow-xl border border-slate-700 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
              <div className="flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-xs">{selectedHub.name}</span>
              </div>
              <button onClick={() => setSelectedHub(null)}><X className="h-3 w-3 text-slate-400" /></button>
            </div>
            <div className="mt-2 text-[11px] space-y-1 text-slate-300">
              <div className="flex justify-between"><span>Manager:</span><span className="font-bold">{selectedHub.manager}</span></div>
              <div className="flex justify-between"><span>Capacity:</span><span>{selectedHub.capacity}</span></div>
              <div className="flex justify-between"><span>Occupancy:</span><span className="text-emerald-400 font-bold">{selectedHub.occupancyPct}%</span></div>
            </div>
          </div>
        )}

        {/* Selected Border Point Card */}
        {selectedBorder && (
          <div className="absolute top-10 right-3 z-30 w-64 rounded-xl bg-slate-900/95 p-3 text-white shadow-xl border border-slate-700 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
              <div className="flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-purple-400" />
                <span className="font-bold text-xs">{selectedBorder.name} Border Post</span>
              </div>
              <button onClick={() => setSelectedBorder(null)}><X className="h-3 w-3 text-slate-400" /></button>
            </div>
            <div className="mt-2 text-[11px] space-y-1 text-slate-300">
              <div className="flex justify-between"><span>Corridor:</span><span className="font-bold">{selectedBorder.countries}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="text-emerald-400 font-bold">Open (24/7 Clearance)</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Transporter Legend Overlay Matching Reference Screenshot */}
      {isTransporter && (
        <div className="absolute top-2 right-2 z-20 rounded-lg bg-white/95 p-2 text-slate-800 shadow-md border border-slate-200 backdrop-blur-md text-[10px] space-y-1">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showTransporters}
              onChange={() => toggleLegendLayer('transporters')}
              className="rounded text-blue-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <Truck className="h-3 w-3 text-blue-600" /> Show Transporters
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600">
            <input
              type="checkbox"
              checked={showActiveDeliveries}
              onChange={() => toggleLegendLayer('active')}
              className="rounded text-emerald-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Deliveries
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600">
            <input
              type="checkbox"
              checked={showPlannedRoutes}
              onChange={() => toggleLegendLayer('routes')}
              className="rounded text-indigo-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-3 border-t border-dashed border-indigo-600" /> Planned Routes
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-red-600">
            <input
              type="checkbox"
              checked={showHubs}
              onChange={() => toggleLegendLayer('hubs')}
              className="rounded text-red-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <Warehouse className="h-3 w-3 text-red-600" /> Warehouse
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-purple-600">
            <input
              type="checkbox"
              checked={showBorderPoints}
              onChange={() => toggleLegendLayer('borders')}
              className="rounded text-purple-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <Crosshair className="h-3 w-3 text-purple-600" /> Border Point
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showCities}
              onChange={() => toggleLegendLayer('cities')}
              className="rounded text-blue-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> City
            </span>
          </label>
        </div>
      )}

      {/* Floating Top Left Controls */}
      {!isTransporter && (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 rounded-lg bg-slate-900/85 px-2.5 py-1 text-[10px] font-semibold text-white shadow-md border border-slate-700/80 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>East Africa Corridor</span>
          <span className="text-slate-500 font-normal">|</span>
          <span className="text-emerald-400">Active GPS Telematics</span>
        </div>
      )}

      {/* Floating Bottom Left Reset Bar */}
      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5">
        <button
          onClick={() => {
            setSelectedVehicle(null);
            setSelectedHub(null);
            setSelectedCity(null);
            setSelectedBorder(null);
            setZoom(1);
          }}
          className="flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-800 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors backdrop-blur-xs"
        >
          <Compass className="h-3 w-3 text-blue-600" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Floating Bottom Right Zoom & Fullscreen Controls Matching Screenshot */}
      <div className="absolute bottom-2 right-2 z-20 flex flex-col items-center gap-1 bg-white/95 rounded-lg p-1 border border-slate-200 shadow-md backdrop-blur-xs">
        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.25))}
          className="h-6 w-6 flex items-center justify-center rounded text-xs font-bold text-slate-700 hover:bg-slate-100"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
          className="h-6 w-6 flex items-center justify-center rounded text-xs font-bold text-slate-700 hover:bg-slate-100 border-t border-slate-100"
          title="Zoom Out"
        >
          -
        </button>
      </div>
    </div>
  );
}

export function RouteMap({
  variant = 'admin',
  heightClass = 'h-72',
  interactive = true,
}: RouteMapProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [selectedHub, setSelectedHub] = useState<LogisticsHub | null>(null);
  const [selectedCity, setSelectedCity] = useState<RegionalCity | null>(null);
  const [selectedBorder, setSelectedBorder] = useState<BorderPoint | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'truck' | 'van' | 'hub'>('all');
  const [authFailed, setAuthFailed] = useState<boolean>(false);
  const [referrerNoticeDismissed, setReferrerNoticeDismissed] = useState<boolean>(false);
  const [retryKey, setRetryKey] = useState<number>(0);

  // Transporter Legend Layer Toggles
  const [showTransporters, setShowTransporters] = useState(true);
  const [showActiveDeliveries, setShowActiveDeliveries] = useState(true);
  const [showPlannedRoutes, setShowPlannedRoutes] = useState(true);
  const [showHubs, setShowHubs] = useState(true);
  const [showBorderPoints, setShowBorderPoints] = useState(true);
  const [showCities, setShowCities] = useState(true);

  const isTransporter = variant === 'transporter';

  const toggleLegendLayer = useCallback((layer: string) => {
    if (layer === 'transporters') setShowTransporters((v) => !v);
    if (layer === 'active') setShowActiveDeliveries((v) => !v);
    if (layer === 'routes') setShowPlannedRoutes((v) => !v);
    if (layer === 'hubs') setShowHubs((v) => !v);
    if (layer === 'borders') setShowBorderPoints((v) => !v);
    if (layer === 'cities') setShowCities((v) => !v);
  }, []);

  // Priority API Key: In the AI Studio preview environment, the auto-provisioned demo key
  // is guaranteed to load without domain referrer restriction. If custom key is provided,
  // we attempt it and fall back to demo or vector map upon restriction.
  const demoApiKey = 'AIzaSyCS8UiQb4hdx1Zm6XDGuRsCovqRr4PrEvI';
  const provisionedKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  const customKey = process.env.VITE_GOOGLE_MAP_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Selected API key: prefer provisioned/demo key first to avoid RefererNotAllowedMapError on preview runners
  const apiKey = provisionedKey || demoApiKey || customKey;

  // Listen to the custom auth failure event dispatched by our global interceptor in layout.tsx
  useEffect(() => {
    const handleAuthFail = () => {
      setAuthFailed(true);
    };

    window.addEventListener('gmp-auth-failure', handleAuthFail);
    return () => {
      window.removeEventListener('gmp-auth-failure', handleAuthFail);
    };
  }, []);

  // Filter vehicles based on active filter
  const filteredVehicles = useMemo(() => {
    if (filterType === 'all') return FLEET_VEHICLES;
    if (filterType === 'truck') return FLEET_VEHICLES.filter((v) => v.type === 'truck');
    if (filterType === 'van') return FLEET_VEHICLES.filter((v) => v.type === 'van');
    return [];
  }, [filterType]);

  const handleResetView = useCallback(() => {
    setSelectedVehicle(null);
    setSelectedHub(null);
    setSelectedCity(null);
    setSelectedBorder(null);
  }, []);

  const handleRetryMaps = useCallback(() => {
    setAuthFailed(false);
    setRetryKey((k) => k + 1);
  }, []);

  // If auth fails (e.g. RefererNotAllowedMapError on preview domain) or no key, display the interactive vector map
  if (authFailed || !apiKey) {
    return (
      <InteractiveVectorMap
        heightClass={heightClass}
        variant={variant}
        filterType={filterType}
        setFilterType={setFilterType}
        filteredVehicles={filteredVehicles}
        showTransporters={showTransporters}
        showActiveDeliveries={showActiveDeliveries}
        showPlannedRoutes={showPlannedRoutes}
        showHubs={showHubs}
        showBorderPoints={showBorderPoints}
        showCities={showCities}
        toggleLegendLayer={toggleLegendLayer}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        selectedHub={selectedHub}
        setSelectedHub={setSelectedHub}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedBorder={selectedBorder}
        setSelectedBorder={setSelectedBorder}
        referrerNoticeDismissed={referrerNoticeDismissed}
        setReferrerNoticeDismissed={setReferrerNoticeDismissed}
        onRetryMaps={handleRetryMaps}
      />
    );
  }

  return (
    <div
      key={retryKey}
      className={`relative w-full ${heightClass} overflow-hidden rounded-xl border border-slate-200/90 bg-slate-900 shadow-xs flex flex-col`}
    >
      <APIProvider
        apiKey={apiKey}
        libraries={['maps', 'places', 'geometry']}
        onError={() => setAuthFailed(true)}
      >
        <ApiStatusMonitor onAuthFailure={() => setAuthFailed(true)} />

        <Map
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          mapId="DEMO_MAP_ID"
          defaultCenter={isTransporter ? { lat: -3.5, lng: 35.5 } : { lat: -5.85, lng: 37.8 }}
          defaultZoom={isTransporter ? 5 : 6}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
          className="w-full h-full"
        >
          {/* Corridor Polylines */}
          <CorridorPolylineOverlay
            showActiveDeliveries={showActiveDeliveries}
            showPlannedRoutes={showPlannedRoutes}
          />

          {/* Camera Controller */}
          <MapController
            selectedVehicle={selectedVehicle}
            selectedHub={selectedHub}
            selectedCity={selectedCity}
            selectedBorder={selectedBorder}
          />

          {/* Warehouse & Logistics Hub Markers */}
          {showHubs &&
            LOGISTICS_HUBS.map((hub) => (
              <AdvancedMarker
                key={hub.code}
                position={hub.location}
                title={`${hub.code} - ${hub.name}`}
                onClick={() => {
                  setSelectedHub(hub);
                  setSelectedVehicle(null);
                  setSelectedCity(null);
                  setSelectedBorder(null);
                }}
              >
                <div className="group relative flex flex-col items-center cursor-pointer">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white shadow-md ring-2 ring-white transition-transform group-hover:scale-110">
                    <Warehouse className="h-4 w-4" />
                  </div>
                  <span className="mt-1 rounded bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-xs whitespace-nowrap">
                    {hub.code}
                  </span>
                </div>
              </AdvancedMarker>
            ))}

          {/* Border Points Markers */}
          {showBorderPoints &&
            BORDER_POINTS.map((bp) => (
              <AdvancedMarker
                key={bp.code}
                position={bp.location}
                title={`${bp.name} Border`}
                onClick={() => {
                  setSelectedBorder(bp);
                  setSelectedVehicle(null);
                  setSelectedHub(null);
                  setSelectedCity(null);
                }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white shadow-md ring-2 ring-white">
                  <Crosshair className="h-3.5 w-3.5" />
                </div>
              </AdvancedMarker>
            ))}

          {/* Cities Markers */}
          {showCities &&
            REGIONAL_CITIES.map((c) => (
              <AdvancedMarker
                key={c.name}
                position={c.location}
                title={`${c.name}, ${c.country}`}
                onClick={() => {
                  setSelectedCity(c);
                  setSelectedVehicle(null);
                  setSelectedHub(null);
                  setSelectedBorder(null);
                }}
              >
                <div className="flex items-center gap-1 rounded-full bg-blue-600/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs border border-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>{c.name}</span>
                </div>
              </AdvancedMarker>
            ))}

          {/* Active Transporter Fleet Vehicle Markers */}
          {showTransporters &&
            filteredVehicles.map((vehicle) => {
              const isSelected = selectedVehicle?.id === vehicle.id;
              return (
                <AdvancedMarker
                  key={vehicle.id}
                  position={vehicle.currentLocation}
                  title={`${vehicle.plate} (${vehicle.driver})`}
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setSelectedHub(null);
                    setSelectedCity(null);
                    setSelectedBorder(null);
                  }}
                >
                  <div className="group relative flex flex-col items-center cursor-pointer">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg ring-2 ring-white transition-all duration-300 ${
                        vehicle.type === 'truck' ? 'bg-blue-600' : 'bg-indigo-600'
                      } ${isSelected ? 'scale-125 ring-amber-400' : 'hover:scale-110'}`}
                    >
                      <Truck className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-1 ring-white" />
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 rounded bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-xs backdrop-blur-xs">
                      <span>{vehicle.plate}</span>
                      <span className="text-emerald-400 font-mono text-[8px]">{vehicle.speedKmH}km/h</span>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* InfoWindows */}
          {selectedVehicle && (
            <InfoWindow
              position={selectedVehicle.currentLocation}
              onCloseClick={() => setSelectedVehicle(null)}
              headerContent={
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Truck className="h-3 w-3 text-blue-600" />
                  <span>{selectedVehicle.id} • {selectedVehicle.plate}</span>
                </div>
              }
            >
              <div className="p-1 min-w-[200px] text-[11px] text-slate-700 space-y-1">
                <div>Driver: <strong>{selectedVehicle.driver}</strong></div>
                <div>Speed: <strong className="text-emerald-600">{selectedVehicle.speedKmH} km/h</strong></div>
                <div>Route: <span>{selectedVehicle.origin} → {selectedVehicle.destination}</span></div>
                <div>ETA: <strong className="text-blue-600">{selectedVehicle.eta}</strong></div>
              </div>
            </InfoWindow>
          )}

          {selectedHub && (
            <InfoWindow
              position={selectedHub.location}
              onCloseClick={() => setSelectedHub(null)}
              headerContent={
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Warehouse className="h-3 w-3 text-red-600" />
                  <span>{selectedHub.code} • {selectedHub.name}</span>
                </div>
              }
            >
              <div className="p-1 min-w-[180px] text-[11px] text-slate-700 space-y-1">
                <div>Manager: <strong>{selectedHub.manager}</strong></div>
                <div>Capacity: <span>{selectedHub.capacity}</span></div>
                <div>Occupancy: <strong className="text-emerald-600">{selectedHub.occupancyPct}%</strong></div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Transporter Legend Overlay on Google Map */}
      {isTransporter && (
        <div className="absolute top-2 right-2 z-20 rounded-lg bg-white/95 p-2 text-slate-800 shadow-md border border-slate-200 backdrop-blur-md text-[10px] space-y-1">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showTransporters}
              onChange={() => toggleLegendLayer('transporters')}
              className="rounded text-blue-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <Truck className="h-3 w-3 text-blue-600" /> Show Transporters
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600">
            <input
              type="checkbox"
              checked={showActiveDeliveries}
              onChange={() => toggleLegendLayer('active')}
              className="rounded text-emerald-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Deliveries
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600">
            <input
              type="checkbox"
              checked={showPlannedRoutes}
              onChange={() => toggleLegendLayer('routes')}
              className="rounded text-indigo-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-3 border-t border-dashed border-indigo-600" /> Planned Routes
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-red-600">
            <input
              type="checkbox"
              checked={showHubs}
              onChange={() => toggleLegendLayer('hubs')}
              className="rounded text-red-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <Warehouse className="h-3 w-3 text-red-600" /> Warehouse
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-purple-600">
            <input
              type="checkbox"
              checked={showBorderPoints}
              onChange={() => toggleLegendLayer('borders')}
              className="rounded text-purple-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <Crosshair className="h-3 w-3 text-purple-600" /> Border Point
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showCities}
              onChange={() => toggleLegendLayer('cities')}
              className="rounded text-blue-600 h-3 w-3"
            />
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> City
            </span>
          </label>
        </div>
      )}

      {/* Floating Bottom Left Reset Bar */}
      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5">
        <button
          onClick={handleResetView}
          className="flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-800 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors backdrop-blur-xs"
        >
          <Compass className="h-3 w-3 text-blue-600" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
}

export default RouteMap;
