'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store-context';
import {
  Package,
  Boxes,
  Truck,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building,
  User,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
  MapPin,
  Clock,
  Warehouse,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
  Globe,
  Plane,
  Ship,
} from 'lucide-react';
import {
  LocationPoint,
  WORLDWIDE_LOGISTICS_HUBS,
  searchWorldwideLocations,
  isValidCoordinate,
} from '@/lib/geocoding';
import { calculateWorldwideRoute } from '@/lib/multimodal-routing';

interface CreateShipmentViewProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export type ShipmentTypeOption =
  | 'Standard Shipping'
  | 'Storage + Shipping'
  | 'Cross-Docking / Hub Transit'
  | 'Warehouse Pickup (Self-Collection)';

export function CreateShipmentView({ onSuccess, onCancel }: CreateShipmentViewProps) {
  const { customers, drivers, vehicles, createShipment } = useAppStore();

  // Active Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // STEP 1: Shipment Details & Type
  const [shipmentType, setShipmentType] = useState<ShipmentTypeOption>('Standard Shipping');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('c-001');
  const [referenceNumber, setReferenceNumber] = useState<string>(`REF-2024-${Math.floor(100 + Math.random() * 900)}`);
  const [serviceType, setServiceType] = useState<'Standard' | 'Express' | 'Freight'>('Express');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [category, setCategory] = useState<string>('Electronics & Appliances');
  const [description, setDescription] = useState<string>('Telecom equipment, commercial tablets and accessories');
  const [specialInstructions, setSpecialInstructions] = useState<string>('Handle with care. Fragile electronic items.');

  // STEP 2: Pickup & Delivery
  const [pickupLocationType, setPickupLocationType] = useState<'customer' | 'warehouse'>('customer');
  const [deliveryLocationType, setDeliveryLocationType] = useState<'customer' | 'warehouse'>('customer');
  const [originCity, setOriginCity] = useState<string>('Dar es Salaam');
  const [pickupAddress, setPickupAddress] = useState<string>('Plot 45, Nyerere Road, Industrial Area');
  const [pickupContactName, setPickupContactName] = useState<string>('Mr. Ahmed Hassan');
  const [pickupContactPhone, setPickupContactPhone] = useState<string>('+255 712 345 678');
  const [pickupDate, setPickupDate] = useState<string>('2024-06-12');
  const [pickupTimeWindow, setPickupTimeWindow] = useState<string>('Morning (08:00 - 12:00)');
  const [pickupMethod, setPickupMethod] = useState<string>('Scheduled Driver Collection');

  const [destinationCity, setDestinationCity] = useState<string>('Zanzibar');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Kiponda Street, Stone Town, Zanzibar');
  const [deliveryContactName, setDeliveryContactName] = useState<string>('Zanzibar Retail Operations');
  const [deliveryContactPhone, setDeliveryContactPhone] = useState<string>('+255 777 123 456');
  const [deliveryDate, setDeliveryDate] = useState<string>('2024-06-14');
  const [deliveryTimeWindow, setDeliveryTimeWindow] = useState<string>('Business Hours (09:00 - 17:00)');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('Direct Express Delivery');

  // Worldwide Dynamic Geocoded Points
  const [originPoint, setOriginPoint] = useState<LocationPoint>(
    WORLDWIDE_LOGISTICS_HUBS[0] || {
      name: 'Dar es Salaam Central Warehouse',
      city: 'Dar es Salaam',
      country: 'Tanzania',
      lat: -6.852,
      lng: 39.278,
      type: 'warehouse',
    }
  );
  const [destinationPoint, setDestinationPoint] = useState<LocationPoint>(
    WORLDWIDE_LOGISTICS_HUBS[1] || {
      name: 'Zanzibar Port Facility',
      city: 'Zanzibar',
      country: 'Tanzania',
      lat: -6.155,
      lng: 39.192,
      type: 'port',
    }
  );

  // Warehouse selection if Storage + Shipping or Warehouse Pickup
  const [targetWarehouseCode, setTargetWarehouseCode] = useState<string>('WH001');
  const [targetStorageZone, setTargetStorageZone] = useState<string>('Zone A (Secured Electronics)');
  const [storageDurationDays, setStorageDurationDays] = useState<number>(14);

  // Assigned Fleet
  const [assignedDriverId, setAssignedDriverId] = useState<string>('d-001');
  const [assignedVehiclePlate, setAssignedVehiclePlate] = useState<string>('TZ 1234 AB');

  // STEP 3: Packages & Items
  const [items, setItems] = useState([
    { id: '1', name: 'Commercial Tablets', category: 'Electronics', quantity: 15, weightKg: 12, dimensions: '40 x 30 x 20 cm', valueTzs: 4500000, fragile: true },
    { id: '2', name: 'Charging Docks & Cables', category: 'Accessories', quantity: 20, weightKg: 8, dimensions: '30 x 20 x 15 cm', valueTzs: 1200000, fragile: false },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Electronics');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemWeight, setNewItemWeight] = useState(5);
  const [newItemDimensions, setNewItemDimensions] = useState('30 x 20 x 15 cm');
  const [newItemValue, setNewItemValue] = useState(300000);
  const [newItemFragile, setNewItemFragile] = useState(false);

  // STEP 4: Services & Payment
  const [insuranceEnabled, setInsuranceEnabled] = useState<boolean>(true);
  const [fragileHandlingEnabled, setFragileHandlingEnabled] = useState<boolean>(true);
  const [customsClearanceEnabled, setCustomsClearanceEnabled] = useState<boolean>(false);
  const [proofOfDeliveryReturn, setProofOfDeliveryReturn] = useState<boolean>(true);
  const [paymentTerms, setPaymentTerms] = useState<'Prepaid' | 'Cash on Delivery (COD)' | 'Invoiced Net 30' | 'Corporate Account'>('Corporate Account');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer (CRDB/NMB)' | 'Mobile Money (M-Pesa)' | 'Direct Billing Account'>('Bank Transfer (CRDB/NMB)');
  const [payerType, setPayerType] = useState<'Sender' | 'Recipient'>('Sender');

  // STEP 5: Confirmation state
  const [confirmationChecked, setConfirmationChecked] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Derived Customer
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Totals
  const totalPackages = items.length;
  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalWeightKg = items.reduce((acc, i) => acc + i.weightKg * i.quantity, 0);
  const totalDeclaredValue = items.reduce((acc, i) => acc + i.valueTzs, 0);
  const totalVolumeM3 = 0.18;

  // Pricing calculations
  const baseShippingFee =
    serviceType === 'Express' ? 350000 : serviceType === 'Freight' ? 450000 : 250000;
  const handlingFee = fragileHandlingEnabled ? 50000 : 25000;
  const insuranceFee = insuranceEnabled ? Math.round(totalDeclaredValue * 0.005) : 0;
  const storageFee =
    shipmentType === 'Storage + Shipping'
      ? Math.round(storageDurationDays * 8000)
      : shipmentType === 'Warehouse Pickup (Self-Collection)'
      ? 45000
      : 0;
  const customsFee = customsClearanceEnabled ? 100000 : 0;
  const podFee = proofOfDeliveryReturn ? 15000 : 0;
  const totalEstimatedCost =
    baseShippingFee + handlingFee + insuranceFee + storageFee + customsFee + podFee;

  // Step definitions
  const steps = [
    { num: 1, title: 'Shipment Details', subtitle: 'Type, Customer & Reference' },
    { num: 2, title: 'Pickup & Delivery', subtitle: 'Addresses, Dates & Fleet' },
    { num: 3, title: 'Packages & Items', subtitle: 'Cargo inventory & dimensions' },
    { num: 4, title: 'Services & Payment', subtitle: 'Insurance, Storage & Billing' },
    { num: 5, title: 'Review & Submit', subtitle: 'Summary & final confirmation' },
  ];

  // Handlers
  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newItemName.trim(),
        category: newItemCategory,
        quantity: newItemQty,
        weightKg: newItemWeight,
        dimensions: newItemDimensions,
        valueTzs: newItemValue,
        fragile: newItemFragile,
      },
    ]);
    setNewItemName('');
    setNewItemQty(1);
    setNewItemWeight(5);
    setNewItemValue(300000);
    setNewItemFragile(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const markStepCompleteAndNext = (nextStepNum: number) => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(nextStepNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepJump = (targetStep: number) => {
    // Can jump if already completed or is immediate next step
    if (completedSteps.includes(targetStep) || targetStep <= currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const driver = drivers.find((d) => d.id === assignedDriverId);
      await createShipment({
        referenceNumber,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerCode: selectedCustomer.customerCode,
        customerPhone: selectedCustomer.phone,
        customerEmail: selectedCustomer.email,
        serviceType: shipmentType === 'Storage + Shipping' ? 'Storage + Shipping' : serviceType,
        priority,
        origin: `${originCity} (${pickupAddress})`,
        destination: `${destinationCity} (${deliveryAddress})`,
        pickupAddress,
        deliveryAddress,
        pickupDate,
        expectedDeliveryDate: deliveryDate,
        originLocation: originPoint,
        destinationLocation: destinationPoint,
        currentGps: {
          lat: originPoint.lat,
          lng: originPoint.lng,
          timestamp: new Date().toISOString(),
          speedKmH: 0,
          heading: 'N',
          isStale: false,
          lastUpdateText: 'Confirmed Origin Hub Point',
        },
        legs: [
          {
            id: `leg-init-${Date.now()}`,
            mode: 'road',
            origin: originPoint,
            destination: destinationPoint,
            status: 'In Transit',
            geometryType: 'road_confirmed',
            carrierName: 'Swahivo Logistics Network',
          },
        ],
        weightKg: totalWeightKg,
        totalVolumeM3: totalVolumeM3,
        assignedDriverId: driver?.id,
        assignedDriverName: driver?.name,
        assignedDriverPhone: driver?.phone,
        assignedVehiclePlate,
        baseFee: baseShippingFee,
        storageFee,
        handlingFee,
        insuranceFee,
        totalAmountTzs: totalEstimatedCost,
        paymentStatus: 'Pending',
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          weightKg: it.weightKg,
          valueTzs: it.valueTzs,
          dimensions: it.dimensions,
        })),
        specialInstructions,
        category,
      });

      onSuccess?.();
    } catch (err) {
      console.error('Failed to create shipment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-5 max-w-[1536px] mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Shipments</span>
            <span>&rsaquo;</span>
            <span className="text-slate-800 font-bold">Create Shipment</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Create New Shipment</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              Step {currentStep} of 5
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
          )}
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Auto-saved draft &bull; Ready
          </div>
        </div>
      </div>

      {/* 5-Step Progress Bar with Clickable Navigation */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = completedSteps.includes(s.num) || currentStep > s.num;
            const isClickable = isCompleted || s.num <= currentStep;

            return (
              <div
                key={s.num}
                onClick={() => isClickable && handleStepJump(s.num)}
                className={`flex items-center gap-2.5 p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50/80 border border-blue-200'
                    : isClickable
                    ? 'hover:bg-slate-50 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-100'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : s.num}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-blue-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate hidden lg:block">
                    {s.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Active Step Form (8 cols) & Live Cost/Checklist Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Form Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* STEP 1: SHIPMENT DETAILS & SHIPMENT TYPE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Shipment Type Selector with Dropdown + Explanatory Workflow Cards */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Shipment Type</span>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Choose how your cargo moves through transport and warehouse facilities.
                    </p>
                  </div>
                </div>

                {/* Dropdown selector for Shipment Type */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Select Shipment Operational Model
                  </label>
                  <select
                    value={shipmentType}
                    onChange={(e) => setShipmentType(e.target.value as ShipmentTypeOption)}
                    className="w-full rounded-lg border-2 border-blue-500 bg-blue-50/40 p-2.5 text-xs font-extrabold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  >
                    <option value="Standard Shipping">
                      Standard Shipping &bull; Direct delivery without warehouse storage
                    </option>
                    <option value="Storage + Shipping">
                      Storage + Shipping &bull; Store in warehouse first, register bins, then dispatch
                    </option>
                    <option value="Cross-Docking / Hub Transit">
                      Cross-Docking / Hub Transit &bull; Temporary hub consolidation before forwarding
                    </option>
                    <option value="Warehouse Pickup (Self-Collection)">
                      Warehouse Pickup &bull; Items held at warehouse for recipient self-collection
                    </option>
                  </select>
                </div>

                {/* 2 Interactive visual explanation cards matching reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Standard Shipping Card */}
                  <div
                    onClick={() => setShipmentType('Standard Shipping')}
                    className={`relative flex items-start gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all ${
                      shipmentType === 'Standard Shipping'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-xs font-bold text-slate-900">Standard Shipping</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Direct delivery without storage warehouse placement.
                      </p>
                      <div className="mt-2 text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                        <span>Pickup &rarr; Line Haul &rarr; Delivery</span>
                      </div>
                    </div>
                    {shipmentType === 'Standard Shipping' && (
                      <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Storage + Shipping Card */}
                  <div
                    onClick={() => setShipmentType('Storage + Shipping')}
                    className={`relative flex items-start gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all ${
                      shipmentType === 'Storage + Shipping'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Boxes className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-xs font-bold text-slate-900">Storage + Shipping</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Store in warehouse first, register bins, then dispatch.
                      </p>
                      <div className="mt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <span>Inbound &rarr; Bin Putaway &rarr; Pick & Dispatch</span>
                      </div>
                    </div>
                    {shipmentType === 'Storage + Shipping' && (
                      <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Workflow Roadmap Banner */}
                <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-2.5 text-[11px] text-slate-600 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600 shrink-0" />
                  <div className="leading-snug">
                    <span className="font-bold text-slate-800">Operational Path: </span>
                    {shipmentType === 'Standard Shipping' &&
                      'Direct route assigned to fleet/carrier without storage fees. Real-time GPS and milestone tracking.'}
                    {shipmentType === 'Storage + Shipping' &&
                      'Requires warehouse check-in, barcode/QR label printing, shelf assignment and inventory tracking prior to release.'}
                    {shipmentType === 'Cross-Docking / Hub Transit' &&
                      'Packages staged at sorting hub for <24h consolidation before regional vehicle transfer.'}
                    {shipmentType === 'Warehouse Pickup (Self-Collection)' &&
                      'Goods received into staging bin; recipient collects in person upon automated SMS notification.'}
                  </div>
                </div>
              </div>

              {/* Customer Selection */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Customer Information *</h3>
                  <span className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
                    + Add New Customer
                  </span>
                </div>

                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.customerCode}) &bull; {c.region} &bull; {c.phone}
                    </option>
                  ))}
                </select>

                {/* Customer card preview */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-xs shrink-0">
                      {selectedCustomer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-extrabold text-slate-900">{selectedCustomer.name}</p>
                        <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700">
                          {selectedCustomer.customerCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{selectedCustomer.address}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5">
                    <p className="font-semibold text-slate-800">{selectedCustomer.phone}</p>
                    <p className="text-slate-500">{selectedCustomer.email}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">&bull; Verified Business Account</p>
                  </div>
                </div>
              </div>

              {/* Shipment Details & Classification */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900">Shipment Details & Timing</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Reference Number *</label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Goods Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    >
                      <option value="Electronics & Appliances">Electronics & Appliances</option>
                      <option value="General Goods & Retail">General Goods & Retail</option>
                      <option value="Industrial & Heavy Machinery">Industrial & Heavy Machinery</option>
                      <option value="Agricultural Produce">Agricultural Produce</option>
                      <option value="Pharmaceuticals & Health">Pharmaceuticals & Health</option>
                      <option value="Documents & Legal Papers">Documents & Legal Papers</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Service Speed *</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    >
                      <option value="Express">Express (1-2 Days Guaranteed)</option>
                      <option value="Standard">Standard (3-4 Days)</option>
                      <option value="Freight">Heavy Freight (5-7 Days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Priority Level *</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    >
                      <option value="Normal">Normal Handling</option>
                      <option value="High">High Priority</option>
                      <option value="Urgent">Urgent / Express Expedited</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-slate-600">Package Description *</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. 5 boxes of network switches, power supplies and brackets"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-slate-600">
                      Special Handling Instructions (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Fragile, do not stack more than 3 high, keep dry..."
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => markStepCompleteAndNext(2)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <span>Continue to Pickup & Delivery</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PICKUP & DELIVERY */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Warehouse Staging Notification if Storage + Shipping */}
              {shipmentType === 'Storage + Shipping' && (
                <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/70 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-emerald-700" />
                    <h3 className="text-xs font-bold text-emerald-950">
                      Warehouse Storage Configuration
                    </h3>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Cargo will be delivered to the selected logistics hub first, checked in at the receiving dock, scanned into a verified rack/shelf location, and made visible in customer inventory before dispatch.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                        Assigned Warehouse *
                      </label>
                      <select
                        value={targetWarehouseCode}
                        onChange={(e) => setTargetWarehouseCode(e.target.value)}
                        className="w-full rounded-lg border border-emerald-300 bg-white p-2 text-xs font-bold text-slate-800"
                      >
                        <option value="WH001">WH001 &bull; Main Hub (Dar es Salaam)</option>
                        <option value="WH002">WH002 &bull; Northern Hub (Arusha)</option>
                        <option value="WH003">WH003 &bull; Zanzibar Transit Depot</option>
                        <option value="WH004">WH004 &bull; Lake Zone Hub (Mwanza)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                        Storage Zone
                      </label>
                      <select
                        value={targetStorageZone}
                        onChange={(e) => setTargetStorageZone(e.target.value)}
                        className="w-full rounded-lg border border-emerald-300 bg-white p-2 text-xs font-medium text-slate-800"
                      >
                        <option value="Zone A (Secured Electronics)">Zone A (Secured Electronics)</option>
                        <option value="Zone B (General Goods)">Zone B (General Goods)</option>
                        <option value="Zone C (Heavy Pallet Racks)">Zone C (Heavy Pallet Racks)</option>
                        <option value="Zone D (Cold Staging)">Zone D (Cold Staging)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                        Est. Storage Duration
                      </label>
                      <select
                        value={storageDurationDays}
                        onChange={(e) => setStorageDurationDays(Number(e.target.value))}
                        className="w-full rounded-lg border border-emerald-300 bg-white p-2 text-xs font-bold text-slate-800"
                      >
                        <option value={7}>7 Days (TZS 56,000)</option>
                        <option value={14}>14 Days (TZS 112,000)</option>
                        <option value={30}>30 Days (TZS 240,000)</option>
                        <option value={60}>60 Days (TZS 450,000)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Inbound / Pickup Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Origin / Pickup Location</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPickupAddress(selectedCustomer.address)}
                      className="text-[11px] text-blue-600 font-semibold hover:underline"
                    >
                      Use Customer Address
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Origin City / Global Gateway *</label>
                    <select
                      value={originCity}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOriginCity(val);
                        const match = WORLDWIDE_LOGISTICS_HUBS.find((h) => h.city === val || h.name.toLowerCase().includes(val.toLowerCase()));
                        if (match) {
                          setOriginPoint(match);
                        }
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    >
                      <optgroup label="East Africa Corridors">
                        <option value="Dar es Salaam">Dar es Salaam (Tanzania)</option>
                        <option value="Arusha">Arusha (Tanzania)</option>
                        <option value="Mwanza">Mwanza (Tanzania)</option>
                        <option value="Zanzibar">Zanzibar (Tanzania)</option>
                        <option value="Dodoma">Dodoma (Tanzania)</option>
                        <option value="Mombasa">Mombasa (Kenya)</option>
                        <option value="Nairobi">Nairobi (Kenya)</option>
                        <option value="Kigali">Kigali (Rwanda)</option>
                        <option value="Kampala">Kampala (Uganda)</option>
                      </optgroup>
                      <optgroup label="International Global Gateways">
                        <option value="Rotterdam">Rotterdam Port (Netherlands)</option>
                        <option value="London">London Gateway / Heathrow (UK)</option>
                        <option value="Dubai">Dubai Jebel Ali & DWC (UAE)</option>
                        <option value="Singapore">Singapore Pasir Panjang (Singapore)</option>
                        <option value="Shanghai">Shanghai Yangshan Deepwater (China)</option>
                        <option value="Tokyo">Tokyo Narita / Yokohama (Japan)</option>
                        <option value="New York">New York JFK & Port Terminal (USA)</option>
                        <option value="Los Angeles">Los Angeles Port & Long Beach (USA)</option>
                        <option value="Toronto">Toronto Pearson Vista Hub (Canada)</option>
                        <option value="São Paulo">São Paulo Santos & GRU (Brazil)</option>
                        <option value="Sydney">Sydney Port Botany (Australia)</option>
                        <option value="Cairo">Cairo Cargo City (Egypt)</option>
                        <option value="Johannesburg">Johannesburg City Deep (South Africa)</option>
                      </optgroup>
                    </select>
                    <div className="mt-1 flex items-center gap-1 text-[9.5px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                      <span>✓ GPS: {originPoint.lat.toFixed(4)}°, {originPoint.lng.toFixed(4)}°</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Pickup Date *</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-slate-600">Pickup Physical Address *</label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="e.g. Plot 45, Nyerere Road, Industrial Area"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Contact Person Name</label>
                    <input
                      type="text"
                      value={pickupContactName}
                      onChange={(e) => setPickupContactName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Contact Phone Number</label>
                    <input
                      type="text"
                      value={pickupContactPhone}
                      onChange={(e) => setPickupContactPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Outbound / Delivery Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>Destination / Delivery Location</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Recipient Point</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Destination City / Global Gateway *</label>
                    <select
                      value={destinationCity}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDestinationCity(val);
                        const match = WORLDWIDE_LOGISTICS_HUBS.find((h) => h.city === val || h.name.toLowerCase().includes(val.toLowerCase()));
                        if (match) {
                          setDestinationPoint(match);
                        }
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    >
                      <optgroup label="East Africa Corridors">
                        <option value="Zanzibar">Zanzibar (Tanzania)</option>
                        <option value="Dar es Salaam">Dar es Salaam (Tanzania)</option>
                        <option value="Arusha">Arusha (Tanzania)</option>
                        <option value="Mwanza">Mwanza (Tanzania)</option>
                        <option value="Dodoma">Dodoma (Tanzania)</option>
                        <option value="Kigoma">Kigoma (Tanzania)</option>
                        <option value="Nairobi">Nairobi (Kenya)</option>
                        <option value="Mombasa">Mombasa (Kenya)</option>
                        <option value="Kigali">Kigali (Rwanda)</option>
                        <option value="Kampala">Kampala (Uganda)</option>
                      </optgroup>
                      <optgroup label="International Global Gateways">
                        <option value="London">London Gateway / Heathrow (UK)</option>
                        <option value="Rotterdam">Rotterdam Port (Netherlands)</option>
                        <option value="Dubai">Dubai Jebel Ali & DWC (UAE)</option>
                        <option value="Singapore">Singapore Pasir Panjang (Singapore)</option>
                        <option value="Shanghai">Shanghai Yangshan Deepwater (China)</option>
                        <option value="Tokyo">Tokyo Narita / Yokohama (Japan)</option>
                        <option value="New York">New York JFK & Port Terminal (USA)</option>
                        <option value="Los Angeles">Los Angeles Port & Long Beach (USA)</option>
                        <option value="Toronto">Toronto Pearson Vista Hub (Canada)</option>
                        <option value="São Paulo">São Paulo Santos & GRU (Brazil)</option>
                        <option value="Sydney">Sydney Port Botany (Australia)</option>
                        <option value="Cairo">Cairo Cargo City (Egypt)</option>
                        <option value="Johannesburg">Johannesburg City Deep (South Africa)</option>
                      </optgroup>
                    </select>
                    <div className="mt-1 flex items-center gap-1 text-[9.5px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                      <span>✓ GPS: {destinationPoint.lat.toFixed(4)}°, {destinationPoint.lng.toFixed(4)}°</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Expected Delivery Date *</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-slate-600">Delivery Physical Address *</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Kiponda Street, Stone Town, Zanzibar"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Recipient Contact Person</label>
                    <input
                      type="text"
                      value={deliveryContactName}
                      onChange={(e) => setDeliveryContactName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Recipient Phone Number *</label>
                    <input
                      type="text"
                      value={deliveryContactPhone}
                      onChange={(e) => setDeliveryContactPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Driver & Vehicle Allocation */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Assign Transport Resources</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Assign Driver *</label>
                    <select
                      value={assignedDriverId}
                      onChange={(e) => setAssignedDriverId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    >
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.driverCode}) &bull; {d.status} &bull; {d.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Assign Vehicle *</label>
                    <select
                      value={assignedVehiclePlate}
                      onChange={(e) => setAssignedVehiclePlate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.plateNumber}>
                          {v.plateNumber} &bull; {v.type} ({v.capacityKg} kg)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Shipment Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => markStepCompleteAndNext(3)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <span>Continue to Packages & Items</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PACKAGES & ITEMS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Package Items List Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Cargo & Package Manifest</h3>
                    <p className="text-[11px] text-slate-500">
                      Every item will have a verified tracking QR code printed at receiving dock.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {items.length} Package Types
                  </span>
                </div>

                {/* Table of items */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500">
                        <th className="py-2 pr-2">#</th>
                        <th className="py-2 pr-2">Item Description</th>
                        <th className="py-2 pr-2">Category</th>
                        <th className="py-2 pr-2 text-center">Qty</th>
                        <th className="py-2 pr-2 text-right">Unit Wt (kg)</th>
                        <th className="py-2 pr-2">Dimensions</th>
                        <th className="py-2 pr-2 text-right">Declared Value</th>
                        <th className="py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 pr-2 font-bold text-slate-500">{index + 1}</td>
                          <td className="py-2.5 pr-2">
                            <span className="font-bold text-slate-900">{item.name}</span>
                            {item.fragile && (
                              <span className="ml-1.5 rounded bg-rose-50 border border-rose-200 px-1 py-0.2 text-[9px] font-bold text-rose-700">
                                FRAGILE
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 pr-2 text-slate-600">{item.category}</td>
                          <td className="py-2.5 pr-2 text-center font-bold text-slate-800">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 pr-2 text-right text-slate-700">
                            {item.weightKg} kg
                          </td>
                          <td className="py-2.5 pr-2 text-slate-500 font-mono text-[10px]">
                            {item.dimensions}
                          </td>
                          <td className="py-2.5 pr-2 text-right font-semibold text-slate-800">
                            TZS {item.valueTzs.toLocaleString()}
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                              title="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add New Item Form */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 space-y-3 mt-3">
                  <h4 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5 text-blue-600" />
                    <span>Add New Package / Item</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Item / Box Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Laser Printer & Toners"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Category
                      </label>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value)}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs font-medium"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Documents">Documents</option>
                        <option value="Hardware">Hardware</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(Number(e.target.value) || 1)}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Unit Wt (kg)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.5}
                        value={newItemWeight}
                        onChange={(e) => setNewItemWeight(Number(e.target.value) || 1)}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Dimensions (L x W x H)
                      </label>
                      <input
                        type="text"
                        placeholder="40 x 30 x 20 cm"
                        value={newItemDimensions}
                        onChange={(e) => setNewItemDimensions(e.target.value)}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Declared Value (TZS)
                      </label>
                      <input
                        type="number"
                        step={50000}
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(Number(e.target.value) || 0)}
                        className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs font-semibold"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer pb-2">
                        <input
                          type="checkbox"
                          checked={newItemFragile}
                          onChange={(e) => setNewItemFragile(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 h-4 w-4"
                        />
                        <span>Fragile Item</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Item to Manifest</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Pickup & Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => markStepCompleteAndNext(4)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <span>Continue to Services & Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SERVICES & PAYMENT */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Value Added Services */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Value-Added Logistics Services</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  {/* Insurance Option */}
                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50/70 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={insuranceEnabled}
                      onChange={(e) => setInsuranceEnabled(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Comprehensive Cargo Protection Insurance
                        </span>
                        <span className="font-bold text-blue-700">
                          TZS {Math.round(totalDeclaredValue * 0.005).toLocaleString()} (0.5%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Full coverage against damage, total loss, or theft based on declared cargo value.
                      </p>
                    </div>
                  </label>

                  {/* Fragile & Specialized Handling */}
                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50/70 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={fragileHandlingEnabled}
                      onChange={(e) => setFragileHandlingEnabled(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Fragile & White-Glove Specialized Handling
                        </span>
                        <span className="font-bold text-blue-700">TZS 50,000</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Foam corner protectors, shock-indicator labelling, and priority loading.
                      </p>
                    </div>
                  </label>

                  {/* Hardcopy POD */}
                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50/70 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={proofOfDeliveryReturn}
                      onChange={(e) => setProofOfDeliveryReturn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Return Signed Hardcopy Proof of Delivery (POD)
                        </span>
                        <span className="font-bold text-blue-700">TZS 15,000</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Physical stamp & signed delivery note courier returned to billing address.
                      </p>
                    </div>
                  </label>

                  {/* Customs / Border Clearance */}
                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50/70 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={customsClearanceEnabled}
                      onChange={(e) => setCustomsClearanceEnabled(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Cross-Border / Port Customs Transit Clearance
                        </span>
                        <span className="font-bold text-blue-700">TZS 100,000</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        TRA / EAC document processing for Zanzibar sea crossing and international borders.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment & Billing Terms */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span>Payment & Invoicing Structure</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Payment Terms *</label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold"
                    >
                      <option value="Corporate Account">Corporate Account (Net 30)</option>
                      <option value="Prepaid">Prepaid / Instant Wire</option>
                      <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                      <option value="Invoiced Net 30">Invoiced Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Payment Method *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold"
                    >
                      <option value="Bank Transfer (CRDB/NMB)">Bank Transfer (CRDB/NMB)</option>
                      <option value="Mobile Money (M-Pesa)">M-Pesa / Tigo Pesa</option>
                      <option value="Direct Billing Account">Direct Billing Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Responsible Payer</label>
                    <select
                      value={payerType}
                      onChange={(e) => setPayerType(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold"
                    >
                      <option value="Sender">Sender ({selectedCustomer.name})</option>
                      <option value="Recipient">Recipient ({deliveryContactName})</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-2.5 text-[11px] text-blue-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">Billing Account: </span>
                    <span>{selectedCustomer.customerCode} &bull; Tax ID: 123-456-789</span>
                  </div>
                  <span className="font-extrabold text-blue-700">Credit Limit: TZS 25,000,000</span>
                </div>
              </div>

              {/* Step 4 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Packages & Items</span>
                </button>
                <button
                  type="button"
                  onClick={() => markStepCompleteAndNext(5)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <span>Continue to Review & Submit</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SUBMIT */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Step 5 Verification
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                      Review Shipment Details Before Issuance
                    </h3>
                  </div>
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
                    {shipmentType}
                  </span>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Customer Card */}
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/60 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Customer & Ref</p>
                    <p className="font-extrabold text-slate-900">{selectedCustomer.name}</p>
                    <p className="text-slate-600 font-mono text-[11px]">Ref: {referenceNumber}</p>
                    <p className="text-slate-500 text-[11px]">{selectedCustomer.phone}</p>
                  </div>

                  {/* Route & Dates Card */}
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/60 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Route & Timeline</p>
                    <p className="font-extrabold text-slate-900">
                      {originCity} &rarr; {destinationCity}
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Pickup: {pickupDate} &bull; Delivery: {deliveryDate}
                    </p>
                    <p className="text-blue-700 font-semibold text-[11px]">
                      Assigned: {drivers.find((d) => d.id === assignedDriverId)?.name} ({assignedVehiclePlate})
                    </p>
                  </div>

                  {/* Cargo Breakdown */}
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/60 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cargo Manifest</p>
                    <p className="font-extrabold text-slate-900">
                      {totalPackages} Package Lines ({totalItemsCount} Total Units)
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Gross Weight: {totalWeightKg} kg &bull; Volume: {totalVolumeM3} m&sup3;
                    </p>
                    <p className="text-slate-500 text-[11px]">Declared: TZS {totalDeclaredValue.toLocaleString()}</p>
                  </div>

                  {/* Financials */}
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/60 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Invoicing & Terms</p>
                    <p className="font-extrabold text-blue-900 text-sm">
                      TZS {totalEstimatedCost.toLocaleString()}
                    </p>
                    <p className="text-slate-600 text-[11px]">{paymentTerms}</p>
                    <p className="text-slate-500 text-[11px]">{paymentMethod}</p>
                  </div>
                </div>

                {/* Warehouse details if applicable */}
                {shipmentType === 'Storage + Shipping' && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-950">Inbound Warehouse Putaway</p>
                      <p className="text-[11px] text-emerald-800">
                        {targetWarehouseCode} &bull; {targetStorageZone} &bull; {storageDurationDays} Days Storage
                      </p>
                    </div>
                    <span className="font-extrabold text-emerald-700">QR Bins Required</span>
                  </div>
                )}

                {/* Confirmation Checkbox */}
                <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-3 bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmationChecked}
                    onChange={(e) => setConfirmationChecked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">
                    I confirm that all cargo descriptions, dimensions, pickup instructions and billing parameters are accurate. Generating this shipment will allocate fleet resources and generate verified QR waybill tracking codes.
                  </span>
                </label>
              </div>

              {/* Step 5 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Services & Payment</span>
                </button>
                <button
                  type="button"
                  disabled={!confirmationChecked || isSubmitting}
                  onClick={handleSubmit}
                  className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-extrabold text-white shadow-md transition-all ${
                    confirmationChecked && !isSubmitting
                      ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Creating Shipment...</span>
                  ) : (
                    <>
                      <span>Confirm & Create Shipment</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary & Live Cost Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Step Checklist Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5 text-xs">
            <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Creation Checklist</span>
              <span className="text-[10px] text-blue-600 font-bold">
                {completedSteps.length}/5 Done
              </span>
            </h3>

            <div className="space-y-1.5">
              {steps.map((st) => (
                <div
                  key={st.num}
                  onClick={() => (completedSteps.includes(st.num) || st.num <= currentStep) && setCurrentStep(st.num)}
                  className={`flex items-center justify-between py-1 px-1.5 rounded text-[11px] cursor-pointer transition-colors ${
                    currentStep === st.num
                      ? 'bg-blue-50 font-bold text-blue-800'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {completedSteps.includes(st.num) ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-slate-300 text-[9px] flex items-center justify-center">
                        {st.num}
                      </span>
                    )}
                    {st.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {currentStep === st.num ? 'Active' : completedSteps.includes(st.num) ? 'Ready' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cargo Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5 text-xs">
            <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Cargo Summary
            </h3>
            <div className="flex justify-between text-slate-600">
              <span>Total Package Lines</span>
              <span className="font-extrabold text-slate-900">{totalPackages}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Items (Count)</span>
              <span className="font-extrabold text-slate-900">{totalItemsCount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Gross Weight</span>
              <span className="font-extrabold text-slate-900">{totalWeightKg} kg</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Calculated Volume</span>
              <span className="font-extrabold text-slate-900">{totalVolumeM3} m&sup3;</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Declared Cargo Value</span>
              <span className="font-extrabold text-slate-900">
                TZS {totalDeclaredValue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Estimated Cost Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2 text-xs">
            <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Estimated Cost</span>
              <span className="text-[10px] text-slate-400 font-normal">TZS Currency</span>
            </h3>
            <div className="flex justify-between text-slate-500">
              <span>Base Freight ({serviceType})</span>
              <span>TZS {baseShippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Special Handling</span>
              <span>TZS {handlingFee.toLocaleString()}</span>
            </div>
            {insuranceFee > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Cargo Insurance</span>
                <span>TZS {insuranceFee.toLocaleString()}</span>
              </div>
            )}
            {storageFee > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Warehouse Storage ({storageDurationDays} days)</span>
                <span>TZS {storageFee.toLocaleString()}</span>
              </div>
            )}
            {customsFee > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Transit & Customs</span>
                <span>TZS {customsFee.toLocaleString()}</span>
              </div>
            )}
            {podFee > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Hardcopy POD Return</span>
                <span>TZS {podFee.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-slate-900">
              <span>Total Estimated</span>
              <span className="text-blue-700">TZS {totalEstimatedCost.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Price includes electronic tracking, digital delivery note and SMS notifications.
            </p>
          </div>

          {/* Contextual operational help card */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Operational Guideline</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-snug">
              {currentStep === 1 &&
                'Selecting Standard Shipping routes direct to delivery. Selecting Storage + Shipping schedules warehouse binning before dispatch.'}
              {currentStep === 2 &&
                'Ensure accurate phone numbers for recipient SMS delivery notifications and dispatch coordinate confirmation.'}
              {currentStep === 3 &&
                'Weight and dimensions determine air/sea volumetric rates. Bins are automatically reserved based on item dimensions.'}
              {currentStep === 4 &&
                'Corporate accounts have 30-day settlement terms. Unpaid accounts will require pre-payment prior to delivery release.'}
              {currentStep === 5 &&
                'Review all manifest items carefully. Upon submission, QR waybill labels are generated and ready for print.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateShipmentView;
