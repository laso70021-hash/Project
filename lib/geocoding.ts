// Global Geocoding & Worldwide Logistics Location Engine
// Supports dynamic worldwide coordinates (-90 to +90 lat, -180 to +180 lng),
// reverse geocoding, multi-result disambiguation, and offline resilience for major international ports & hubs.

export interface LocationPoint {
  id?: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  region?: string;
  lat: number;
  lng: number;
  type?: 'warehouse' | 'port' | 'airport' | 'hub' | 'delivery' | 'pickup' | 'customs';
  timezone?: string;
}

export type TransportMode = 'road' | 'sea' | 'air' | 'rail' | 'intermodal';

export interface ShipmentLeg {
  id: string;
  mode: TransportMode;
  origin: LocationPoint;
  destination: LocationPoint;
  status: 'Scheduled' | 'In Transit' | 'Completed' | 'Pending';
  geometryType: 'road_confirmed' | 'sea_corridor' | 'air_corridor' | 'rail_network' | 'estimated';
  path?: { lat: number; lng: number }[];
  carrierName?: string;
  vesselOrFlight?: string;
  departureTime?: string;
  arrivalTime?: string;
  distanceKm?: number;
  notes?: string;
}

// Coordinate validator ensuring valid global bounds
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// Great-circle distance between two geographic coordinates in kilometers
export function calculateHaversineDistanceKm(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Generate curved Great Circle points between two global coordinates for air flights
export function generateGreatCircleArc(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  numPoints: number = 20
): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  const lat1 = (start.lat * Math.PI) / 180;
  const lon1 = (start.lng * Math.PI) / 180;
  const lat2 = (end.lat * Math.PI) / 180;
  const lon2 = (end.lng * Math.PI) / 180;

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)
      )
    );

  if (d === 0) return [start, end];

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    const lon = Math.atan2(y, x);

    points.push({
      lat: (lat * 180) / Math.PI,
      lng: (lon * 180) / Math.PI,
    });
  }
  return points;
}

