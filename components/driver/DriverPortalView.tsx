'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MessageSquare,
  Package,
  Boxes,
  PlusCircle,
  History,
  QrCode,
  ShieldCheck,
  Check,
  X,
  User,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';
import { RouteMap } from '@/components/common/RouteMap';

interface DriverPortalViewProps {
  initialTab?: string;
}

export default function DriverPortalView({ initialTab = 'driver-dashboard' }: DriverPortalViewProps) {
  const { shipments, confirmDelivery, updateShipmentStatus } = useApp();

  const [internalView, setInternalView] = useState<string | null>(null);
  const currentView = internalView || initialTab;
  const setCurrentView = (v: string) => {
    setInternalView(v);
  };

  // Assignment carousel
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState(0);

  // Status filter for assignments table
  const [assignmentFilterTab, setAssignmentFilterTab] = useState<'All' | 'Pickups' | 'Deliveries' | 'InProgress' | 'Completed'>('All');

  // e-POD form state
  const [recipientName, setRecipientName] = useState('Juma M. (Consignee)');
  const [podNotes, setPodNotes] = useState('Delivered directly to site. Cartons verified undamaged.');
  const [podSuccess, setPodSuccess] = useState(false);
  const [signatureSigned, setSignatureSigned] = useState(true);
  const [photoUploaded, setPhotoUploaded] = useState(true);

  // Scanner state
  const [scannedCode, setScannedCode] = useState('');
  const [scannerResultMsg, setScannerResultMsg] = useState('');

  // Sample assignments matching reference
  const assignmentsData = [
    {
      id: 'shp-1',
      trackingNo: 'TZL-20261025-001',
      type: 'Pickup',
      typeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      originDest: 'DAR-WH01 &rarr; Mkuranga',
      location: 'Mkuranga Town',
      locationDesc: 'Mkuranga, Pwani Region',
      cargo: '8 cartons (120 kg)',
      cargoDesc: "Clothing - Men's shirts",
      schedule: '09:00 AM',
      scheduleWindow: 'Today, 09:00 AM – 10:00 AM',
      customer: 'Juma Traders',
      phone: '+255 712 345 678',
      status: 'Pending',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      action: 'Start',
    },
    {
      id: 'shp-2',
      trackingNo: 'TZL-20261025-002',
      type: 'Delivery',
      typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      originDest: 'Dar es Salaam &rarr; Zanzibar',
      location: 'Zanzibar Port Ferry Terminal',
      locationDesc: 'Malindi, Stone Town',
      cargo: '12 cartons',
      cargoDesc: 'General Merchandise',
      schedule: '11:30 AM',
      scheduleWindow: 'Today, 11:30 AM – 12:30 PM',
      customer: 'Zanzibar Fashion House',
      phone: '+255 777 444 333',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      action: 'Track',
    },
    {
      id: 'shp-3',
      trackingNo: 'TZL-20261025-003',
      type: 'Pickup',
      typeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      originDest: 'Dar es Salaam &rarr; Bagamoyo',
      location: 'Bagamoyo Fish Market Hub',
      locationDesc: 'Bagamoyo Road',
      cargo: '6 cartons',
      cargoDesc: 'Processed Food Items',
      schedule: '01:00 PM',
      scheduleWindow: 'Today, 01:00 PM – 02:00 PM',
      customer: 'Bagamoyo Fresh Foods',
      phone: '+255 784 112 233',
      status: 'Upcoming',
      statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
      action: 'View',
    },
    {
      id: 'shp-4',
      trackingNo: 'TZL-20261025-004',
      type: 'Delivery',
      typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      originDest: 'Morogoro &rarr; Dar es Salaam',
      location: 'Morogoro Central Depot',
      locationDesc: 'Old Dar Road, Morogoro',
      cargo: '10 cartons',
      cargoDesc: 'Automotive Parts',
      schedule: '03:30 PM',
      scheduleWindow: 'Today, 03:30 PM – 04:30 PM',
      customer: 'Morogoro Auto Supplies',
      phone: '+255 754 889 900',
      status: 'Upcoming',
      statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
      action: 'View',
    },
    {
      id: 'shp-5',
      trackingNo: 'TZL-20261025-005',
      type: 'Delivery',
      typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      originDest: 'Arusha &rarr; Nairobi',
      location: 'Arusha Clock Tower Depot',
      locationDesc: 'Arusha Town',
      cargo: '15 cartons',
      cargoDesc: 'Export Coffee Samples',
      schedule: '07:00 PM',
      scheduleWindow: 'Today, 07:00 PM – 08:00 PM',
      customer: 'Kilimanjaro Traders',
      phone: '+255 768 223 344',
      status: 'Upcoming',
      statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
      action: 'View',
    },
    {
      id: 'shp-6',
      trackingNo: 'TZL-20261025-006',
      type: 'Delivery',
      typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      originDest: 'Zanzibar &rarr; Dar es Salaam',
      location: 'Kurasini Port Terminal',
      locationDesc: 'Gate 4, Dar es Salaam',
      cargo: '5 cartons',
      cargoDesc: 'Spices & Essential Oils',
      schedule: '06:00 PM',
      scheduleWindow: 'Today, 06:00 PM – 07:00 PM',
      customer: 'Zanzibar Spice Co.',
      phone: '+255 777 999 111',
      status: 'Pending',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      action: 'View',
    },
  ];

  const currentAssignment = assignmentsData[currentAssignmentIndex] || assignmentsData[0];

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode.trim()) return;
    const found = assignmentsData.find(
      (a) =>
        a.trackingNo.toLowerCase().includes(scannedCode.trim().toLowerCase()) ||
        scannedCode.trim().toLowerCase().includes(a.trackingNo.toLowerCase())
    );
    if (found) {
      setScannerResultMsg(`Package Barcode ${scannedCode.toUpperCase()} verified! Linked to Task ${found.trackingNo} (${found.customer}).`);
    } else {
      setScannerResultMsg(`Scanned: ${scannedCode.toUpperCase()} — Validated in SWAHIVO Central Logistics registry.`);
    }
  };

  const handleConfirmDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmDelivery(
      currentAssignment.id,
      recipientName,
      'https://swahivo.logistics/signatures/sig-juma.png',
      undefined,
      podNotes
    );
    setPodSuccess(true);
    setTimeout(() => setPodSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* ================= GREETING HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Good morning, Ali!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here are your assigned pickups and deliveries for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Wed, Oct 25, 2026</span>
          </div>

          <button
            onClick={() => alert('Starting GPS turn-by-turn navigation along Highway A104 corridor...')}
            className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition"
          >
            <Navigation className="h-4 w-4" />
            <span>Start Navigation</span>
          </button>
        </div>
      </div>

      {podSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Electronic Proof of Delivery confirmed and synced! Recipient: {recipientName}. Consignment {currentAssignment.trackingNo} recorded as DELIVERED.
          </span>
        </div>
      )}

      {/* ================= 6 KPI CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* My Assignments */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Truck className="h-4 w-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">6</div>
          <div className="text-xs font-bold text-slate-800">My Assignments</div>
          <div className="text-[10px] text-slate-400">3 pickups • 3 deliveries</div>
        </div>

        {/* Scheduled Today */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">3</div>
          <div className="text-xs font-bold text-slate-800">Scheduled Today</div>
          <div className="text-[10px] text-slate-400">Next: 10:00 AM</div>
        </div>

        {/* In Transit */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Package className="h-4 w-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">2</div>
          <div className="text-xs font-bold text-slate-800">In Transit</div>
          <div className="text-[10px] text-slate-400">On the road</div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">12</div>
          <div className="text-xs font-bold text-slate-800">Completed</div>
          <div className="text-[10px] text-slate-400">This week</div>
        </div>

        {/* Issues */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">1</div>
          <div className="text-xs font-bold text-slate-800">Issues</div>
          <div className="text-[10px] text-red-500 font-semibold">Needs attention</div>
        </div>

        {/* Total Distance */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <Navigation className="h-4 w-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">420 km</div>
          <div className="text-xs font-bold text-slate-800">Total Distance</div>
          <div className="text-[10px] text-slate-400">Today&apos;s route</div>
        </div>
      </div>

      {/* ================= UPPER SECTION: ROUTE MAP + CURRENT ASSIGNMENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Today's Route + Stops */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Today&apos;s Route</h3>
            <button
              onClick={() => alert('Full map expanded to full screen...')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View Full Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Interactive Route Map */}
            <div className="md:col-span-7 p-3">
              <RouteMap heightClass="h-80" />
            </div>

            {/* Route Stops List */}
            <div className="md:col-span-5 p-4 border-t md:border-t-0 md:border-l border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Route Stops (5)</h4>
              <div className="space-y-3">
                {[
                  {
                    num: '●',
                    name: 'Dar es Salaam',
                    time: 'Start • 07:30 AM',
                    status: 'Departed',
                    color: 'bg-emerald-50 text-emerald-700',
                  },
                  {
                    num: '1',
                    name: 'Mkuranga',
                    time: 'Pickup • 09:00 AM',
                    status: 'Pending',
                    color: 'bg-blue-50 text-blue-700',
                  },
                  {
                    num: '2',
                    name: 'Zanzibar (Ferry)',
                    time: 'Delivery • 11:30 AM',
                    status: 'In Progress',
                    color: 'bg-amber-50 text-amber-700',
                  },
                  {
                    num: '3',
                    name: 'Bagamoyo',
                    time: 'Pickup • 01:00 PM',
                    status: 'Upcoming',
                    color: 'bg-slate-100 text-slate-700',
                  },
                  {
                    num: '4',
                    name: 'Morogoro',
                    time: 'Delivery • 03:30 PM',
                    status: 'Upcoming',
                    color: 'bg-slate-100 text-slate-700',
                  },
                  {
                    num: '5',
                    name: 'Arusha',
                    time: 'Delivery • 07:00 PM',
                    status: 'Upcoming',
                    color: 'bg-slate-100 text-slate-700',
                  },
                ].map((stop, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {stop.num}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{stop.name}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{stop.time}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${stop.color}`}>
                      {stop.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Current Assignment Card */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Current Assignment</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <button
                onClick={() => setCurrentAssignmentIndex((prev) => (prev > 0 ? prev - 1 : assignmentsData.length - 1))}
                className="p-1 hover:text-slate-800 rounded border border-slate-200"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>{currentAssignmentIndex + 1} of {assignmentsData.length}</span>
              <button
                onClick={() => setCurrentAssignmentIndex((prev) => (prev < assignmentsData.length - 1 ? prev + 1 : 0))}
                className="p-1 hover:text-slate-800 rounded border border-slate-200"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  {currentAssignment.type}
                </span>
                <span className="font-mono font-bold text-slate-900">{currentAssignment.trackingNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Calling customer ${currentAssignment.customer} at ${currentAssignment.phone}`)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                  title="Call"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                </button>
                <button
                  onClick={() => alert(`Sending SMS dispatch update to ${currentAssignment.customer}`)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                  title="Message"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            </div>

            {/* Location & Details */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pickup Location</span>
                  <span className="font-bold text-slate-900 block">{currentAssignment.location}</span>
                  <span className="text-[11px] text-slate-500">{currentAssignment.locationDesc}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Scheduled Time</span>
                  <span className="font-bold text-slate-900">{currentAssignment.scheduleWindow}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Boxes className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cargo Details</span>
                  <span className="font-bold text-slate-900 block">{currentAssignment.cargo}</span>
                  <span className="text-[11px] text-slate-500">{currentAssignment.cargoDesc}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Customer</span>
                  <span className="font-bold text-slate-900 block">{currentAssignment.customer}</span>
                  <span className="text-[11px] text-slate-500">{currentAssignment.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  updateShipmentStatus(currentAssignment.id, 'Picked Up', 'Cargo picked up by driver Ali Hassan');
                  alert(`Pickup confirmed for ${currentAssignment.trackingNo}! Status updated to Picked Up.`);
                }}
                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Start Pickup</span>
              </button>
              <button
                onClick={() => setCurrentView('driver-confirmation')}
                className="py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LOWER SECTION: MY ASSIGNMENTS + TIMELINE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: My Assignments Table with Tabs */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">My Assignments</h3>
            <button
              onClick={() => setCurrentView('driver-assignments')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View All
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2.5 border-b border-slate-100 flex flex-wrap gap-2 text-xs">
            {[
              { id: 'All', label: 'All (6)' },
              { id: 'Pickups', label: 'Pickups (3)' },
              { id: 'Deliveries', label: 'Deliveries (3)' },
              { id: 'InProgress', label: 'In Progress (2)' },
              { id: 'Completed', label: 'Completed (12)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAssignmentFilterTab(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  assignmentFilterTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                  <th className="py-2.5 px-4">Tracking No.</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Origin &rarr; Destination</th>
                  <th className="py-2.5 px-4">Cargo</th>
                  <th className="py-2.5 px-4">Schedule</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignmentsData
                  .filter((a) => {
                    if (assignmentFilterTab === 'Pickups' && a.type !== 'Pickup') return false;
                    if (assignmentFilterTab === 'Deliveries' && a.type !== 'Delivery') return false;
                    if (assignmentFilterTab === 'InProgress' && a.status !== 'In Progress') return false;
                    return true;
                  })
                  .map((row) => (
                    <tr key={row.trackingNo} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{row.trackingNo}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.typeColor}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700" dangerouslySetInnerHTML={{ __html: row.originDest }} />
                      <td className="py-3 px-4 font-medium text-slate-600">{row.cargo}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{row.schedule}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              if (row.type === 'Delivery') {
                                setCurrentView('driver-confirmation');
                              } else {
                                updateShipmentStatus(row.id, 'Picked Up', 'Verified by driver');
                                alert(`Task ${row.trackingNo} marked started.`);
                              }
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          >
                            {row.action}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Shipment Timeline */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Shipment Timeline</h3>
            <button
              onClick={() => alert('Full shipment audit log opened')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {[
              {
                time: '07:15 AM',
                title: 'Assigned to you',
                desc: 'Dispatch team',
                done: true,
              },
              {
                time: '07:30 AM',
                title: 'Departed from warehouse',
                desc: 'Dar es Salaam (DAR-WH01)',
                done: true,
              },
              {
                time: '08:45 AM',
                title: 'On the way to pickup',
                desc: 'ETA 09:00 AM',
                done: true,
              },
              {
                time: '09:00 AM',
                title: 'Pick up cargo',
                desc: 'Mkuranga Town',
                done: false,
              },
              {
                time: '11:30 AM',
                title: 'Deliver to Zanzibar',
                desc: 'Zanzibar Port Ferry Terminal',
                done: false,
              },
              {
                time: 'Completed',
                title: 'Delivery confirmation',
                desc: 'Proof of delivery (photo + signature)',
                done: false,
              },
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold ${
                    step.done ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  {step.done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{step.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CHILD VIEW SECTION: ELECTRONIC PROOF OF DELIVERY (e-POD) ================= */}
      {currentView === 'driver-confirmation' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Electronic Proof of Delivery (e-POD)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-blue-600 px-2.5 py-1 rounded bg-blue-50 border border-blue-200">
              {currentAssignment.trackingNo}
            </span>
          </div>

          <form onSubmit={handleConfirmDeliverySubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Contact / ID</label>
                <input
                  type="text"
                  defaultValue="NIDA: 19850123-11101-00001-21"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Handover Notes</label>
              <textarea
                value={podNotes}
                onChange={(e) => setPodNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-medium"
              />
            </div>

            {/* Signature & Photo Upload Pads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Customer Digital Signature</span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Captured
                  </span>
                </div>
                <div className="h-28 rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400">
                  <div className="text-center font-serif italic text-2xl text-slate-700 select-none">
                    Juma M. Traders
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Delivery Photo Evidence</span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> Photo Attached
                  </span>
                </div>
                <div className="h-28 rounded-lg border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-500">
                  <Camera className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[11px] font-semibold">Package delivered to warehouse gate</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('driver-dashboard')}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
              >
                Back to Dashboard
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
              >
                Complete Delivery &amp; Sync POD
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= CHILD VIEW SECTION: PACKAGE SCANNER ================= */}
      {currentView === 'driver-scan' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Driver QR &amp; Barcode Scanner
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('driver-dashboard')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              &larr; Back
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-60 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
              <div className="w-44 h-44 border-2 border-blue-500 rounded-xl relative flex items-center justify-center">
                <div className="absolute inset-x-2 h-0.5 bg-blue-400 animate-pulse shadow-sm shadow-blue-400" />
                <Scan className="w-12 h-12 text-slate-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-3">
                Align consignment QR code or carton barcode within frame
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Manual Barcode Input</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Type or scan using handheld Bluetooth / Zebra device
                </p>
              </div>

              <form onSubmit={handleManualScanSubmit} className="space-y-2">
                <input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  placeholder="e.g. TZL-20261025-001 or PKG-1042"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  Verify Barcode
                </button>
              </form>

              {scannerResultMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
                  {scannerResultMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
