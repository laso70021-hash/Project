'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store-context';
import {
  Package,
  Boxes,
  Truck,
  Plus,
  Edit2,
  Trash2,
  Check,
  ChevronRight,
  Info,
  Calendar,
  Building,
  User,
  ArrowRight,
} from 'lucide-react';

interface CreateShipmentViewProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateShipmentView({ onSuccess, onCancel }: CreateShipmentViewProps) {
  const { customers, drivers, vehicles, createShipment } = useAppStore();

  const [step, setStep] = useState(1);
  const [shipmentType, setShipmentType] = useState<'Standard' | 'Storage + Shipping'>('Standard');
  const [selectedCustomerId, setSelectedCustomerId] = useState('c-001');

  // Form states
  const [referenceNumber, setReferenceNumber] = useState('REF-2024-001');
  const [serviceType, setServiceType] = useState<'Standard' | 'Express' | 'Freight'>('Express');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [description, setDescription] = useState('Electronics and accessories');
  const [pickupDate, setPickupDate] = useState('2024-06-12');
  const [deliveryDate, setDeliveryDate] = useState('2024-06-14');
  const [category, setCategory] = useState('General Goods');
  const [specialInstructions, setSpecialInstructions] = useState('Handle with care. Fragile items.');

  const [pickupLocationType, setPickupLocationType] = useState<'customer' | 'warehouse'>('customer');
  const [deliveryLocationType, setDeliveryLocationType] = useState<'customer' | 'warehouse'>('customer');
  const [pickupMethod, setPickupMethod] = useState('Our Driver (Scheduled)');
  const [deliveryMethod, setDeliveryMethod] = useState('Our Driver (Direct)');

  const [assignedDriverId, setAssignedDriverId] = useState('d-001');
  const [assignedVehiclePlate, setAssignedVehiclePlate] = useState('TZ 1234 AB');

