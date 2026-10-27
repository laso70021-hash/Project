'use client';

import React from 'react';
import { useAppStore } from '@/lib/store-context';
import { RouteMap } from '@/components/common/RouteMap';
import {
  Package,
  Boxes,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ArrowUp,
  ArrowDown,
  Calendar,
  Plus,
  Clock,
  Check,
  X,
  ChevronDown,
  MoreHorizontal,
  FileText,
  ShieldCheck,
  CreditCard,
  User,
  Radio,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AdminOverviewProps {
  onNavigate?: (tab: string) => void;
}

// Mini SVG sparkline matching the reference screenshot cards
function MiniSparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg className="w-12 h-3.5 overflow-visible" viewBox="0 0 50 16">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function AdminOverview({ onNavigate }: AdminOverviewProps) {
  const { setActiveTab } = useAppStore();
  const handleNav = onNavigate || setActiveTab;

  // 30-day shipment trend data matching screenshot ticks and curve values
  const shipmentTrends = [
    { day: 'Oct 1', created: 20, picked: 12, transit: 38, delivered: 18 },
    { day: 'Oct 5', created: 26, picked: 18, transit: 42, delivered: 15 },
    { day: 'Oct 10', created: 48, picked: 22, transit: 54, delivered: 32 },
    { day: 'Oct 15', created: 38, picked: 34, transit: 58, delivered: 24 },
    { day: 'Oct 20', created: 52, picked: 38, transit: 50, delivered: 38 },
    { day: 'Oct 25', created: 48, picked: 28, transit: 58, delivered: 30 },
  ];

  // Warehouse capacity donut
  const capacityData = [
    { name: 'Occupied', value: 1248, color: '#1677ff' },
    { name: 'Available', value: 592, color: '#e2e8f0' },
  ];

  // Table rows matching reference screenshot
  const recentShipments = [
    {
      tracking: 'TZL-20261025-001',
      customer: 'Juma Traders',
      serviceType: 'Warehouse + Shipping',
      originDest: 'Dar es Salaam → Zanzibar',
      status: 'In Transit',
      driver: 'Ali Hassan',
      driverStatus: 'assigned',
      estDelivery: 'Oct 26, 2026',
    },
    {
      tracking: 'TZL-20261025-002',
      customer: 'Raha Stores',
      serviceType: 'Shipping Only',
      originDest: 'Dar es Salaam → Nairobi',
      status: 'Picked Up',
      driver: 'Mariam Ali',
      driverStatus: 'assigned',
      estDelivery: 'Oct 28, 2026',
    },
    {
      tracking: 'TZL-20261024-015',
      customer: 'Zanzibar Fashion',
      serviceType: 'Warehouse + Shipping',
      originDest: 'Zanzibar → Dar es Salaam',
      status: 'Delivered',
      driver: 'Salim Khamis',
      driverStatus: 'assigned',
      estDelivery: 'Oct 24, 2026',
    },
    {
      tracking: 'TZL-20261024-014',
      customer: 'Kigali Supplies',
      serviceType: 'Shipping Only',
      originDest: 'Dar es Salaam → Kigali',
      status: 'In Transit',
      driver: 'Omary Seif',
      driverStatus: 'assigned',
      estDelivery: 'Oct 27, 2026',
    },
    {
      tracking: 'TZL-20261024-013',
      customer: 'Mlimani Ltd',
      serviceType: 'Warehouse + Shipping',
      originDest: 'Dar es Salaam → Arusha',
      status: 'Pending',
      driver: 'Unassigned',
      driverStatus: 'unassigned',
      estDelivery: 'Oct 29, 2026',
    },
    {
      tracking: 'TZL-20261024-012',
      customer: 'Nairobi Imports',
      serviceType: 'Shipping Only',
      originDest: 'Mwanza → Nairobi',
      status: 'Out for Delivery',
      driver: 'Peter John',
      driverStatus: 'assigned',
      estDelivery: 'Oct 25, 2026',
    },
    {
      tracking: 'TZL-20261024-011',
      customer: 'Karibu Goods',
      serviceType: 'Warehouse + Shipping',
      originDest: 'Dar es Salaam → Mwanza',
      status: 'Picked Up',
      driver: 'Hamisi Abdalla',
      driverStatus: 'assigned',
      estDelivery: 'Oct 26, 2026',
    },
    {
      tracking: 'TZL-20261023-098',
      customer: 'Amani Traders',
      serviceType: 'Shipping Only',
      originDest: 'Arusha → Zanzibar',
      status: 'Delivered',
      driver: 'Yusuf Mussa',
      driverStatus: 'assigned',
      estDelivery: 'Oct 23, 2026',
    },
  ];

  return (
    <div className="space-y-3.5 text-slate-800">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back! Here&apos;s what&apos;s happening with your logistics operations today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Picker Button */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>Oct 1, 2026 - Oct 25, 2026</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          {/* Create Shipment CTA */}
          <button
            onClick={() => handleNav('create-shipment')}
            className="flex items-center gap-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      {/* Exactly Six Top KPI Cards in a row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Total Shipments */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1677ff] text-white shrink-0 shadow-xs">
              <Package className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block truncate">Total Shipments</span>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">482</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <div className="text-[10px] leading-tight">
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5">
                <ArrowUp className="h-2.5 w-2.5" /> 12%
              </span>
              <span className="text-slate-400 block">vs last month</span>
            </div>
            <MiniSparkline color="#1677ff" points="0,12 10,14 20,8 30,12 40,6 50,8" />
          </div>
        </div>

        {/* 2. Active Storage */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10b981] text-white shrink-0 shadow-xs">
              <Boxes className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block truncate">Active Storage</span>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">1,248</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <div className="text-[10px] leading-tight">
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5">
                <ArrowUp className="h-2.5 w-2.5" /> 8%
              </span>
              <span className="text-slate-400 block">pallets / cartons</span>
            </div>
            <MiniSparkline color="#10b981" points="0,14 10,14 20,10 30,12 40,4 50,8" />
          </div>
        </div>

        {/* 3. In Transit */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8b5cf6] text-white shrink-0 shadow-xs">
              <Truck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block truncate">In Transit</span>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">136</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <div className="text-[10px] leading-tight">
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5">
                <ArrowUp className="h-2.5 w-2.5" /> 24%
              </span>
              <span className="text-slate-400 block">shipments</span>
            </div>
            <MiniSparkline color="#8b5cf6" points="0,14 10,12 20,12 30,6 40,10 50,6" />
          </div>
        </div>

        {/* 4. Delivered */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f97316] text-white shrink-0 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block truncate">Delivered</span>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">318</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <div className="text-[10px] leading-tight">
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5">
                <ArrowUp className="h-2.5 w-2.5" /> 15%
              </span>
              <span className="text-slate-400 block">this month</span>
            </div>
            <MiniSparkline color="#f97316" points="0,14 10,14 20,12 30,12 40,6 50,4" />
          </div>
        </div>

        {/* 5. Pending Actions */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef4444] text-white shrink-0 shadow-xs">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block truncate">Pending Actions</span>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">27</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <div className="text-[10px] leading-tight">
              <span className="font-bold text-rose-600 inline-flex items-center gap-0.5">
                <ArrowDown className="h-2.5 w-2.5" /> -18%
              </span>
              <span className="text-slate-400 block">require attention</span>
            </div>
            <MiniSparkline color="#ef4444" points="0,12 10,10 20,8 30,4 40,8 50,12" />
          </div>
        </div>

        {/* 6. Revenue (TZS) */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eab308] text-white shrink-0 shadow-xs">
              <Coins className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block truncate">Revenue (TZS)</span>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">128.5M</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <div className="text-[10px] leading-tight">
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5">
                <ArrowUp className="h-2.5 w-2.5" /> 20%
              </span>
              <span className="text-slate-400 block">this month</span>
            </div>
            <MiniSparkline color="#eab308" points="0,14 10,12 20,14 30,10 40,4 50,6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left & Center (col-span-8) + Right Column (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* LEFT + CENTER COLUMNS (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          {/* Row 1: Shipments Overview (7 cols) + Warehouse Capacity (5 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Shipments Overview Chart */}
            <div className="md:col-span-7 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Shipments Overview</h3>
                <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600 font-medium">
                  <span>Last 30 days</span>
                  <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                </div>
              </div>

              {/* Legend directly below title */}
              <div className="flex items-center gap-3.5 mt-2 text-[10.5px] text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1677ff]" />
                  <span>Created</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                  <span>Picked Up</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
                  <span>In Transit</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                  <span>Delivered</span>
                </span>
              </div>

              {/* Line Chart */}
              <div className="h-44 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={shipmentTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 9.5 }} stroke="#94a3b8" />
                    <YAxis domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} tick={{ fontSize: 9.5 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: '#e2e8f0' }} />
                    <Line type="monotone" dataKey="created" stroke="#1677ff" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="picked" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="transit" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="delivered" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Warehouse Capacity Donut & Breakdown */}
            <div className="md:col-span-5 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Warehouse Capacity</h3>
                <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600 font-medium">
                  <span>All Warehouses</span>
                  <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                </div>
              </div>

              {/* Gauge and Legend */}
              <div className="flex items-center justify-between mt-1 px-1">
                <div className="relative flex items-center justify-center h-24 w-24">
                  <ResponsiveContainer width={96} height={96}>
                    <PieChart>
                      <Pie data={capacityData} dataKey="value" innerRadius={34} outerRadius={46} startAngle={90} endAngle={-270}>
                        {capacityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-extrabold text-slate-900 leading-tight">68%</span>
                    <span className="text-[8.5px] font-semibold text-slate-400">Occupied</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10.5px] min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-[#1677ff]" />
                      <span>Occupied</span>
                    </span>
                    <span className="font-bold text-slate-900">1,248 (68%)</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                      <span>Available</span>
                    </span>
                    <span className="font-bold text-slate-900">592 (32%)</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-0.5 border-t border-slate-100 text-slate-500">
                    <span>Total Capacity</span>
                    <span className="font-bold text-slate-900">1,840</span>
                  </div>
                </div>
              </div>

              {/* Progress Bars for Individual Warehouses */}
              <div className="space-y-1.5 text-[10px] mt-2 pt-2 border-t border-slate-100">
                {[
                  { name: 'Dar es Salaam (DAR-WH01)', pct: 82, count: '820 / 1,000', color: 'bg-[#1677ff]' },
                  { name: 'Zanzibar (ZNZ-WH01)', pct: 54, count: '320 / 600', color: 'bg-[#10b981]' },
                  { name: 'Arusha (ARU-WH01)', pct: 60, count: '180 / 300', color: 'bg-[#f97316]' },
                  { name: 'Mwanza (MWZ-WH01)', pct: 40, count: '120 / 300', color: 'bg-[#8b5cf6]' },
                ].map((wh) => (
                  <div key={wh.name} className="flex items-center justify-between gap-2">
                    <span className="truncate w-36 text-slate-600">{wh.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full ${wh.color}`} style={{ width: `${wh.pct}%` }} />
                    </div>
                    <span className="font-semibold text-slate-800 w-7 text-right">{wh.pct}%</span>
                    <span className="text-slate-400 w-16 text-right font-normal">{wh.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Storage Bookings & Recent Invoices side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Storage Bookings */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold text-slate-900">Storage Bookings</h3>
                <button
                  onClick={() => handleNav('warehouse-bookings')}
                  className="text-[11px] font-semibold text-[#1677ff] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#1677ff] mb-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 leading-tight">56</span>
                  <p className="text-[9.5px] text-slate-500 font-medium">Pending Review</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[#10b981] mb-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 leading-tight">28</span>
                  <p className="text-[9.5px] text-slate-500 font-medium">Approved</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-[#ef4444] mb-1">
                    <X className="h-4 w-4" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 leading-tight">6</span>
                  <p className="text-[9.5px] text-slate-500 font-medium">Rejected</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-[#8b5cf6] mb-1">
                    <Boxes className="h-4 w-4" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 leading-tight">214</span>
                  <p className="text-[9.5px] text-slate-500 font-medium">Active Storage</p>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold text-slate-900">Recent Invoices</h3>
                <button
                  onClick={() => handleNav('billing')}
                  className="text-[11px] font-semibold text-[#1677ff] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-[#ef4444] mb-1">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 leading-tight">42</span>
                  <p className="text-[9.5px] text-slate-500 font-medium">Unpaid</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-[#f59e0b] mb-1">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 leading-tight">18</span>
                  <p className="text-[9.5px] text-slate-500 font-medium">Partially Paid</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[#10b981] mb-1">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 leading-tight">126</span>
                  <p className="text-[9.5px] text-slate-500 font-medium">Paid</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 mb-1">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 leading-tight">3</span>
                  <p className="text-[9.5px] text-slate-500 font-medium">Refunded</p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Recent Shipments (Spans entire Left 8-col width) */}
          <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
              <h3 className="text-xs font-bold text-slate-900">Recent Shipments</h3>
              <button
                onClick={() => handleNav('shipments')}
                className="text-[11px] font-semibold text-[#1677ff] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 text-[10.5px] font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3.5">Tracking No.</th>
                    <th className="py-2 px-3.5">Customer</th>
                    <th className="py-2 px-3.5">Service Type</th>
                    <th className="py-2 px-3.5">Origin → Destination</th>
                    <th className="py-2 px-3.5">Status</th>
                    <th className="py-2 px-3.5">Driver</th>
                    <th className="py-2 px-3.5">Est. Delivery</th>
                    <th className="py-2 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                  {recentShipments.map((s) => (
                    <tr key={s.tracking} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3.5 font-medium text-[#1677ff] hover:underline cursor-pointer">
                        {s.tracking}
                      </td>
                      <td className="py-2 px-3.5 font-medium text-slate-900">
                        {s.customer}
                      </td>
                      <td className="py-2 px-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            s.serviceType === 'Warehouse + Shipping'
                              ? 'bg-[#e0f2fe] text-[#0284c7]'
                              : 'bg-[#e6fffa] text-[#0f766e]'
                          }`}
                        >
                          {s.serviceType}
                        </span>
                      </td>
                      <td className="py-2 px-3.5 text-slate-600">
                        {s.originDest}
                      </td>
                      <td className="py-2 px-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            s.status === 'In Transit'
                              ? 'bg-[#e0f2fe] text-[#0284c7]'
                              : s.status === 'Picked Up'
                              ? 'bg-[#f3e8ff] text-[#7e22ce]'
                              : s.status === 'Delivered'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : s.status === 'Out for Delivery'
                              ? 'bg-[#ffedd5] text-[#c2410c]'
                              : 'bg-[#fef3c7] text-[#b45309]'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2 px-3.5">
                        {s.driverStatus === 'unassigned' ? (
                          <span className="text-orange-600 font-medium">Unassigned</span>
                        ) : (
                          <span className="text-slate-800 font-normal">{s.driver}</span>
                        )}
                      </td>
                      <td className="py-2 px-3.5 text-slate-500">
                        {s.estDelivery}
                      </td>
                      <td className="py-2 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleNav('shipments')}
                            className="rounded border border-slate-200 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:bg-slate-50 transition"
                          >
                            {s.driverStatus === 'unassigned' ? 'Assign' : 'View'}
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 p-0.5">
                            <MoreHorizontal className="h-3.5 w-3.5" />
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

        {/* RIGHT COLUMN (4 cols): Live Tracking + Recent Activities */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Live Tracking Card */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Live Tracking</h3>
              <button
                onClick={() => handleNav('transporters')}
                className="text-[11px] font-semibold text-[#1677ff] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="h-[250px] w-full rounded-lg overflow-hidden border border-slate-100">
              <RouteMap variant="admin" heightClass="h-full min-h-[250px]" />
            </div>
          </div>

          {/* Recent Activities Card */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900">Recent Activities</h3>
              <button
                onClick={() => handleNav('notifications')}
                className="text-[11px] font-semibold text-[#1677ff] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Activity 1 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1677ff] text-white shrink-0 mt-0.5 shadow-xs">
                  <Package className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-800 leading-snug">
                    Shipment TZL-20261025-001 updated to In Transit
                  </p>
                  <span className="text-[10px] text-slate-400">15 minutes ago</span>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ef4444] text-white shrink-0 mt-0.5 shadow-xs">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-800 leading-snug">
                    Driver Ali Hassan started route to Zanzibar
                  </p>
                  <span className="text-[10px] text-slate-400">28 minutes ago</span>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f43f5e] text-white shrink-0 mt-0.5 shadow-xs">
                  <Boxes className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-800 leading-snug">
                    Goods received for booking WHB-2026-0045 (38/40 cartons)
                  </p>
                  <span className="text-[10px] text-slate-400">1 hour ago</span>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10b981] text-white shrink-0 mt-0.5 shadow-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-800 leading-snug">
                    Storage booking WHB-2026-0046 approved
                  </p>
                  <span className="text-[10px] text-slate-400">2 hours ago</span>
                </div>
              </div>

              {/* Activity 5 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10b981] text-white shrink-0 mt-0.5 shadow-xs">
                  <CreditCard className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-800 leading-snug">
                    Payment of TZS 450,000 verified (INV-2026-0783)
                  </p>
                  <span className="text-[10px] text-slate-400">3 hours ago</span>
                </div>
              </div>

              {/* Activity 6 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eab308] text-white shrink-0 mt-0.5 shadow-xs">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-800 leading-snug">
                    New shipment created (TZL-20261025-003)
                  </p>
                  <span className="text-[10px] text-slate-400">4 hours ago</span>
                </div>
              </div>

              {/* Activity 7 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10b981] text-white shrink-0 mt-0.5 shadow-xs">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-800 leading-snug">
                    Driver Salim Khamis marked delivery completed
                  </p>
                  <span className="text-[10px] text-slate-400">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
