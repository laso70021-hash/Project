export type UserRole = 'admin' | 'customer' | 'warehouse_manager' | 'driver' | 'transporter';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  organizationId: string;
  organizationName: string;
}

export type ShipmentStatus =
  | 'Pending Pickup'
  | 'Assigned'
  | 'Picked Up'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'On Hold';

export type ServiceType = 'Standard' | 'Express' | 'Storage + Shipping' | 'Storage + Ship' | 'Freight';

export interface ShipmentItem {
  id: string;
  name: string;
  quantity: number;
  weightKg: number;
  valueTzs: number;
  dimensions?: string;
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  title: string;
  location: string;
  performedBy: string;
  completed: boolean;
  notes?: string;
}

export type TransportMode = 'road' | 'sea' | 'air' | 'rail' | 'intermodal';

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

export interface Shipment {
  id: string;
  trackingNumber: string; // e.g. TZL-20261025-001 or PKG-1042
  referenceNumber: string; // e.g. REF-2024-001
  customerId: string;
  customerName: string;
  customerCode: string; // e.g. CUS-0001
  customerPhone: string;
  customerEmail: string;
  serviceType: ServiceType;
  priority: 'Normal' | 'High' | 'Urgent';
  origin: string;
  destination: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  expectedDeliveryDate: string;
  status: ShipmentStatus;
  originLocation?: LocationPoint;
  destinationLocation?: LocationPoint;
  legs?: ShipmentLeg[];
  currentGps?: {
    lat: number;
    lng: number;
    timestamp: string;
    speedKmH?: number;
    heading?: string;
    isStale?: boolean;
    lastUpdateText?: string;
  };
  weightKg: number;
  totalVolumeM3?: number;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  assignedVehicleType?: string;
  items: ShipmentItem[];
  events: TrackingEvent[];
  qrCodeUrl?: string;
  baseFee: number;
  storageFee: number;
  handlingFee: number;
  insuranceFee: number;
  totalAmountTzs: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue' | 'Unpaid' | 'Partially Paid';
  paymentMethod?: string;
  paidDate?: string;
  proofOfDelivery?: {
    recipientName: string;
    signatureUrl?: string;
    photoUrl?: string;
    deliveredAt: string;
    notes?: string;
  };
  specialInstructions?: string;
  category: string;
}

export interface Customer {
  id: string;
  customerCode: string; // CUS-0001
  name: string;
  type: 'Business' | 'Individual' | 'Corporate' | 'VIP';
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  region: string;
  status: 'Active' | 'VIP' | 'Inactive';
  totalShipments: number;
  packagesInStorage: number;
  totalSpendTzs: number;
  monthSpendTzs: number;
  customerSince: string;
  notes?: string;
}

export interface Warehouse {
  id: string;
  code: string; // WH001
  name: string; // Main Warehouse
  location: string; // Dar es Salaam (DAR-WH01)
  totalCapacityPallets: number;
  occupiedPallets: number;
  availablePallets: number;
  zones: string[];
}

export interface StorageBin {
  id: string;
  binCode: string; // B01, B02, B03
  code?: string; // alias for locationCode
  locationCode: string; // WH001-A-R05-L02-B03
  zone: string; // A
  rackCode: string; // R05
  level: string; // L01 (Bottom), L02 (Middle), L03 (Top)
  levelNumber: number; // 1, 2, 3
  binNumber?: number; // 1, 2, 3
  status: 'Occupied' | 'Available' | 'Partially Filled' | 'Full' | 'Maintenance' | 'Blocked';
  currentWeightKg: number;
  maxWeightKg: number;
  currentPackagesCount: number;
  maxPackagesCount: number;
  packageIds: string[];
  lastUpdated: string;
}

export interface StorageRack {
  id: string;
  rackCode: string; // R01 to R08
  rackName: string;
  zone: string;
  zoneName?: string;
  category?: string;
  levelsCount: number;
  binsPerLevel: number;
  maxWeightKgPerBin: number;
  maxPackagesPerBin: number;
  maxWeightCapacityKg?: number;
  currentWeightKg?: number;
  status: 'Active' | 'Maintenance';
  storageType: 'Standard' | 'Cold' | 'Hazardous' | 'High Value';
  xMeters: number;
  yMeters: number;
  rotationDegrees: number;
  widthMeters: number;
  lengthMeters: number;
  occupancyPercent: number;
  bins: StorageBin[];
  levels?: any[];
}

export interface PackageRecord {
  id: string;
  packageId: string; // e.g. PKG-1042
  customerId: string;
  customerName: string;
  customerCode?: string;
  shipmentNumber?: string;
  bookingNumber?: string;
  productName: string;
  itemName?: string;
  category: string;
  weightKg: number;
  dimensions: string; // e.g. "40 x 30 x 20 cm"
  receivedAt: string;
  status: 'Awaiting Putaway' | 'In Storage' | 'In Picking' | 'Ready for Dispatch' | 'Dispatched' | 'Received' | 'Stored' | 'Picking' | 'Reserved' | 'Delivered';
  currentLocationCode?: string; // e.g. WH001-A-R05-L02-B03
  locationCode?: string;
  warehouseCode?: string;
  zone?: string;
  rackCode?: string;
  levelCode?: string;
  binCode?: string;
  lastMovedAt?: string;
  notes?: string;
  qrCodeUrl?: string;
  qrCodeDataUrl?: string;
}


