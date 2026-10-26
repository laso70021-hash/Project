'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Package,
  Boxes,
  Truck,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  FileText,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  QrCode,
  Download,
  Building,
  ChevronRight,
  ChevronDown,
  Warehouse as WarehouseIcon,
  Send,
  MoreHorizontal,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  User,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';
import { RouteMap } from '@/components/common/RouteMap';

interface CustomerPortalViewProps {
  initialTab?: string;
}

// Sparklines SVG component
function Sparkline({ points, color = '#2563eb' }: { points: number[]; color?: string }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const height = 24;
  const width = 80;
  const formatted = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={formatted} />
    </svg>
  );
}

export default function CustomerPortalView({ initialTab = 'customer-overview' }: CustomerPortalViewProps) {
  const {
    customers,
    packages,
    shipments,
    bookings,
    invoices,
    createStorageBooking,
    createShipment,
    setActiveTab,
  } = useApp();

  // Active customer: Juma M. Traders (CUS-0001)
  const activeCustomer = customers.find((c) => c.customerCode === 'CUS-0001') || customers[0];

  const [internalView, setInternalView] = useState<string | null>(null);
  const currentView = internalView || initialTab;
  const setCurrentView = (v: string) => {
    setInternalView(v);
    setActiveTab(v);
  };

  // Tracking widget state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedShipment, setTrackedShipment] = useState<any>(shipments[0]);
  const [trackNotFound, setTrackNotFound] = useState(false);

  // Storage booking modal & state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingWarehouse, setBookingWarehouse] = useState('WH001 - Main Warehouse (Kurasini Port)');
  const [bookingCartons, setBookingCartons] = useState(40);
  const [bookingDays, setBookingDays] = useState(30);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Dispatch modal & state
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any>(null);
  const [dispatchQty, setDispatchQty] = useState(10);
  const [dispatchDestination, setDispatchDestination] = useState('Zanzibar Terminal, Stone Town');
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState('');

  // Shipments filter tab in overview
  const [shipmentsFilterTab, setShipmentsFilterTab] = useState<'All' | 'Warehouse' | 'ShippingOnly' | 'InTransit' | 'Delivered'>('All');

  // Customer filtered data
  const myPackages = packages.filter(
    (p) => p.customerId === activeCustomer.id || p.customerName === activeCustomer.name
  );
  const myShipments = shipments.filter(
    (s) => s.customerId === activeCustomer.id || s.customerName === activeCustomer.name
  );
  const myBookings = bookings.filter(
    (b) => b.customerId === activeCustomer.id || b.customerName === activeCustomer.name
  );
  const myInvoices = invoices.filter(
    (i) => i.customerId === activeCustomer.id || i.customerName === activeCustomer.name
  );

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    const found = shipments.find(
      (s) =>
        s.trackingNumber.toLowerCase() === trackQuery.trim().toLowerCase() ||
        s.trackingNumber.toLowerCase().includes(trackQuery.trim().toLowerCase())
    );
    if (found) {
      setTrackedShipment(found);
      setTrackNotFound(false);
    } else {
      setTrackNotFound(true);
    }
  };

  const handleCreateStorageBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const spaceM2 = Math.ceil(bookingCartons / 10);
    createStorageBooking({
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      warehouseId: bookingWarehouse.startsWith('WH002') ? 'WH002' : 'WH001',
      warehouseName: bookingWarehouse,
      reservedSpaceSqM: spaceM2,
      monthlyRateTzs: spaceM2 * 25000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + bookingDays * 86400000).toISOString().split('T')[0],
      status: 'Active',
      itemsStoredCount: bookingCartons,
    });
    setBookingSuccessMsg(`Space reserved for ${bookingCartons} cartons (${spaceM2} m²) in ${bookingWarehouse}!`);
    setShowBookingModal(false);
    setTimeout(() => setBookingSuccessMsg(''), 5000);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventoryItem) return;

    // Create a real shipment linked to this inventory
    createShipment({
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      origin: 'WH001 - Kurasini Port Warehouse, Dar es Salaam',
      destination: dispatchDestination,
      serviceType: 'Storage + Shipping',
      status: 'In Transit',
      weightKg: dispatchQty * 3,
      items: [
        {
          id: String(Date.now()),
          name: selectedInventoryItem.name || selectedInventoryItem.itemName || 'Stored Goods',
          quantity: dispatchQty,
          weightKg: dispatchQty * 3,
          valueTzs: dispatchQty * 50000,
        },
      ],
    });

    setDispatchSuccessMsg(
      `Dispatch request created! ${dispatchQty} units of ${selectedInventoryItem.itemName || selectedInventoryItem.productName} scheduled for delivery to ${dispatchDestination}.`
    );
    setShowDispatchModal(false);
    setSelectedInventoryItem(null);
    setTimeout(() => setDispatchSuccessMsg(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* ================= GREETING HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, Juma!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here&apos;s an overview of your warehouse storage and shipping activities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition"
          >
            <Boxes className="h-4 w-4" />
            <span>Book Warehouse Storage</span>
          </button>
          <button
            onClick={() => setActiveTab('create-shipment')}
            className="flex items-center gap-2 rounded-lg border border-blue-600 bg-white hover:bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-600 shadow-2xs transition"
          >
            <Truck className="h-4 w-4 text-blue-600" />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      {bookingSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{bookingSuccessMsg}</span>
        </div>
      )}

      {dispatchSuccessMsg && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{dispatchSuccessMsg}</span>
        </div>
      )}

      {/* ================= 6 KPI CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Active Storage */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Boxes className="h-4 w-4" />
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 12%
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">Active Storage</div>
            <div className="text-xl font-bold text-slate-900 leading-tight">32</div>
            <div className="text-[10px] text-slate-400">cartons / pallets</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-slate-400">vs last month</span>
            <Sparkline points={[20, 24, 22, 28, 26, 32]} color="#10b981" />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Package className="h-4 w-4" />
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 25%
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">Total Bookings</div>
            <div className="text-xl font-bold text-slate-900 leading-tight">5</div>
            <div className="text-[10px] text-slate-400">bookings</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-slate-400">vs last month</span>
            <Sparkline points={[3, 3, 4, 3, 4, 5]} color="#2563eb" />
          </div>
        </div>

        {/* Active Shipments */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <Truck className="h-4 w-4" />
              </div>
              <span className="flex items-center text-[10px] font-bold text-orange-600">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 50%
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">Active Shipments</div>
            <div className="text-xl font-bold text-slate-900 leading-tight">3</div>
            <div className="text-[10px] text-slate-400">in transit</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-slate-400">vs last month</span>
            <Sparkline points={[1, 2, 1, 2, 2, 3]} color="#f97316" />
          </div>
        </div>

        {/* Delivered */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 33%
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">Delivered</div>
            <div className="text-xl font-bold text-slate-900 leading-tight">12</div>
            <div className="text-[10px] text-slate-400">shipments</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-slate-400">vs last month</span>
            <Sparkline points={[8, 9, 9, 10, 11, 12]} color="#10b981" />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <FileText className="h-4 w-4" />
              </div>
              <span className="flex items-center text-[10px] font-bold text-slate-400">
                0%
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">Pending Payments</div>
            <div className="text-xl font-bold text-slate-900 leading-tight">2</div>
            <div className="text-[10px] text-slate-400">invoices</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-slate-400">no change</span>
            <Sparkline points={[2, 3, 2, 3, 2, 2]} color="#8b5cf6" />
          </div>
        </div>

        {/* Total Spent (TZS) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 18%
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">Total Spent (TZS)</div>
            <div className="text-xl font-bold text-slate-900 leading-tight">4.8M</div>
            <div className="text-[10px] text-slate-400">this month</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-slate-400">vs last month</span>
            <Sparkline points={[3.2, 3.6, 4.0, 3.8, 4.4, 4.8]} color="#f59e0b" />
          </div>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN WORKSPACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 cols): My Inventory + My Shipments + Recent Invoices */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: My Warehouse Inventory */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Boxes className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">My Warehouse Inventory</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                  <span>Dar es Salaam (DAR-WH01)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <button
                  onClick={() => setCurrentView('customer-inventory')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                    <th className="py-2.5 px-4">Item</th>
                    <th className="py-2.5 px-4 text-center">Available</th>
                    <th className="py-2.5 px-4 text-center">Reserved</th>
                    <th className="py-2.5 px-4">Location</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      id: 'pkg-1',
                      name: "Men's shirts",
                      pkg: 'Cartons',
                      available: 18,
                      reserved: 4,
                      location: 'A-01',
                      status: 'In Storage',
                    },
                    {
                      id: 'pkg-2',
                      name: "Women's dresses",
                      pkg: 'Cartons',
                      available: 10,
                      reserved: 2,
                      location: 'A-02',
                      status: 'In Storage',
                    },
                    {
                      id: 'pkg-3',
                      name: 'Shoes',
                      pkg: 'Cartons',
                      available: 4,
                      reserved: 0,
                      location: 'B-04',
                      status: 'In Storage',
                    },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{row.name}</span>
                            <span className="text-[10px] text-slate-400">{row.pkg}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{row.available}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{row.reserved}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {row.location}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedInventoryItem(row);
                              setShowDispatchModal(true);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          >
                            <Send className="w-3 h-3 text-blue-600" />
                            <span>Request Dispatch</span>
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2: My Shipments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">My Shipments</h3>
              </div>

              <button
                onClick={() => setCurrentView('customer-shipments')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2.5 border-b border-slate-100 flex flex-wrap gap-2 text-xs">
              {[
                { id: 'All', label: 'All Shipments' },
                { id: 'Warehouse', label: 'From Warehouse' },
                { id: 'ShippingOnly', label: 'Shipping Only' },
                { id: 'InTransit', label: 'In Transit' },
                { id: 'Delivered', label: 'Delivered' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setShipmentsFilterTab(tab.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    shipmentsFilterTab === tab.id
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
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Est. Delivery</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      no: 'TZL-20261025-001',
                      type: 'From Warehouse',
                      typeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                      route: 'Dar es Salaam &rarr; Zanzibar',
                      status: 'In Transit',
                      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
                      date: 'Oct 26, 2026',
                      btn: 'Track',
                    },
                    {
                      no: 'TZL-20261022-015',
                      type: 'Shipping Only',
                      typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      route: 'Dar es Salaam &rarr; Arusha',
                      status: 'Out for Delivery',
                      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
                      date: 'Oct 24, 2026',
                      btn: 'Track',
                    },
                    {
                      no: 'TZL-20261018-010',
                      type: 'From Warehouse',
                      typeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                      route: 'Dar es Salaam &rarr; Nairobi',
                      status: 'Delivered',
                      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      date: 'Oct 18, 2026',
                      btn: 'View',
                    },
                    {
                      no: 'TZL-20261012-008',
                      type: 'Shipping Only',
                      typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      route: 'Arusha &rarr; Kigali',
                      status: 'Delivered',
                      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      date: 'Oct 13, 2026',
                      btn: 'View',
                    },
                    {
                      no: 'TZL-20261005-003',
                      type: 'From Warehouse',
                      typeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                      route: 'Dar es Salaam &rarr; Mwanza',
                      status: 'Cancelled',
                      statusColor: 'bg-red-50 text-red-700 border-red-200',
                      date: 'Oct 8, 2026',
                      btn: 'View',
                    },
                  ]
                    .filter((row) => {
                      if (shipmentsFilterTab === 'Warehouse' && row.type !== 'From Warehouse') return false;
                      if (shipmentsFilterTab === 'ShippingOnly' && row.type !== 'Shipping Only') return false;
                      if (shipmentsFilterTab === 'InTransit' && row.status !== 'In Transit' && row.status !== 'Out for Delivery') return false;
                      if (shipmentsFilterTab === 'Delivered' && row.status !== 'Delivered') return false;
                      return true;
                    })
                    .map((row) => (
                      <tr key={row.no} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">{row.no}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${row.typeColor}`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700" dangerouslySetInnerHTML={{ __html: row.route }} />
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{row.date}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setTrackQuery(row.no);
                                const found = shipments.find((s) => s.trackingNumber === row.no);
                                if (found) setTrackedShipment(found);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                            >
                              {row.btn}
                            </button>
                            <button className="text-slate-400 hover:text-slate-600 p-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 3: Recent Invoices */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Recent Invoices</h3>
              </div>
              <button
                onClick={() => setCurrentView('customer-invoices')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                    <th className="py-2.5 px-4">Invoice No.</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Amount (TZS)</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      no: 'INV-2026-0783',
                      type: 'Storage',
                      amount: '450,000',
                      status: 'Unpaid',
                      statusColor: 'bg-red-50 text-red-700 border-red-200',
                      due: 'Oct 28, 2026',
                      btn: 'Pay Now',
                    },
                    {
                      no: 'INV-2026-0771',
                      type: 'Shipping',
                      amount: '280,000',
                      status: 'Paid',
                      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      due: 'Oct 20, 2026',
                      btn: 'View',
                    },
                    {
                      no: 'INV-2026-0745',
                      type: 'Storage',
                      amount: '600,000',
                      status: 'Partially Paid',
                      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
                      due: 'Oct 15, 2026',
                      btn: 'Pay Now',
                    },
                    {
                      no: 'INV-2026-0712',
                      type: 'Shipping',
                      amount: '320,000',
                      status: 'Paid',
                      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      due: 'Oct 5, 2026',
                      btn: 'View',
                    },
                  ].map((inv) => (
                    <tr key={inv.no} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{inv.no}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{inv.type}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{inv.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${inv.statusColor}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{inv.due}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => alert(`Invoice ${inv.no} view details and payment gateway opened.`)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          >
                            {inv.btn}
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Storage Bookings + Track Your Shipment + Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 4: Storage Bookings */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Storage Bookings</h3>
              </div>
              <button
                onClick={() => setCurrentView('customer-bookings')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                {
                  id: 'WHB-2026-0045',
                  loc: 'Dar es Salaam',
                  cartons: '40 cartons',
                  date: 'Oct 20, 2026',
                  status: 'Received',
                  statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                },
                {
                  id: 'WHB-2026-0042',
                  loc: 'Zanzibar',
                  cartons: '15 cartons',
                  date: 'Oct 15, 2026',
                  status: 'In Transit',
                  statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
                },
                {
                  id: 'WHB-2026-0038',
                  loc: 'Dar es Salaam',
                  cartons: '25 cartons',
                  date: 'Oct 10, 2026',
                  status: 'In Storage',
                  statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                },
                {
                  id: 'WHB-2026-0031',
                  loc: 'Dar es Salaam',
                  cartons: '60 cartons',
                  date: 'Oct 5, 2026',
                  status: 'Completed',
                  statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
                },
              ].map((b) => (
                <div key={b.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                      <WarehouseIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-600">{b.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${b.statusColor}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{b.loc}</span>
                        <span>•</span>
                        <span>{b.cartons}</span>
                        <span>•</span>
                        <span>{b.date}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Track Your Shipment with Interactive Route Map */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Track Your Shipment</h3>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="Enter tracking number (e.g. TZL-20261025-001)"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Track
                </button>
              </form>

              {trackNotFound && (
                <div className="text-[11px] text-red-500 font-semibold">
                  Tracking number not found. Try TZL-20261025-001.
                </div>
              )}

              {/* Geographic Route Map */}
              <div className="relative rounded-lg overflow-hidden border border-slate-200">
                <RouteMap heightClass="h-52" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-[10px] font-bold text-slate-800 shadow-2xs border border-slate-200/80">
                  {trackedShipment?.trackingNumber || 'TZL-20261025-001'} • In Transit
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              </div>
              <button
                onClick={() => alert('Recent activity log viewer opened')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              {[
                {
                  title: '8 cartons dispatched from DAR-WH01',
                  sub: 'To Zanzibar (TZL-20261025-001)',
                  time: '2 hours ago',
                  icon: Boxes,
                  color: 'bg-emerald-50 text-emerald-600',
                },
                {
                  title: 'Driver Ali Hassan picked up your shipment',
                  sub: 'TZL-20261022-015',
                  time: '5 hours ago',
                  icon: Truck,
                  color: 'bg-blue-50 text-blue-600',
                },
                {
                  title: 'Storage booking WHB-2026-0045 received',
                  sub: 'Dar es Salaam (38/40 cartons verified)',
                  time: '1 day ago',
                  icon: WarehouseIcon,
                  color: 'bg-purple-50 text-purple-600',
                },
                {
                  title: 'Invoice INV-2026-0783 created',
                  sub: 'TZS 450,000 for storage period',
                  time: '1 day ago',
                  icon: FileText,
                  color: 'bg-amber-50 text-amber-600',
                },
                {
                  title: 'Payment of TZS 280,000 confirmed',
                  sub: 'INV-2026-0771 marked as Paid',
                  time: '3 days ago',
                  icon: CheckCircle2,
                  color: 'bg-emerald-50 text-emerald-600',
                },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${act.color} flex items-center justify-center shrink-0`}>
                    <act.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-snug">{act.title}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{act.sub}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: STORAGE BOOKING ================= */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <WarehouseIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">New Warehouse Storage Booking</h3>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStorageBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Facility</label>
                <select
                  value={bookingWarehouse}
                  onChange={(e) => setBookingWarehouse(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="WH001 - Main Warehouse (Kurasini Port)">WH001 - Main Warehouse (Kurasini Port, Dar es Salaam)</option>
                  <option value="WH002 - Island Facility (Zanzibar Free Zone)">WH002 - Island Facility (Zanzibar Free Zone)</option>
                  <option value="WH003 - Northern Hub (Arusha Industrial)">WH003 - Northern Hub (Arusha Industrial Area)</option>
                  <option value="WH004 - Lake Hub (Mwanza Port Terminal)">WH004 - Lake Hub (Mwanza Port Terminal)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Cartons / Units</label>
                  <input
                    type="number"
                    value={bookingCartons}
                    onChange={(e) => setBookingCartons(Number(e.target.value))}
                    min={1}
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Storage Duration (Days)</label>
                  <input
                    type="number"
                    value={bookingDays}
                    onChange={(e) => setBookingDays(Number(e.target.value))}
                    min={1}
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-slate-700">
                <div className="flex justify-between font-medium">
                  <span>Required Floor Footprint:</span>
                  <span className="font-bold">{Math.ceil(bookingCartons / 10)} m²</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Standard Rate (TZS 25,000/m²):</span>
                  <span className="font-bold text-blue-700">
                    TZS {(Math.ceil(bookingCartons / 10) * 25000).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Confirm &amp; Reserve Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: REQUEST DISPATCH ================= */}
      {showDispatchModal && selectedInventoryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Request Dispatch from Warehouse
                </h3>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Selected Item</span>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedInventoryItem.name || selectedInventoryItem.itemName}
                </div>
                <div className="text-slate-500 text-xs">
                  Available in WH001 (Loc: {selectedInventoryItem.location}):{' '}
                  <span className="font-bold text-emerald-600">{selectedInventoryItem.available} cartons</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dispatch Quantity</label>
                <input
                  type="number"
                  value={dispatchQty}
                  onChange={(e) => setDispatchQty(Math.min(selectedInventoryItem.available, Number(e.target.value)))}
                  max={selectedInventoryItem.available}
                  min={1}
                  className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Destination</label>
                <input
                  type="text"
                  value={dispatchDestination}
                  onChange={(e) => setDispatchDestination(e.target.value)}
                  placeholder="e.g. Stone Town Ferry Terminal, Zanzibar"
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px]">
                Upon submission, a warehouse picking order will automatically be routed to WH001 staff, and an outbound shipment will be scheduled.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Submit Dispatch Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
