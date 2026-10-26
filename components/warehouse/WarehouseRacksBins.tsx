'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Layers,
  QrCode,
  Printer,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Package,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';
import RackShelfView from '@/components/common/RackShelfView';
import { StorageBin } from '@/lib/types';

export default function WarehouseRacksBins() {
  const { racks, packages, setActiveTab } = useApp();
  const [selectedRackId, setSelectedRackId] = useState<string>('R05');
  const [selectedBinState, setSelectedBinState] = useState<StorageBin | null>(null);

  const currentRack = racks.find((r) => r.id === selectedRackId) || racks[0];

  // Derive active bin directly from selected rack & user interaction
  const selectedBin =
    selectedBinState && selectedBinState.rackCode === currentRack.rackCode
      ? selectedBinState
      : currentRack.bins?.find((b) => b.binCode === 'B03' && b.levelNumber === 2) ||
        currentRack.bins?.[0] ||
        null;

  // Packages in this rack
  const rackPackages = packages.filter(
    (p) => (p.locationCode && p.locationCode.includes(currentRack.rackCode)) ||
           (p.currentLocationCode && p.currentLocationCode.includes(currentRack.rackCode))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Racks & Storage Bins Management</h1>
          <p className="text-sm text-slate-500">
            Physical shelf hierarchy: Warehouse → Zone → Rack → Level (L01–L03) → Bin (B01–B03)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('wh_qr')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print All Bin Labels
          </button>
        </div>
      </div>

      {/* Rack Selector Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {racks.map((rack) => {
          const isSelected = rack.id === selectedRackId;
          const rackCapacity = rack.maxWeightCapacityKg || (rack.levelsCount * rack.binsPerLevel * rack.maxWeightKgPerBin) || 900;
          const rackWeight = rack.currentWeightKg || rack.bins?.reduce((acc, b) => acc + (b.currentWeightKg || 0), 0) || 0;
          const weightPct = Math.min(100, Math.round((rackWeight / rackCapacity) * 100));
          return (
            <button
              key={rack.id}
              onClick={() => setSelectedRackId(rack.id)}
              className={`px-4 py-2.5 rounded-xl border text-left shrink-0 transition ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="font-bold text-sm">{rack.id}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {rack.zoneName || rack.zone}
                </span>
              </div>
              <div className="text-[11px] opacity-80">{rack.category || rack.storageType}</div>
              <div className="w-24 bg-black/20 rounded-full h-1 mt-2 overflow-hidden">
                <div
                  className={`h-full ${isSelected ? 'bg-white' : 'bg-blue-600'}`}
                  style={{ width: `${weightPct}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Visual Shelf Elevation & Detailed Bin Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visual Shelf Elevation (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Rack {currentRack.id} Elevation Matrix
                </h2>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono font-semibold">
                  {currentRack.rackCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Click any bin cell below to view contents, verify load limits, or print QR
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900">
                {currentRack.currentWeightKg ?? (currentRack.bins?.reduce((acc, b) => acc + (b.currentWeightKg || 0), 0) ?? 192)} kg / {currentRack.maxWeightCapacityKg ?? (currentRack.levelsCount * currentRack.binsPerLevel * currentRack.maxWeightKgPerBin)} kg
              </span>
              <div className="text-[11px] text-slate-500">Heavy-Duty Selective Pallet Rack</div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <RackShelfView
              rackId={selectedRackId}
              rackCode={currentRack.rackCode}
              highlightPackageId="PKG-1042"
              onSelectBin={(bin) => setSelectedBinState(bin)}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Color legend: Emerald = Available, Blue = Stored, Amber = High Occupancy</span>
            <span className="font-semibold text-slate-700">Total Bins: 9 (3 levels × 3 bins)</span>
          </div>
        </div>

        {/* Right Bin Inspector & Stored Packages (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Inspected Bin
              </span>
              <h3 className="text-lg font-mono font-bold text-slate-900">
                {selectedBin?.locationCode || selectedBin?.code || `${currentRack.rackCode}-L02-B03`}
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                (selectedBin?.currentWeightKg || 0) > 0
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {(selectedBin?.currentWeightKg || 0) > 0 ? 'Occupied (Stored)' : 'Available'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Bin Level & Column</span>
              <span className="font-bold text-slate-900">
                Level {selectedBin?.levelNumber || 2} • Position {selectedBin?.binCode || 'B03'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Payload Usage</span>
              <span className="font-bold text-slate-900">
                {selectedBin?.currentWeightKg || 0} kg / {selectedBin?.maxWeightKg || 100} kg
              </span>
            </div>
          </div>

          {/* Stored Packages in this Bin */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>Packages in this Bin</span>
              <span className="text-slate-500 font-normal">
                {packages.filter((p) => {
                  const targetLoc = selectedBin?.locationCode || selectedBin?.code || `${currentRack.rackCode}-L02-B03`;
                  return p.locationCode === targetLoc || p.currentLocationCode === targetLoc;
                }).length} items
              </span>
            </h4>

            <div className="space-y-2">
              {packages
                .filter((p) => {
                  const targetLoc = selectedBin?.locationCode || selectedBin?.code || `${currentRack.rackCode}-L02-B03`;
                  return p.locationCode === targetLoc || p.currentLocationCode === targetLoc;
                })
                .map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-blue-700">{pkg.packageId}</div>
                      <div className="text-slate-700 font-medium">{pkg.productName || pkg.itemName}</div>
                      <div className="text-[11px] text-slate-500">
                        Owner: {pkg.customerName} • {pkg.weightKg} kg
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('wh_locator')}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-semibold text-[11px]"
                    >
                      Locate
                    </button>
                  </div>
                ))}

              {packages.filter(
                (p) =>
                  p.locationCode ===
                  (selectedBin ? selectedBin.code : `${currentRack.rackCode}-L02-B03`)
              ).length === 0 && (
                <div className="p-4 text-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                  This bin is currently empty and ready for inbound putaway.
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setActiveTab('wh_receiving')}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
            >
              Putaway Package Here
            </button>
            <button
              onClick={() => setActiveTab('wh_qr')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              Print Bin QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
