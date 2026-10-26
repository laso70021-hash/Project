'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  Layers,
  MapPin,
  QrCode,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Globe,
  Sparkles,
  ChevronRight,
  Building2,
  FileText,
  CreditCard,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';

export default function LandingPageView() {
  const { setCurrentRole, setActiveTab, shipments, packages } = useApp();
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;

    setHasSearched(true);
    const foundShipment = shipments.find(
      (s) => s.trackingNumber.toLowerCase() === trackInput.trim().toLowerCase()
    );
    const foundPkg = packages.find(
      (p) => p.packageId.toLowerCase() === trackInput.trim().toLowerCase()
    );

    if (foundShipment) {
      setTrackResult({
        type: 'shipment',
        id: foundShipment.trackingNumber,
        status: foundShipment.status,
        origin: foundShipment.origin,
        destination: foundShipment.destination,
        consignee: foundShipment.customerName,
        service: foundShipment.serviceType,
      });
    } else if (foundPkg) {
      setTrackResult({
        type: 'package',
        id: foundPkg.packageId,
        status: foundPkg.status,
        location: foundPkg.locationCode || 'In Receiving Dock',
        consignee: foundPkg.customerName,
        service: 'Warehouse Bonded Storage',
      });
    } else {
      setTrackResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
              S
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider block">SWAHIVO</span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-widest block uppercase">
                LOGISTICS OS
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#warehousing" className="hover:text-white transition">Bonded Warehousing</a>
            <a href="#corridors" className="hover:text-white transition">Transit Corridors</a>
            <a href="#tracking" className="hover:text-white transition">Track Consignment</a>
            <a href="#capabilities" className="hover:text-white transition">Digital Twin Engine</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentRole('customer');
                setActiveTab('customer_portal');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition"
            >
              Customer Portal
            </button>
            <button
              onClick={() => {
                setCurrentRole('admin');
                setActiveTab('dashboard');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              Launch Platform <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Supply Chain Engine for East Africa
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            The Operating System for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Modern Logistics & Storage
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Unify bonded warehousing, 2D interactive digital twins, rack-level barcode verification, and real-time grounded cross-border freight across Tanzania, Zanzibar, Kenya, and Rwanda.
          </p>

          {/* Real-time Tracking Box */}
          <div id="tracking" className="max-w-xl mx-auto pt-4">
            <form onSubmit={handleTrack} className="bg-slate-800/90 border border-slate-700 p-2 rounded-2xl flex gap-2 shadow-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  placeholder="Enter tracking # (e.g. TZL-20261025-001 or PKG-1042)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-slate-400 focus:outline-none text-xs font-mono font-semibold"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md shrink-0"
              >
                Track Now
              </button>
            </form>

            {hasSearched && (
              <div className="mt-4 p-4 rounded-xl border border-slate-700 bg-slate-800/80 text-left text-xs animate-in fade-in">
                {trackResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-400 text-sm">{trackResult.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {trackResult.status}
                      </span>
                    </div>
                    <div className="text-slate-300">
                      Consignee: <span className="font-bold text-white">{trackResult.consignee}</span>
                    </div>
                    {trackResult.origin && (
                      <div className="text-slate-400 text-[11px]">
                        Route: {trackResult.origin} → {trackResult.destination}
                      </div>
                    )}
                    {trackResult.location && (
                      <div className="text-emerald-400 font-mono text-[11px]">
                        Current Location: {trackResult.location}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-rose-400 text-center font-semibold">
                    No active consignment found for &quot;{trackInput}&quot;. Try &quot;TZL-20261025-001&quot; or &quot;PKG-1042&quot;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Platform Role Launchers */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-slate-400 font-medium">Quick Demo Access:</span>
            <button
              onClick={() => {
                setCurrentRole('admin');
                setActiveTab('dashboard');
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold text-slate-200 transition"
            >
              🏢 Admin Overview
            </button>
            <button
              onClick={() => {
                setCurrentRole('warehouse_manager');
                setActiveTab('wh_overview');
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold text-slate-200 transition"
            >
              📦 Warehouse Operations
            </button>
            <button
              onClick={() => {
                setCurrentRole('customer');
                setActiveTab('customer_portal');
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold text-slate-200 transition"
            >
              👤 Customer Portal
            </button>
            <button
              onClick={() => {
                setCurrentRole('driver');
                setActiveTab('driver_portal');
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold text-slate-200 transition"
            >
              🚚 Driver Portal
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section id="capabilities" className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Engineered for End-to-End Operational Integrity
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Every package, rack, and truck is linked to a single PostgreSQL source of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2D Digital Twin Floor Plan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visualise the entire 48m × 30m warehouse layout with live capacity heatmaps, rack elevations, and serpentine pick routes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Verified QR Putaway</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan package and shelf barcodes with Zebra scanners or phone cameras to prevent misplaced inventory and enforce load limits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">East Africa Corridor Transit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ground freight corridors across Dar es Salaam, Morogoro, Dodoma, Arusha, Mombasa, and Kigali with live waypoint logging.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Automated SaaS Billing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic storage duration pricing, handling fees, freight mileage calculations, and verifiable e-POD documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SWAHIVO Logistics OS</span>
            <span>•</span>
            <span>Dar es Salaam Port Hub — Kurasini Industrial Area</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            TZ • KE • RW Cross-Border Logistics Backbone
          </div>
        </div>
      </footer>
    </div>
  );
}