export interface StorageBooking {
  id: string;
  bookingNumber: string; // e.g. WHB-2026-0047
  customerId: string;
  customerName: string;
  customerPhone?: string;
  warehouseCode: string;
  warehouseName: string;
  expectedDate: string;
  itemsDescription: string;
  cartonsCount: number;
  status: 'Arriving Today' | 'In Transit' | 'Scheduled' | 'Received' | 'In Storage' | 'Completed' | 'Pending Review' | 'Approved' | 'Rejected' | 'Active';
  receivedCartons?: number;
  monthlyRateTzs?: number;
  createdDate?: string;
  reservedSpaceSqM?: number;
  itemsStoredCount?: number;
  startDate?: string;
  endDate?: string;
  warehouseId?: string;
}



export interface PickTask {
  id: string;
  taskNumber: string; // e.g. PICK-2026-0101
  shipmentNumber?: string; // e.g. TZL-20261025-001 or SHP-88321
  shipmentTracking?: string;
  customerId: string;
  customerName: string;
  scheduledTime?: string;
  itemsCount?: number;
  status: 'Pending Pick' | 'In Picking' | 'Ready for Dispatch' | 'Completed' | 'In Progress' | 'Pending';
  assignedTo?: string;
  assignedPicker?: string;
  packageIds?: string[];
  items: {
    packageId: string;
    productName?: string;
    itemName?: string;
    weightKg: number;
    locationCode: string;
    status?: 'Pending' | 'Picked';
    scanned?: boolean;
    pickedAt?: string;
    pickedBy?: string;
  }[];
}


export interface CycleCountRecord {
  id: string;
  countNumber: string;
  zone: string;
  locationCode: string;
  zoneCode: string;
  rackCode: string;
  levelCode: string;
  binCode: string;
  expectedPackages: number;
  countedPackages: number;
  status: 'Matched' | 'Discrepancy' | 'Not Counted' | 'Empty' | 'Under Review' | 'Resolved';
  lastScanned?: string;
  scannedBy?: string;
  countedBy?: string;
  expectedPackageId?: string;
  foundPackageId?: string;
  packageId?: string;
  expectedLocation?: string;
  actualLocation?: string;
  discrepancyType?: 'Misplaced' | 'Missing' | 'Extra';
}


export interface Transporter {
  id: string;
  code: string; // TRP-001
  companyName: string;
  contactPhone: string;
  contactEmail: string;
  region: string;
  driversCount: number;
  vehiclesCount: number;
  activeShipmentsCount: number;
  totalShipmentsCount: number;
  status: 'Active' | 'Suspended';
  isPreferredPartner: boolean;
  onTimeRatePercent: number;
  rating: number;
  ratingReviewsCount: number;
  joinedDate: string;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export interface Driver {
  id: string;
  driverCode: string; // DRV-001 or TZD-001
  name: string;
  phone: string;
  licenseNumber: string;
  status: 'Active' | 'On Trip' | 'Resting' | 'Offline';
  transporterCode?: string;
  assignedShipmentsCount: number;
  rating: number;
  currentVehiclePlate?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string; // e.g. TZ 1234 AB
  type: 'DAF Truck' | 'Hino Truck' | 'Isuzu Van' | 'Toyota Pickup' | 'Scania Truck' | 'Toyota HiAce';
  capacityKg: number;
  status: 'Active' | 'On Delivery' | 'Maintenance';
  currentLocation: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-2024-00428
  customerId: string;
  customerName: string;
  customerAddress?: string;
  customerTin?: string;
  type: 'Storage' | 'Shipping' | 'Transport' | 'Handling' | 'Other';
  amountTzs: number;
  subtotalTzs: number;
  vatTzs: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Unpaid' | 'Partially Paid';
  items: {
    description: string;
    quantity: number;
    unitPriceTzs: number;
    amountTzs: number;
  }[];
  paymentReference?: string;
  paidAt?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface QRScanHistory {
  id: string;
  timestamp: string;
  scannedCode?: string;
  barcode?: string;
  type?: 'Package' | 'Location' | string;
  resultStatus?: 'Found (In Storage)' | 'Found (Available)' | 'Found (Occupied)' | 'Found (Awaiting Putaway)' | 'Not Found' | string;
  result?: string;
  scannedBy: string;
  deviceType?: string;
  location?: string;
  locationCode?: string;
  customerName?: string;
  actionTaken?: string;
}

export interface WarehouseMapObject {
  id: string;
  type: 'rack' | 'wall' | 'door' | 'zone' | 'aisle' | 'office' | 'loading_zone' | 'staging_area' | 'returns_area' | 'dispatch_area';
  name: string;
  code?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  layer: string;
  locked?: boolean;
}
