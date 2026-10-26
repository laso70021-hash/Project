'use client';

import React, { useState } from 'react';
import {
  Package,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardCheck,
  Search,
  Filter,
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Printer,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';
import WarehouseFloorMap from '@/components/common/WarehouseFloorMap';
import RackShelfView from '@/components/common/RackShelfView';

export default function WarehouseOverview() {
  const { packages, racks, bookings, pickTasks, setActiveTab } = useApp();
  const [selectedRackId, setSelectedRackId] = useState<string>('R05');
  const [searchFilter, setSearchFilter] = useState('');

  const totalPackages = packages.length;
  const inStoragePackages = packages.filter((p) => p.status === 'Stored').length;
  const pendingPutaway = packages.filter((p) => p.status === 'Received').length;
  const pendingPicking = packages.filter((p) => p.status === 'Picking' || p.status === 'Reserved').length;
  const dispatchedPackages = packages.filter((p) => p.status === 'Dispatched').length;

  // Calculate real capacity from racks
  const totalCapacityKg = racks.reduce(
    (acc, r) => acc + (r.maxWeightCapacityKg || (r.levelsCount * r.binsPerLevel * r.maxWeightKgPerBin) || 5000),
    0
  );
  const currentWeightKg = racks.reduce(
    (acc, r) => acc + (r.currentWeightKg || r.bins?.reduce((bAcc, b) => bAcc + (b.currentWeightKg || 0), 0) || 0),
    0
  );
  const utilizationPct = totalCapacityKg > 0 ? Math.round((currentWeightKg / totalCapacityKg) * 100) : 72;

  // Filtered packages
  const recentPackages = packages.slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Operations Center</h1>
          <p className="text-sm text-slate-500">
            WH001 Main Facility — Kurasini Port District, Dar es Salaam • Floor Area: 1,440 m² (48m × 30m)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('wh_receiving')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Receive Inbound Goods
          </button>
          <button
            onClick={() => setActiveTab('wh_locator')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <MapPin className="w-4 h-4" />
            Locate Package
          </button>
          <button
            onClick={() => setActiveTab('wh_qr')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <QrCode className="w-4 h-4" />
            QR Generator & Scanner
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">Packages in Store</div>
            <div className="text-2xl font-bold text-slate-900">{inStoragePackages}</div>
            <div className="text-[11px] text-blue-600 font-medium">Across 8 active racks</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">Capacity Used</div>
            <div className="text-2xl font-bold text-slate-900">{utilizationPct}%</div>
            <div className="text-[11px] text-purple-600 font-medium">{(currentWeightKg / 1000).toFixed(1)}t of {(totalCapacityKg / 1000).toFixed(1)}t max</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">Pending Putaway</div>
            <div className="text-2xl font-bold text-slate-900">{pendingPutaway}</div>
            <div className="text-[11px] text-amber-600 font-medium">Staged in Receiving</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">Pending Picking</div>
            <div className="text-2xl font-bold text-slate-900">{pendingPicking}</div>
            <div className="text-[11px] text-indigo-600 font-medium">{pickTasks.filter((t) => t.status === 'In Progress').length} tasks active</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">Storage Bookings</div>
            <div className="text-2xl font-bold text-slate-900">{bookings.length}</div>
            <div className="text-[11px] text-emerald-600 font-medium">{bookings.filter((b) => b.status === 'Active').length} currently active</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive 2D Warehouse Floor Plan + Selected Rack Elevation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Floor Map (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">2D Warehouse Digital Twin</h2>
                <p className="text-xs text-slate-500">Click any rack to inspect its 3-tier elevation & bin assignments</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Occupied
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Staging
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900">
            <WarehouseFloorMap
              highlightRackId={selectedRackId}
              onSelectRack={(rackId) => setSelectedRackId(rackId)}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Racks R01–R08 • Heavy-Duty Steel Cantilever & Selective Pallet Racks</span>
            <button
              onClick={() => setActiveTab('wh_designer')}
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Open Full Map Designer <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Selected Rack Elevation & Bin Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Boxes className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Rack {selectedRackId} Elevation</h2>
                <p className="text-xs text-slate-500">Levels L01–L03 • Bins B01–B03 per level</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {['R01', 'R02', 'R03', 'R04', 'R05', 'R06'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRackId(r)}
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    selectedRackId === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
            <RackShelfView
              rackId={selectedRackId}
              highlightPackageId="PKG-1042"
              onSelectBin={(bin) => {
                console.log('Selected bin:', bin.code);
              }}
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <span className="font-semibold">Putaway Recommendation:</span> Level L02 Bin B03 has 2 slots reserved for incoming shipment <span className="font-mono font-medium">TZL-20261025-001</span>.
            </div>
          </div>
        </div>
      </div>

      {/* Operational Ledger: Active Inventory & Movement Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Current Physical Inventory Records</h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
              {packages.length} Packages Total
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search pkg, bin, owner..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
              />
            </div>
            <button
              onClick={() => setActiveTab('wh_inventory')}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              View Full Table
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Package ID</th>
                <th className="py-3 px-4">Customer / Consignee</th>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4">Storage Location</th>
                <th className="py-3 px-4">Weight & Dimensions</th>
                <th className="py-3 px-4">Received Date</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentPackages
                .filter(
                  (p) =>
                    !searchFilter ||
                    p.packageId.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    p.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    (p.locationCode && p.locationCode.toLowerCase().includes(searchFilter.toLowerCase()))
                )
                .map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                      {pkg.packageId}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {pkg.customerName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {pkg.productName || pkg.itemName}
                    </td>
                    <td className="py-3 px-4">
                      {pkg.locationCode ? (
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium border border-slate-200">
                          {pkg.locationCode}
                        </span>
                      ) : (
                        <span className="text-amber-600 italic">Receiving Dock</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {pkg.weightKg} kg • {pkg.dimensions || '40x30x25cm'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {pkg.receivedAt}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          pkg.status === 'Stored'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : pkg.status === 'Received'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : pkg.status === 'Picking'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveTab('wh_locator');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" /> Locate
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
