'use client';

import React, { useState } from 'react';
import {
  ArrowDownLeft,
  CheckCircle2,
  QrCode,
  Printer,
  Boxes,
  MapPin,
  Search,
  Scan,
  Package,
  Sparkles,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';

export default function WarehouseReceiving() {
  const { customers, packages, racks, confirmPutaway, receivePackageBatch, setActiveTab } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('c1');
  const [packageId, setPackageId] = useState<string>('PKG-1049');
  const [itemName, setItemName] = useState<string>('Solar Inverter 5kVA Hybrid');
  const [category, setCategory] = useState<string>('Electronics');
  const [weightKg, setWeightKg] = useState<number>(28.5);
  const [dimensions, setDimensions] = useState<string>('50x40x25 cm');
  const [targetLocation, setTargetLocation] = useState<string>('WH001-C-R05-L02-B03');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const customer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const pendingPackages = packages.filter((p) => p.status === 'Received');

  const handleExecutePutaway = () => {
    // Commit putaway to real store
    confirmPutaway(packageId, targetLocation);
    setSuccessMessage(`Package ${packageId} successfully confirmed and placed into ${targetLocation}!`);
    setTimeout(() => {
      setSuccessMessage('');
      setStep(1);
    }, 4000);
  };

  const handleRegisterNewInbound = async () => {
    await receivePackageBatch([
      {
        packageId,
        customerId: customer.id,
        customerName: customer.name,
        customerCode: customer.customerCode,
        itemName,
        category,
        weightKg,
        dimensions,
        locationCode: '',
        status: 'Received',
        receivedAt: new Date().toISOString().split('T')[0],
      },
    ]);
    setStep(3); // proceed to QR & putaway assignment
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inbound Receiving & Putaway</h1>
          <p className="text-sm text-slate-500">
            5-stage verified inbound receiving protocol: Inspection → QR Tagging → Bin Assignment → Putaway Confirmation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('wh_qr')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            Barcode Scanner Mode
          </button>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div
            className={`p-3 rounded-lg flex items-center gap-2.5 ${
              step >= 1 ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' : 'bg-slate-50 text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>1. Inbound Identification</span>
          </div>
          <div
            className={`p-3 rounded-lg flex items-center gap-2.5 ${
              step >= 2 ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' : 'bg-slate-50 text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
            <span>2. Quality & Weight Check</span>
          </div>
          <div
            className={`p-3 rounded-lg flex items-center gap-2.5 ${
              step >= 3 ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' : 'bg-slate-50 text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
            <span>3. QR Label Generation</span>
          </div>
          <div
            className={`p-3 rounded-lg flex items-center gap-2.5 ${
              step >= 4 ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'bg-slate-50 text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">4</span>
            <span>4. Verified Bin Putaway</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Receiving Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inbound Details & Putaway Assignment (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Package Registration & Placement</h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
              Receiving Dock Bay #2
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Customer / Consignee</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white font-medium"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.customerCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Package Barcode ID</label>
                <input
                  type="text"
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Cargo / Item Description</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium bg-white"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Dry Foods">Dry Foods</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scale Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dimensions (L × W × H)</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Target Storage Bin Assignment */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Target Putaway Bin Location
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Algorithm Match
                </span>
              </div>
              <input
                type="text"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-slate-900 font-mono font-bold text-sm bg-white"
              />
              <p className="text-[11px] text-blue-700">
                Rack R05 • Tier L02 • Bin B03 has 232 kg payload margin available.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRegisterNewInbound}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
              >
                Register Inbound Staging
              </button>
              <button
                type="button"
                onClick={handleExecutePutaway}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Verified Putaway
              </button>
            </div>
          </div>
        </div>

        {/* Right QR Thermal Label Live Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Thermal Label (4&quot; × 6&quot;) Preview</h3>
            <button
              onClick={() => window.print()}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" /> Print Now
            </button>
          </div>

          {/* Genuine Printable Shipping & Warehouse Label */}
          <div className="border-2 border-slate-900 rounded-xl p-4 bg-white text-slate-900 space-y-3 font-sans shadow-inner">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <span className="font-extrabold text-sm tracking-wider">SWAHIVO LOGISTICS OS</span>
              <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                WH001 INBOUND
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Tracking / Barcode</div>
                <div className="font-mono text-base font-black tracking-tight">{packageId}</div>
                <div className="text-xs font-bold text-slate-800">{customer.name}</div>
                <div className="text-[11px] text-slate-600">{itemName}</div>
              </div>

              {/* QR Code Container */}
              <div className="p-1 border border-slate-900 rounded bg-white shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https://swahivo.logistics/pkg/${packageId}`}
                  alt="QR Code"
                  className="w-20 h-20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-900 py-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Weight / Volume</span>
                <span className="font-bold">{weightKg} kg</span> • {dimensions}
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Category</span>
                <span className="font-bold">{category}</span>
              </div>
            </div>

            <div className="pt-1">
              <div className="text-[10px] text-slate-500 uppercase">Assigned Putaway Location</div>
              <div className="font-mono text-sm font-black text-slate-950 bg-slate-100 p-1.5 rounded text-center border border-slate-300">
                {targetLocation}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            Zebra ZD420 / Rollo thermal printer compatible • 203 DPI Barcode Standard
          </div>
        </div>
      </div>

      {/* Staged Packages Awaiting Putaway Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Inbound Packages Staged in Receiving Area</h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
              {pendingPackages.length} Pending Putaway
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">Package ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Staged Time</th>
                <th className="py-3 px-4">Recommended Shelf</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pendingPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{pkg.packageId}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{pkg.customerName}</td>
                  <td className="py-3 px-4 text-slate-600">{pkg.productName || pkg.itemName}</td>
                  <td className="py-3 px-4 text-slate-600">{pkg.weightKg} kg</td>
                  <td className="py-3 px-4 text-slate-500">{pkg.receivedAt}</td>
                  <td className="py-3 px-4 font-mono text-slate-800">WH001-C-R05-L02-B03</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setPackageId(pkg.packageId);
                        setItemName(pkg.productName || pkg.itemName || '');
                        setWeightKg(pkg.weightKg);
                        setTargetLocation('WH001-C-R05-L02-B03');
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs"
                    >
                      Putaway
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