  // Items
  const [items, setItems] = useState([
    { id: '1', name: 'Laptop', quantity: 5, weightKg: 8, dimensions: '40 x 30 x 10 cm', valueTzs: 4500000 },
    { id: '2', name: 'Accessories', quantity: 10, weightKg: 4, dimensions: '30 x 20 x 15 cm', valueTzs: 1200000 },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemWeight, setNewItemWeight] = useState(5);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Totals calculation
  const totalPackages = items.length;
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalWeight = items.reduce((acc, i) => acc + i.weightKg, 0);
  const totalVolume = 0.12;

  const baseShippingFee = serviceType === 'Express' ? 350000 : 250000;
  const handlingFee = 50000;
  const insuranceFee = 5000;
  const storageFee = shipmentType === 'Storage + Shipping' ? 120000 : 0;
  const totalEstimatedCost = baseShippingFee + handlingFee + insuranceFee + storageFee;

  const handleAddItem = () => {
    if (!newItemName) return;
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newItemName,
        quantity: newItemQty,
        weightKg: newItemWeight,
        dimensions: '40 x 30 x 20 cm',
        valueTzs: 500000,
      },
    ]);
    setNewItemName('');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = async () => {
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
      origin: 'Dar es Salaam (Plot 45, Nyerere Road)',
      destination: 'Zanzibar Branch (Kiponda Street)',
      pickupDate,
      expectedDeliveryDate: deliveryDate,
      weightKg: totalWeight,
      totalVolumeM3: totalVolume,
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
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
          <span>Shipments</span>
          <span>&rsaquo;</span>
          <span className="text-slate-800 font-semibold">Create Shipment</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Create New Shipment</h1>
      </div>

      {/* 5-Step Process Bar matching reference */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        {[
          { stepNum: 1, title: 'Shipment Details' },
          { stepNum: 2, title: 'Pickup & Delivery' },
          { stepNum: 3, title: 'Packages & Items' },
          { stepNum: 4, title: 'Services & Payment' },
          { stepNum: 5, title: 'Review & Submit' },
        ].map((s, idx, arr) => (
          <React.Fragment key={s.stepNum}>
            <div
              onClick={() => setStep(s.stepNum)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step === s.stepNum
                    ? 'bg-blue-600 text-white shadow-xs'
                    : step > s.stepNum
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step > s.stepNum ? <Check className="h-4 w-4" /> : s.stepNum}
              </div>
              <span
                className={`text-xs font-semibold hidden md:inline ${
                  step === s.stepNum ? 'text-blue-700' : 'text-slate-500'
                }`}
              >
                {s.title}
              </span>
            </div>
            {idx < arr.length - 1 && (
              <div className="h-0.5 flex-1 bg-slate-200 mx-2 hidden sm:block" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Grid: Form Inputs (8 cols) & Live Cost Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Form (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Shipment Type Selector (Standard vs Storage + Shipping) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 mb-3">Shipment Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setShipmentType('Standard')}
                className={`relative flex items-start gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all ${
                  shipmentType === 'Standard'
                    ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Standard Shipping</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Direct delivery without storage warehouse placement.
                  </p>
                </div>
                {shipmentType === 'Standard' && (
                  <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div
                onClick={() => setShipmentType('Storage + Shipping')}
                className={`relative flex items-start gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all ${
                  shipmentType === 'Storage + Shipping'
                    ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Storage + Shipping</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Store in warehouse first, register bins, then dispatch.
                  </p>
                </div>
                {shipmentType === 'Storage + Shipping' && (
                  <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Customer Information *</h3>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                + Add New Customer
              </button>
            </div>

            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-xs font-medium text-slate-800"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customerCode}) — {c.region}
                </option>
              ))}
            </select>

            {/* Selected customer card */}
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                  {selectedCustomer.name.slice(0, 2)}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">{selectedCustomer.name}</p>
                  <span className="text-[10px] text-slate-500">{selectedCustomer.customerCode}</span>
                </div>
              </div>
              <div className="text-left sm:text-right text-[11px] text-slate-600">
                <p>{selectedCustomer.phone}</p>
                <p className="text-slate-500">{selectedCustomer.email}</p>
                <p className="text-slate-400">{selectedCustomer.address}</p>
              </div>
            </div>
          </div>

          {/* Shipment Parameters */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">Shipment Details & Timing</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-600">Reference Number</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600">Service Type *</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                >
                  <option value="Express">Express (1-2 days)</option>
                  <option value="Standard">Standard (3-4 days)</option>
                  <option value="Freight">Freight Heavy (5-7 days)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-medium text-slate-600">Description *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600">Requested Pickup Date *</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600">Expected Delivery Date *</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600">Special Instructions (optional)</label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Fragile, handle with care, temperature sensitive..."
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
              />
            </div>
          </div>

          {/* Pickup & Delivery Locations */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">Pickup & Delivery Locations</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Pickup Address Card */}
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">Pickup Location *</span>
                  <span className="text-[10px] text-blue-600">Customer Address</span>
                </div>
                <p className="font-semibold text-slate-800">{selectedCustomer.name}</p>
                <p className="text-[11px] text-slate-500">{selectedCustomer.address}</p>
                <p className="text-[10px] text-slate-400 mt-1">Contact: {selectedCustomer.phone}</p>
              </div>

              {/* Delivery Address Card */}
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">Delivery Location *</span>
                  <span className="text-[10px] text-blue-600">Branch Address</span>
                </div>
                <p className="font-semibold text-slate-800">Zanzibar Branch</p>
                <p className="text-[11px] text-slate-500">Kiponda Street, Zanzibar, Tanzania</p>
                <p className="text-[10px] text-slate-400 mt-1">Contact: +255 777 123 456</p>
              </div>
            </div>

            {/* Driver Assignment Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-medium text-slate-600">Assign Driver Now</label>
                <select
                  value={assignedDriverId}
                  onChange={(e) => setAssignedDriverId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.driverCode}) — {d.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600">Assigned Vehicle</label>
                <select
                  value={assignedVehiclePlate}
                  onChange={(e) => setAssignedVehiclePlate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.plateNumber}>
                      {v.plateNumber} ({v.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary & Items Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Packages & Items Table */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Packages & Items</h3>
              <button
                onClick={() => handleAddItem()}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
              >
                + Add Package
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2.5"
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      {index + 1}. {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Qty: {item.quantity} &bull; {item.weightKg} kg &bull; {item.dimensions}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Inputs */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Item Name (e.g. Printer)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 rounded border border-slate-200 p-1.5 text-xs"
              />
              <button
                onClick={handleAddItem}
                className="rounded bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
              >
                Add
              </button>
            </div>
          </div>

          {/* Total Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5 text-xs">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              Total Summary
            </h3>
            <div className="flex justify-between text-slate-600">
              <span>Total Packages</span>
              <span className="font-bold text-slate-900">{totalPackages}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Items</span>
              <span className="font-bold text-slate-900">{totalItems}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Weight</span>
              <span className="font-bold text-slate-900">{totalWeight} kg</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Volume</span>
              <span className="font-bold text-slate-900">{totalVolume} m&sup3;</span>
            </div>
          </div>

          {/* Estimated Cost Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2 text-xs">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              Estimated Cost
            </h3>
            <div className="flex justify-between text-slate-500">
              <span>Base Shipping Fee</span>
              <span>TZS {baseShippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Handling Fee</span>
              <span>TZS {handlingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Insurance (1%)</span>
              <span>TZS {insuranceFee.toLocaleString()}</span>
            </div>
            {storageFee > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Warehouse Storage</span>
                <span>TZS {storageFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-100 pt-2 font-black text-sm text-slate-900">
              <span>Total Estimated Cost</span>
              <span className="text-blue-700">TZS {totalEstimatedCost.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Final cost may vary based on verified warehouse scale weight and dimensions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <span>Submit & Create</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateShipmentView;

