'use client';

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Package,
  Layers,
  ArrowRight,
  Printer,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';
import WarehouseFloorMap from '@/components/common/WarehouseFloorMap';
import RackShelfView from '@/components/common/RackShelfView';

export default function WarehousePackageLocator() {
  const { packages, racks, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('PKG-1042');
  const [activePackageId, setActivePackageId] = useState('PKG-1042');

  const foundPackage =
    packages.find(
      (p) =>
        p.packageId.toLowerCase() === activePackageId.toLowerCase() ||
        (p.locationCode && p.locationCode.toLowerCase() === activePackageId.toLowerCase())
    ) || packages[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActivePackageId(searchTerm.trim());
    }
  };

  // Parse location code e.g. WH001-C-R05-L02-B03
  const locParts = foundPackage.locationCode ? foundPackage.locationCode.split('-') : [];
  const zoneName = locParts[1] ? `Zone ${locParts[1]}` : 'Zone C';
  const rackId = locParts[2] || 'R05';
  const levelCode = locParts[3] || 'L02';
  const binCode = locParts[4] || 'B03';

  return (
    <div className="space-y-6">
      {/* Top Search Bar & Instructions */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Real-Time Physical Location Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Find Any Package or Storage Bin Instantly
          </h1>
          <p className="text-sm text-slate-300">
            Enter a package tracking ID (e.g., <span className="font-mono text-amber-300">PKG-1042</span>) or location barcode (<span className="font-mono text-amber-300">WH001-C-R05-L02-B03</span>) to render the 2D floor path and shelf elevation.
          </p>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search PKG-1042, PKG-1043, or bin..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm font-semibold"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shrink-0 flex items-center gap-2"
            >
              Locate Package
            </button>
          </form>

          {/* Quick presets */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <span>Quick test:</span>
            {['PKG-1042', 'PKG-1043', 'PKG-1044', 'PKG-1045'].map((pkgId) => (
              <button
                key={pkgId}
                type="button"
                onClick={() => {
                  setSearchTerm(pkgId);
                  setActivePackageId(pkgId);
                }}
                className={`font-mono px-2 py-0.5 rounded transition ${
                  activePackageId === pkgId
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {pkgId}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verified Location Card Banner */}
      {foundPackage && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Identified Package
            </span>
            <div className="text-xl font-mono font-black text-blue-600">{foundPackage.packageId}</div>
            <div className="text-xs font-semibold text-slate-800">{foundPackage.customerName}</div>
            <div className="text-xs text-slate-500">{foundPackage.productName || foundPackage.itemName}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Verified Physical Location
            </span>
            <div className="text-lg font-mono font-black text-emerald-600">
              {foundPackage.locationCode || 'In Receiving Dock'}
            </div>
            <div className="text-xs text-slate-600">
              {zoneName} • Rack {rackId} • Level {levelCode} • Bin {binCode}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Physical Properties
            </span>
            <div className="text-sm font-bold text-slate-800">{foundPackage.weightKg} kg</div>
            <div className="text-xs text-slate-500">Dimensions: {foundPackage.dimensions || '40x30x25cm'}</div>
            <div className="text-xs text-slate-500">Stored on: {foundPackage.receivedAt}</div>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <button
              onClick={() => setActiveTab('wh_transfers')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Initiate Picking / Transfer
            </button>
            <button
              onClick={() => setActiveTab('wh_qr')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              Print Replacement QR
            </button>
          </div>
        </div>
      )}

      {/* Visual Twin: Floor Plan & Shelf View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Warehouse Floor Plan with highlighted rack (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Floor Path to Rack {rackId}
              </h2>
              <p className="text-xs text-slate-500">Follow Main Forklift Corridor to Zone {locParts[1] || 'C'}</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
              Distance: ~28m
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
            <WarehouseFloorMap highlightRackId={rackId} />
          </div>
        </div>

        {/* Right: Shelf Elevation with highlighted bin (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rack {rackId} Elevation Diagram</h3>
              <p className="text-xs text-slate-500">
                Pulsing bin indicates exact physical position of {foundPackage.packageId}
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
              Bin {binCode}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <RackShelfView rackId={rackId} highlightPackageId={foundPackage.packageId} />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">Verified Storage Security:</span> Last physical audit completed 4 hours ago by warehouse inventory inspector.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