// Comprehensive Global Logistics Directory covering all continents
export const WORLDWIDE_LOGISTICS_HUBS: LocationPoint[] = [
  // --- AFRICA ---
  {
    id: 'hub-dar',
    name: 'Dar es Salaam Central Port & Hub',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    region: 'East Africa',
    lat: -6.852,
    lng: 39.278,
    type: 'port',
    address: 'Bandari Road, Kurasini, Dar es Salaam',
  },
  {
    id: 'hub-znz',
    name: 'Zanzibar Malindi Sea Terminal',
    city: 'Zanzibar',
    country: 'Tanzania',
    region: 'East Africa',
    lat: -6.155,
    lng: 39.192,
    type: 'port',
    address: 'Malindi Port Wharf, Stone Town, Zanzibar',
  },
  {
    id: 'hub-nbo',
    name: 'Nairobi Jomo Kenyatta Inland Cargo Hub',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'East Africa',
    lat: -1.3192,
    lng: 36.9275,
    type: 'airport',
    address: 'Embakasi Cargo Village, Nairobi',
  },
  {
    id: 'hub-mba',
    name: 'Mombasa Kilindini Port',
    city: 'Mombasa',
    country: 'Kenya',
    region: 'East Africa',
    lat: -4.0547,
    lng: 39.6483,
    type: 'port',
    address: 'Kilindini Harbour, Mombasa',
  },
  {
    id: 'hub-kgl',
    name: 'Kigali Dry Port Logistics Platform',
    city: 'Kigali',
    country: 'Rwanda',
    region: 'East Africa',
    lat: -1.9706,
    lng: 30.1044,
    type: 'hub',
    address: 'Masaka Special Economic Zone, Kigali',
  },
  {
    id: 'hub-kmp',
    name: 'Kampala Namanve Inland Container Depot',
    city: 'Kampala',
    country: 'Uganda',
    region: 'East Africa',
    lat: 0.3542,
    lng: 32.6958,
    type: 'hub',
    address: 'Namanve Industrial Park, Kampala',
  },
  {
    id: 'hub-los',
    name: 'Lagos Apapa Port Terminal',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'West Africa',
    lat: 6.4447,
    lng: 3.3644,
    type: 'port',
    address: 'Apapa Quays, Lagos',
  },
  {
    id: 'hub-jnb',
    name: 'Johannesburg City Deep Container Terminal',
    city: 'Johannesburg',
    country: 'South Africa',
    region: 'Southern Africa',
    lat: -26.2235,
    lng: 28.0906,
    type: 'hub',
    address: 'Heidelberg Road, City Deep, Johannesburg',
  },
  {
    id: 'hub-cai',
    name: 'Cairo International Cargo City',
    city: 'Cairo',
    country: 'Egypt',
    region: 'North Africa',
    lat: 30.1219,
    lng: 31.4056,
    type: 'airport',
    address: 'Cairo Airport Cargo Zone, Cairo',
  },

  // --- EUROPE ---
  {
    id: 'hub-rtm',
    name: 'Port of Rotterdam Maasvlakte Terminal',
    city: 'Rotterdam',
    country: 'Netherlands',
    region: 'Western Europe',
    lat: 51.9545,
    lng: 4.0256,
    type: 'port',
    address: 'Europaweg 902, 3199 LC Rotterdam',
  },
  {
    id: 'hub-lon',
    name: 'London Gateway & Heathrow Cargo Hub',
    city: 'London',
    country: 'United Kingdom',
    region: 'Western Europe',
    lat: 51.5048,
    lng: 0.4638,
    type: 'port',
    address: 'Stanford-le-Hope, Essex SS17 9DY, London',
  },
  {
    id: 'hub-ams',
    name: 'Amsterdam Schiphol Logistics Hub',
    city: 'Amsterdam',
    country: 'Netherlands',
    region: 'Western Europe',
    lat: 52.3105,
    lng: 4.7683,
    type: 'airport',
    address: 'Evert van de Beekstraat 202, Schiphol',
  },
  {
    id: 'hub-fra',
    name: 'Frankfurt CargoCity South',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'Central Europe',
    lat: 50.0379,
    lng: 8.5622,
    type: 'airport',
    address: 'Gebäude 537, 60549 Frankfurt am Main',
  },
  {
    id: 'hub-ber',
    name: 'Berlin Brandenburg Cargo Center',
    city: 'Berlin',
    country: 'Germany',
    region: 'Central Europe',
    lat: 52.3667,
    lng: 13.5033,
    type: 'hub',
    address: 'Willy-Brandt-Platz 1, 12529 Schönefeld, Berlin',
  },
  {
    id: 'hub-par',
    name: 'Paris Charles de Gaulle Cargo City',
    city: 'Paris',
    country: 'France',
    region: 'Western Europe',
    lat: 49.0097,
    lng: 2.5479,
    type: 'airport',
    address: 'Zone de Fret 4, 95700 Roissy-en-France, Paris',
  },

  // --- MIDDLE EAST & ASIA ---
  {
    id: 'hub-dxb',
    name: 'Dubai Jebel Ali Port & DWC Logistics Hub',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    lat: 25.0089,
    lng: 55.0673,
    type: 'port',
    address: 'Jebel Ali Free Zone, Dubai',
  },
  {
    id: 'hub-bom',
    name: 'Mumbai Jawaharlal Nehru Port (JNPT)',
    city: 'Mumbai',
    country: 'India',
    region: 'South Asia',
    lat: 18.9496,
    lng: 72.9515,
    type: 'port',
    address: 'Nhava Sheva, Navi Mumbai, Maharashtra',
  },
  {
    id: 'hub-sin',
    name: 'Singapore Pasir Panjang Terminal',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    lat: 1.2844,
    lng: 103.7828,
    type: 'port',
    address: 'Pasir Panjang Terminal, Singapore 117387',
  },
  {
    id: 'hub-sha',
    name: 'Shanghai Yangshan Deepwater Port',
    city: 'Shanghai',
    country: 'China',
    region: 'East Asia',
    lat: 30.6276,
    lng: 122.0628,
    type: 'port',
    address: 'Yangshan Island, Shanghai Port Zone',
  },
  {
    id: 'hub-tyo',
    name: 'Tokyo Narita & Port of Yokohama Gateway',
    city: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    lat: 35.772,
    lng: 140.3929,
    type: 'airport',
    address: 'Narita Airport Cargo Area, Chiba/Tokyo',
  },

  // --- NORTH AMERICA ---
  {
    id: 'hub-jfk',
    name: 'New York JFK & Port of NY/NJ Intermodal Hub',
    city: 'New York',
    country: 'United States',
    region: 'North America',
    lat: 40.6413,
    lng: -73.7781,
    type: 'airport',
    address: 'Building 14, JFK International Airport, Jamaica, NY 11430',
  },
  {
    id: 'hub-lax',
    name: 'Port of Los Angeles & Long Beach Terminal',
    city: 'Los Angeles',
    country: 'United States',
    region: 'North America',
    lat: 33.7432,
    lng: -118.2673,
    type: 'port',
    address: '425 S Palos Verdes St, San Pedro, CA 90731',
  },
  {
    id: 'hub-ord',
    name: 'Chicago O\'Hare International Cargo Center',
    city: 'Chicago',
    country: 'United States',
    region: 'North America',
    lat: 41.9742,
    lng: -87.9073,
    type: 'hub',
    address: 'South Cargo Area, O\'Hare, Chicago, IL 60666',
  },
  {
    id: 'hub-yyz',
    name: 'Toronto Pearson Vista Cargo Hub',
    city: 'Toronto',
    country: 'Canada',
    region: 'North America',
    lat: 43.6777,
    lng: -79.6248,
    type: 'airport',
    address: 'Silver Dart Dr, Mississauga, ON L5P 1B2, Toronto',
  },
  {
    id: 'hub-mex',
    name: 'Mexico City AIFA & Pantaco Logistics Terminal',
    city: 'Mexico City',
    country: 'Mexico',
    region: 'North America',
    lat: 19.4361,
    lng: -99.0719,
    type: 'hub',
    address: 'Av. Ceylan 580, Industrial Vallejo, Mexico City',
  },

  // --- SOUTH AMERICA ---
  {
    id: 'hub-sao',
    name: 'São Paulo Port of Santos & GRU Cargo Center',
    city: 'São Paulo',
    country: 'Brazil',
    region: 'South America',
    lat: -23.9535,
    lng: -46.3021,
    type: 'port',
    address: 'Av. Conselheiro Rodrigues Alves, Santos - SP, Brazil',
  },
  {
    id: 'hub-bue',
    name: 'Buenos Aires Puerto Nuevo & Ezeiza Hub',
    city: 'Buenos Aires',
    country: 'Argentina',
    region: 'South America',
    lat: -34.5828,
    lng: -58.3719,
    type: 'port',
    address: 'Av. Ramón S. Castillo, C1104 Buenos Aires, Argentina',
  },
  {
    id: 'hub-bog',
    name: 'Bogotá El Dorado Cargo Center',
    city: 'Bogotá',
    country: 'Colombia',
    region: 'South America',
    lat: 4.7016,
    lng: -74.1469,
    type: 'airport',
    address: 'Terminal de Carga, Ac. 26 #103-9, Bogotá, Colombia',
  },

  // --- OCEANIA ---
  {
    id: 'hub-syd',
    name: 'Sydney Port Botany & Kingsford Smith Cargo',
    city: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    lat: -33.9749,
    lng: 151.2185,
    type: 'port',
    address: 'Brotherson Dock, Port Botany NSW 2036, Sydney',
  },
  {
    id: 'hub-mel',
    name: 'Port of Melbourne Swanson Dock',
    city: 'Melbourne',
    country: 'Australia',
    region: 'Oceania',
    lat: -37.8184,
    lng: 144.9142,
    type: 'port',
    address: 'Footscray Rd, West Melbourne VIC 3003',
  },
  {
    id: 'hub-akl',
    name: 'Port of Auckland Fergusson Wharf',
    city: 'Auckland',
    country: 'New Zealand',
    region: 'Oceania',
    lat: -36.8485,
    lng: 174.7633,
    type: 'port',
    address: 'Sunderland St, Parnell, Auckland 1010',
  },
];

