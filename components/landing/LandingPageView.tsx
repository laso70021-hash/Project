'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Boxes,
  Truck,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Globe,
  Calendar,
  FileText,
  CreditCard,
  MapPin,
  ChevronRight,
  Package,
  Building2,
  ExternalLink,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';

export default function LandingPageView() {
  const { setCurrentRole, setActiveTab, shipments, packages, createStorageBooking, customers } = useApp();
  const [trackInput, setTrackInput] = useState('');
  const [navTrackInput, setNavTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showQuickBookingModal, setShowQuickBookingModal] = useState(false);

  // Quick booking state
  const [bookingFacility, setBookingFacility] = useState('WH001 - Main Warehouse (Kurasini Port)');
  const [bookingCartons, setBookingCartons] = useState(30);
  const [bookingDays, setBookingDays] = useState(14);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  const executeTracking = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    setHasSearched(true);
    const foundShipment = shipments.find(
      (s) =>
        s.trackingNumber.toLowerCase() === q ||
        s.trackingNumber.toLowerCase().includes(q)
    );
    const foundPkg = packages.find(
      (p) =>
        p.packageId.toLowerCase() === q ||
        p.packageId.toLowerCase().includes(q)
    );

    if (foundShipment) {
      setTrackResult({
        type: 'shipment',
        id: foundShipment.trackingNumber,
        status: foundShipment.status,
        origin: foundShipment.origin,
        destination: foundShipment.destination,
        customer: foundShipment.customerName,
        carrier: foundShipment.assignedDriverName || 'SWAHIVO Express Fleet',
        estimatedDelivery: foundShipment.expectedDeliveryDate,
        weight: `${foundShipment.weightKg} kg`,
        serviceType: foundShipment.serviceType,
        itemsCount: foundShipment.items?.length || 1,
        events: foundShipment.events || [
          { status: 'Delivered', timestamp: '2026-10-25 14:30', description: 'Consignment handed over to recipient' },
          { status: 'In Transit', timestamp: '2026-10-25 08:00', description: 'Departed Dar es Salaam Port' },
          { status: 'Picked Up', timestamp: '2026-10-24 16:20', description: 'Cargo picked up from warehouse' },
        ],
      });
    } else if (foundPkg) {
      setTrackResult({
        type: 'package',
        id: foundPkg.packageId,
        status: foundPkg.status,
        location: foundPkg.locationCode || 'Dock Receiving Area',
        warehouse: foundPkg.warehouseCode || 'WH001 - Kurasini Port',
        customer: foundPkg.customerName,
        carrier: 'In-Facility Storage',
        weight: `${foundPkg.weightKg} kg`,
        dimensions: foundPkg.dimensions || '40x30x20 cm',
        rack: foundPkg.rackCode,
        bin: foundPkg.binCode,
      });
    } else {
      setTrackResult(null);
    }
  };

  const handleHeroTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTracking(trackInput);
  };

  const handleNavTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTracking(navTrackInput);
  };

  const handleQuickBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers[0];
    createStorageBooking({
      customerId: customer.id,
      customerName: customer.name,
      warehouseId: bookingFacility.startsWith('WH002') ? 'WH002' : 'WH001',
      warehouseName: bookingFacility,
      reservedSpaceSqM: Math.ceil(bookingCartons / 10),
      monthlyRateTzs: Math.ceil(bookingCartons / 10) * 25000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + bookingDays * 86400000).toISOString().split('T')[0],
      status: 'Active',
      itemsStoredCount: bookingCartons,
    });
    setBookingSuccessMsg(`Space reserved successfully for ${bookingCartons} cartons in ${bookingFacility}!`);
    setTimeout(() => {
      setBookingSuccessMsg('');
      setShowQuickBookingModal(false);
      setCurrentRole('customer');
      setActiveTab('customer-bookings');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ================= 1. AUTHORITATIVE TOP NAVIGATION ================= */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* SWAHIVO Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentRole('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="relative h-10 w-44 sm:w-52">
                <Image
                  src="/assets/aistudio/dark_logo_b87b9d61.png"
                  alt="SWAHIVO Logistics OS"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <a
              href="#home"
              className="font-bold text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Home
            </a>
            <a
              href="#services"
              className="font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Warehouse
            </a>
            <a
              href="#services"
              className="font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Shipping
            </a>
            <a
              href="#how-it-works"
              className="font-medium text-slate-700 hover:text-blue-600 transition"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="font-medium text-slate-700 hover:text-blue-600 transition"
            >
              About
            </a>
            <a
              href="#contact"
              className="font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Contact
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Quick search input */}
            <form onSubmit={handleNavTrackSubmit} className="hidden lg:flex items-center relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={navTrackInput}
                onChange={(e) => setNavTrackInput(e.target.value)}
                placeholder="Track your shipment..."
                className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-48 focus:w-60 focus:outline-hidden focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </form>

            <button
              onClick={() => setShowRoleModal(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Sign In
            </button>

            <button
              onClick={() => setShowRoleModal(true)}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0a192f] hover:bg-[#132c4a] rounded-lg transition shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO SECTION WITH LOGISTICS PANORAMA ================= */}
      <section id="home" className="relative min-h-[560px] lg:min-h-[620px] flex items-center overflow-hidden">
        {/* Background panoramic image with subtle lighting overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/landing_hero_panoramic.jpg"
            alt="East Africa Logistics Port and Warehouse"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle gradient overlay to match reference lighting */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (Hero Headline, Description, CTAs, Trust Badges) */}
            <div className="lg:col-span-7 space-y-6 text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                Warehouse + Shipping <br />
                <span className="text-white">in Tanzania and Beyond</span>
              </h1>

              <p className="text-slate-200 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Secure storage, inventory management and global shipping — all in one solution. Flexible hourly and daily storage rates across Dar es Salaam and Zanzibar.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentRole('customer');
                    setActiveTab('customer-bookings');
                  }}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
                >
                  <span>Book Warehouse Storage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setCurrentRole('admin');
                    setActiveTab('create-shipment');
                  }}
                  className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-white font-bold text-sm rounded-lg border border-white flex items-center gap-2 transition"
                >
                  <span>Request Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Trust Badges Horizontal Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-700/60 text-white">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">Secure &amp; Reliable</div>
                    <div className="text-[11px] text-slate-300">Your goods, our priority</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Boxes className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">Real-time Inventory</div>
                    <div className="text-[11px] text-slate-300">View your stock online</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Truck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">Fast Shipping</div>
                    <div className="text-[11px] text-slate-300">Dar, Arusha, Mwanza, Kigali</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Globe className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">Local &amp; Global</div>
                    <div className="text-[11px] text-slate-300">Domestic and international</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content: Floating "Track Your Shipment" Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-7 w-full max-w-md border border-slate-100 text-slate-900">
                <h3 className="text-xl font-bold text-slate-900">Track Your Shipment</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Enter your tracking number to get real-time updates
                </p>

                <form onSubmit={handleHeroTrackSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      placeholder="e.g. TZL-20261025-001"
                      className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-mono focus:outline-hidden focus:border-blue-600 transition placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0a192f] hover:bg-[#132c4a] text-white font-bold text-xs rounded-lg transition shrink-0"
                    >
                      Track
                    </button>
                  </div>
                </form>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setTrackInput('TZL-20261025-001');
                      executeTracking('TZL-20261025-001');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    Try demo: <span className="font-mono text-blue-600 underline">TZL-20261025-001</span>
                  </button>

                  <a
                    href="#contact"
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Need help? Contact support <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Real Tracking Result Display */}
                {hasSearched && (
                  <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2.5 animate-in fade-in duration-200">
                    {trackResult ? (
                      <>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-mono font-bold text-blue-700 text-sm">
                            {trackResult.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            {trackResult.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 block">Customer</span>
                            <span className="font-semibold text-slate-800">{trackResult.customer}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Carrier/Fleet</span>
                            <span className="font-semibold text-slate-800">{trackResult.carrier}</span>
                          </div>
                        </div>

                        {trackResult.origin && (
                          <div className="text-[11px]">
                            <span className="text-slate-400 block">Route</span>
                            <span className="font-semibold text-slate-800">
                              {trackResult.origin} → {trackResult.destination}
                            </span>
                          </div>
                        )}

                        {trackResult.location && (
                          <div className="text-[11px]">
                            <span className="text-slate-400 block">Storage Location</span>
                            <span className="font-mono font-bold text-emerald-700">
                              {trackResult.location} ({trackResult.warehouse})
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setCurrentRole('customer');
                            setActiveTab('customer-track');
                          }}
                          className="w-full mt-1 py-1.5 text-center text-xs font-bold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg bg-blue-50/50"
                        >
                          View Full Timeline on Map →
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-red-500 py-2">
                        No shipment or package found matching &quot;{trackInput}&quot;. Please verify the tracking reference.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. TWO SERVICE OPTIONS (SIDE BY SIDE) ================= */}
      <section id="services" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Warehouse + Shipping */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-7 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Warehouse + Shipping</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Secure storage, inventory management and global shipping — all in one solution. Flexible hourly and daily storage rates across Dar es Salaam and Zanzibar.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Book storage online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Real-time inventory tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Flexible hourly and daily rates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Request shipping directly from your stock</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setCurrentRole('customer');
                      setActiveTab('customer-bookings');
                    }}
                    className="px-5 py-3 bg-[#0a192f] hover:bg-[#132c4a] text-white font-bold text-xs rounded-lg transition flex items-center gap-2 shadow-xs"
                  >
                    <span>Book Warehouse Storage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Photographic Warehouse Image */}
              <div className="relative w-full md:w-5/12 min-h-[240px] md:min-h-auto">
                <Image
                  src="/assets/warehouse_forklift.jpg"
                  alt="Warehouse shelving and forklift"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Card 2: Shipping Only */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-7 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Shipping Only</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Fast, reliable shipping solutions for all your cargo needs. Intermodal highway routes connecting Dar es Salaam, Arusha, Mwanza, Kigali, and Nairobi.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Door-to-door delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Intermodal highway routes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Real-time tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Local, regional and international shipping</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setCurrentRole('admin');
                      setActiveTab('create-shipment');
                    }}
                    className="px-5 py-3 bg-[#0a192f] hover:bg-[#132c4a] text-white font-bold text-xs rounded-lg transition flex items-center gap-2 shadow-xs"
                  >
                    <span>Request a Shipment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Photographic Truck Image */}
              <div className="relative w-full md:w-5/12 min-h-[240px] md:min-h-auto">
                <Image
                  src="/assets/highway_truck_kili.jpg"
                  alt="Highway cargo truck in East Africa with Kilimanjaro in background"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. HOW IT WORKS (CONNECTED HORIZONTAL WORKFLOW) ================= */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Storage to Delivery – All Online
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A complete warehouse and shipping solution, connected in one platform.
            </p>
          </div>

          {/* 6 Connected Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            {/* Step 1: Book */}
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">1. Book</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Reserve warehouse space or request shipping online.
                </p>
              </div>
            </div>

            {/* Step 2: Receive & Store */}
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">2. Receive &amp; Store</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  We receive, verify and store your goods securely.
                </p>
              </div>
            </div>

            {/* Step 3: View Inventory */}
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">3. View Inventory</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Track your stock in real time from your dashboard.
                </p>
              </div>
            </div>

            {/* Step 4: Ship */}
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">4. Ship</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Assign items from your warehouse to a shipment.
                </p>
              </div>
            </div>

            {/* Step 5: Pay */}
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">5. Pay</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Pay storage fees and shipping costs online.
                </p>
              </div>
            </div>

            {/* Step 6: Track & Deliver */}
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">6. Track &amp; Deliver</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Follow your shipment until final delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. FOOTER & ROLE SHORTCUTS ================= */}
      <footer id="contact" className="bg-[#0a192f] text-slate-400 text-xs py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand Info */}
            <div className="space-y-4">
              <div className="relative h-9 w-44">
                <Image
                  src="/assets/aistudio/light_bd56867f.png"
                  alt="SWAHIVO Logistics OS"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Production-grade enterprise logistics management operating system for warehousing, shipping, inventory, QR tracking, fleet dispatch, driver telematics, and billing in Tanzania and East Africa.
              </p>
            </div>

            {/* Col 2: Services */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Solutions</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-white transition">Bonded Storage</a></li>
                <li><a href="#services" className="hover:text-white transition">Port Cargo Drayage</a></li>
                <li><a href="#services" className="hover:text-white transition">Cross-Border Freight</a></li>
                <li><a href="#services" className="hover:text-white transition">2D Warehouse Digital Twins</a></li>
                <li><a href="#services" className="hover:text-white transition">Verified QR Putaway</a></li>
              </ul>
            </div>

            {/* Col 3: Facilities & Hubs */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Major Hubs</h4>
              <ul className="space-y-2">
                <li>Dar es Salaam Port Hub (WH001)</li>
                <li>Zanzibar Free Zone Terminal (WH002)</li>
                <li>Arusha Northern Gateway (WH003)</li>
                <li>Mwanza Lake Victoria Inland (WH004)</li>
                <li>Kigali &amp; Nairobi Transit Depots</li>
              </ul>
            </div>

            {/* Col 4: Platform Launchers */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Direct Portals</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentRole('admin');
                    setActiveTab('dashboard');
                  }}
                  className="block w-full text-left py-1.5 px-3 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition font-medium text-xs"
                >
                  Admin Master Dashboard →
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('warehouse_manager');
                    setActiveTab('warehouse-overview');
                  }}
                  className="block w-full text-left py-1.5 px-3 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition font-medium text-xs"
                >
                  Warehouse Manager Dashboard →
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('customer');
                    setActiveTab('customer-overview');
                  }}
                  className="block w-full text-left py-1.5 px-3 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition font-medium text-xs"
                >
                  Customer Operations Portal →
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('driver');
                    setActiveTab('driver-dashboard');
                  }}
                  className="block w-full text-left py-1.5 px-3 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition font-medium text-xs"
                >
                  Driver Telematics &amp; POD Portal →
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} SWAHIVO Logistics OS. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Dar es Salaam Port Hub, Kurasini Industrial Area</span>
              <span>•</span>
              <span>Tanzania</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= ROLE SELECTOR MODAL (Sign In / Get Started) ================= */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Select Portal Access</h3>
                  <p className="text-[11px] text-slate-500">Choose your operational role</p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  role: 'admin',
                  tab: 'dashboard',
                  title: 'Admin Operations Dashboard',
                  desc: 'Company-wide fleet, warehouses, revenue, shipments & CRM',
                  color: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50/50',
                },
                {
                  role: 'warehouse_manager',
                  tab: 'warehouse-overview',
                  title: 'Warehouse Manager Portal',
                  desc: '2D Floor map, rack elevations, QR scanning, receiving & putaway',
                  color: 'border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50',
                },
                {
                  role: 'customer',
                  tab: 'customer-overview',
                  title: 'Customer Self-Service Portal',
                  desc: 'Book warehouse storage, dispatch stock, track freight & billing',
                  color: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50',
                },
                {
                  role: 'driver',
                  tab: 'driver-dashboard',
                  title: 'Driver Telematics & POD Portal',
                  desc: 'Pickup verification, transit checkpoints & electronic proof of delivery',
                  color: 'border-amber-200 hover:border-amber-500 hover:bg-amber-50/50',
                },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    setCurrentRole(item.role as any);
                    setActiveTab(item.tab);
                    setShowRoleModal(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition ${item.color} flex items-center justify-between group`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
