'use client';

import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Scan,
  Clock,
  Phone,
  Navigation,
  FileCheck,
  Camera,
  Signature,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';
import RouteMap from '@/components/common/RouteMap';

export default function DriverPortalView() {
  const { shipments, confirmDelivery, updateShipmentStatus } = useApp();

  // Active driver: Ali Hassan (DRV-001)
  const [driverStatus, setDriverStatus] = useState<'On Route' | 'Available' | 'Break'>('On Route');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('shp-1');
  const [recipientName, setRecipientName] = useState('John Doe (Site Engineer)');
  const [podNotes, setPodNotes] = useState('Delivered directly to warehouse dock gate #2. Goods inspected undamaged.');
  const [podSuccess, setPodSuccess] = useState(false);
  const [signatureCaptured, setSignatureCaptured] = useState(true);

  // Driver assigned shipments
  const activeShipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    confirmDelivery(
      activeShipment.id,
      recipientName,
      'https://api.signature.png',
      undefined,
      podNotes
    );
    setPodSuccess(true);
    setTimeout(() => setPodSuccess(false), 4000);
  };

  const handleUpdateTransit = (status: any) => {
    updateShipmentStatus(activeShipment.id, status, `Driver update: Status set to ${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Driver Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-blue-600">
              <Truck className="w-4 h-4 text-white" />
            </span>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Assigned Fleet Driver Portal
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              DRV-001
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Ali Hassan</h1>
          <p className="text-xs text-slate-400 mt-1">
            Assigned Vehicle: <span className="font-bold text-white font-mono">TZ 1234 AB</span> • Isuzu Forward 7-Ton Box Truck • Phone: +255 777 123 456
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Duty Status</div>
            <select
              value={driverStatus}
              onChange={(e) => setDriverStatus(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 text-emerald-400 mt-0.5"
            >
              <option value="On Route">🟢 On Route</option>
              <option value="Available">🔵 Available for Dispatch</option>
              <option value="Break">🟡 Break / Off Duty</option>
            </select>
          </div>
        </div>
      </div>

      {podSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Proof of Delivery recorded and synced! Waybill signed by {recipientName}. Consignment marked DELIVERED.
          </span>
        </div>
      )}

      {/* 4 Driver KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Today&apos;s Route Stops</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4 Deliveries</div>
          <div className="text-[11px] text-blue-600 font-medium">Stop 2 in progress</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Cargo On Board</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">18 Pkgs</div>
          <div className="text-[11px] text-emerald-600 font-medium">Total 1,840 kg loaded</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Distance Covered</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">184 km</div>
          <div className="text-[11px] text-purple-600 font-medium">Morogoro Corridor route</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Driver Performance</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4.9 ★</div>
          <div className="text-[11px] text-amber-600 font-medium">Top Rated Fleet Transporter</div>
        </div>
      </div>

      {/* Main Grid: Active Assignment & Digital POD Confirmation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Delivery Assignment (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Active Assignment
              </span>
              <h2 className="text-lg font-mono font-bold text-slate-900">
                {activeShipment.trackingNumber}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {activeShipment.status}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-slate-500 block">Consignee Customer:</span>
                <span className="font-bold text-slate-900 text-sm">{activeShipment.customerName}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">Contact: {activeShipment.customerPhone}</span>
              </div>
              <a
                href={`tel:${activeShipment.customerPhone}`}
                className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg flex items-center gap-1 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" /> Call Consignee
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Origin Point</span>
                <span className="font-bold text-slate-800">{activeShipment.origin}</span>
                <span className="text-[11px] text-slate-500 block">{activeShipment.pickupAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Destination Address</span>
                <span className="font-bold text-slate-800">{activeShipment.destination}</span>
                <span className="text-[11px] text-slate-500 block">{activeShipment.deliveryAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick Status Action Controls */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700">Update Trip Progress</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleUpdateTransit('Picked Up')}
                className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition"
              >
                1. Picked Up
              </button>
              <button
                onClick={() => handleUpdateTransit('In Transit')}
                className="py-2 px-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold text-xs rounded-lg transition"
              >
                2. In Transit
              </button>
              <button
                onClick={() => handleUpdateTransit('Out for Delivery')}
                className="py-2 px-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-xs rounded-lg transition"
              >
                3. Out for Delivery
              </button>
            </div>
          </div>

          {/* Vector Route Map */}
          <div className="border border-slate-200 rounded-xl overflow-hidden h-60">
            <RouteMap />
          </div>
        </div>

        {/* Right: Electronic Proof of Delivery (POD) (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Electronic Proof of Delivery (e-POD)
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Legally Binding</span>
          </div>

          <form onSubmit={handleConfirmDelivery} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Recipient / Authorized Consignee Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Recipient Signature Touchpad
              </label>
              <div className="h-28 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-center relative cursor-crosshair">
                <span className="font-serif italic text-2xl text-slate-700 opacity-80">
                  {recipientName || 'John Doe'}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Digitally Signed
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Delivery Condition Notes</label>
              <textarea
                rows={2}
                value={podNotes}
                onChange={(e) => setPodNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Delivery & Submit Proof
            </button>
          </form>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px]">
              Submitting POD immediately updates the customer dashboard, releases driver billing credits, and generates the final PDF delivery receipt in Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