// In-memory geocoding cache to respect rate limits and speed up instant lookups
const geocodeCache = new Map<string, LocationPoint[]>();

// Universal Worldwide Location Search with live fallback and fuzzy matching
export async function searchWorldwideLocations(query: string): Promise<LocationPoint[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = trimmed.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  // 1. Check offline global catalog first
  const queryLower = trimmed.toLowerCase();
  const catalogMatches = WORLDWIDE_LOGISTICS_HUBS.filter(
    (h) =>
      h.name.toLowerCase().includes(queryLower) ||
      h.city?.toLowerCase().includes(queryLower) ||
      h.country?.toLowerCase().includes(queryLower) ||
      h.region?.toLowerCase().includes(queryLower)
  );

  // If query is an exact or strong catalog match, prioritize it
  if (catalogMatches.length > 0) {
    geocodeCache.set(cacheKey, catalogMatches);
    return catalogMatches;
  }

  // 2. Fetch live from OpenStreetMap Nominatim for arbitrary worldwide addresses
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      trimmed
    )}&limit=5&addressdetails=1`;

    const res = await fetch(endpoint, {
      headers: {
        'Accept-Language': 'en',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const results: LocationPoint[] = data
          .map((item: any, idx: number) => {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            if (!isValidCoordinate(lat, lng)) return null;

            return {
              id: `geo-${Date.now()}-${idx}`,
              name: item.display_name?.split(',')[0] || item.name || trimmed,
              address: item.display_name,
              city:
                item.address?.city ||
                item.address?.town ||
                item.address?.state_district ||
                item.address?.county,
              country: item.address?.country,
              region: item.address?.state || item.address?.region,
              lat,
              lng,
              type: item.type === 'port' ? 'port' : item.type === 'aerodrome' ? 'airport' : 'delivery',
            } as LocationPoint;
          })
          .filter(Boolean) as LocationPoint[];

        if (results.length > 0) {
          geocodeCache.set(cacheKey, results);
          return results;
        }
      }
    }
  } catch {
    // Non-fatal network timeout or offline preview; fall back gracefully
  }

  // 3. Fallback: Parse if user entered raw coordinates "lat, lng" e.g. "-1.29, 36.82"
  const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
  const match = trimmed.match(coordRegex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[3]);
    if (isValidCoordinate(lat, lng)) {
      const parsedPoint: LocationPoint = {
        id: `custom-${lat}-${lng}`,
        name: `Custom Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        address: `${lat}, ${lng}`,
        lat,
        lng,
        type: 'delivery',
      };
      return [parsedPoint];
    }
  }

  return [];
}
