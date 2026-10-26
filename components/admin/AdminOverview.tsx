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
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Plus,
  Eye,
  ExternalLink,
  Clock,
  Check,
  X,
  CreditCard,
  UserCheck,
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

export function AdminOverview({ onNavigate }: AdminOverviewProps) {
  const { shipments, bookings, invoices, setActiveTab } = useAppStore();
  const handleNav = onNavigate || setActiveTab;


  // 30-day shipment trend data
  const shipmentTrends = [
    { day: 'Oct 1', created: 35, picked: 20, transit: 15, delivered: 10 },
    { day: 'Oct 5', created: 48, picked: 32, transit: 25, delivered: 18 },
    { day: 'Oct 10', created: 65, picked: 44, transit: 38, delivered: 28 },
    { day: 'Oct 15', created: 52, picked: 38, transit: 30, delivered: 24 },
    { day: 'Oct 20', created: 74, picked: 55, transit: 48, delivered: 36 },
    { day: 'Oct 25', created: 62, picked: 48, transit: 40, delivered: 32 },
  ];

  // Warehouse capacity gauge
  const capacityData = [
    { name: 'Occupied', value: 1248, color: '#2563eb' },
    { name: 'Available', value: 592, color: '#e2e8f0' },
  ];

  return (
    <div className="space-y-5 p-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back! Here&apos;s what&apos;s happening with your logistics operations today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Picker Button */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Oct 1, 2026 - Oct 25, 2026</span>
          </div>

          {/* Create Shipment CTA */}
          <button
            onClick={() => handleNav('create_shipment')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Shipments */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package className="h-4 w-4" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> 12%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-500">Total Shipments</span>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">482</p>
            <span className="text-[10px] text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Active Storage */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Boxes className="h-4 w-4" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> 8%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-500">Active Storage</span>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">1,248</p>
            <span className="text-[10px] text-slate-400">pallets / cartons</span>
          </div>
        </div>

        {/* In Transit */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Truck className="h-4 w-4" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> 24%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-500">In Transit</span>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">136</p>
            <span className="text-[10px] text-slate-400">shipments</span>
          </div>
        </div>

        {/* Delivered */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> 15%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-500">Delivered</span>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">318</p>
            <span className="text-[10px] text-slate-400">this month</span>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-rose-600">
              <ArrowDownRight className="h-3 w-3" /> 18%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-500">Pending Actions</span>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">27</p>
            <span className="text-[10px] text-slate-400">require attention</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Coins className="h-4 w-4" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> 20%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-500">Revenue (TZS)</span>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">128.5M</p>
            <span className="text-[10px] text-slate-400">this month</span>
          </div>
        </div>
      </div>

      {/* Upper Content Section (3 columns: Line Chart, Gauge Breakdown, Live Tracking Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Shipments Overview Chart (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Shipments Overview</h3>
              <p className="text-[11px] text-slate-500">Volume & delivery velocity</p>
            </div>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              Last 30 days
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={shipmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="created" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} name="Created" />
                <Line type="monotone" dataKey="picked" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} name="Picked Up" />
                <Line type="monotone" dataKey="transit" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 2 }} name="In Transit" />
                <Line type="monotone" dataKey="delivered" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} name="Delivered" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-slate-600 border-t border-slate-100">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600" /> Created</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Picked Up</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> In Transit</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Delivered</span>
          </div>
        </div>

        {/* Warehouse Capacity (3 cols) */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900">Warehouse Capacity</h3>
            <span className="text-[10px] font-medium text-slate-500">All Warehouses</span>
          </div>

          {/* Donut Gauge */}
          <div className="relative flex items-center justify-center h-32">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={capacityData} dataKey="value" innerRadius={42} outerRadius={55} startAngle={90} endAngle={-270}>
                  {capacityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-black text-slate-900">68%</span>
              <span className="text-[9px] font-semibold text-slate-400">Occupied</span>
            </div>
          </div>

          {/* Facility Bars */}
          <div className="mt-3 space-y-2 text-[11px]">
            {[
              { name: 'Dar es Salaam (DAR-WH01)', pct: 82, count: '820 / 1,000', color: 'bg-blue-600' },
              { name: 'Zanzibar (ZNZ-WH01)', pct: 54, count: '320 / 600', color: 'bg-emerald-500' },
              { name: 'Arusha (ARU-WH01)', pct: 60, count: '180 / 300', color: 'bg-amber-500' },
              { name: 'Mwanza (MWZ-WH01)', pct: 40, count: '120 / 300', color: 'bg-purple-500' },
            ].map((wh) => (
              <div key={wh.name} className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span className="truncate max-w-[150px]">{wh.name}</span>
                  <span className="font-semibold text-slate-800">{wh.pct}% <span className="text-slate-400 font-normal">({wh.count})</span></span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${wh.color}`} style={{ width: `${wh.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Tracking East Africa Map (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900">Live Tracking</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Real-Time GPS
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Google Maps Platform • Active corridor telematics</p>
            </div>
            <button
              onClick={() => handleNav('transporters')}
              className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Fleet Telematics
            </button>
          </div>
          <div className="flex-1 min-h-[260px] rounded-lg overflow-hidden border border-slate-100 shadow-inner">
            <RouteMap variant="admin" heightClass="h-full min-h-[260px]" />
          </div>
        </div>
      </div>

      {/* Middle Section (Storage Bookings, Recent Invoices, Recent Activities) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Storage Bookings */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900">Storage Bookings</h3>
            <button
              onClick={() => handleNav('wh_overview')}
              className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-blue-50/60 p-2.5">
              <span className="text-lg font-black text-blue-700">56</span>
              <p className="text-[10px] font-medium text-slate-600">Pending Review</p>
            </div>
            <div className="rounded-lg bg-emerald-50/60 p-2.5">
              <span className="text-lg font-black text-emerald-700">28</span>
              <p className="text-[10px] font-medium text-slate-600">Approved</p>
            </div>
            <div className="rounded-lg bg-red-50/60 p-2.5">
              <span className="text-lg font-black text-red-700">6</span>
              <p className="text-[10px] font-medium text-slate-600">Rejected</p>
            </div>
            <div className="rounded-lg bg-purple-50/60 p-2.5">
              <span className="text-lg font-black text-purple-700">214</span>
              <p className="text-[10px] font-medium text-slate-600">Active Storage</p>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900">Recent Invoices</h3>
            <button
              onClick={() => handleNav('billing')}
              className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-rose-50/60 p-2.5">
              <span className="text-lg font-black text-rose-700">42</span>
              <p className="text-[10px] font-medium text-slate-600">Unpaid</p>
            </div>
            <div className="rounded-lg bg-amber-50/60 p-2.5">
              <span className="text-lg font-black text-amber-700">18</span>
              <p className="text-[10px] font-medium text-slate-600">Partially Paid</p>
            </div>
            <div className="rounded-lg bg-emerald-50/60 p-2.5">
              <span className="text-lg font-black text-emerald-700">126</span>
              <p className="text-[10px] font-medium text-slate-600">Paid</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2.5">
              <span className="text-lg font-black text-slate-700">3</span>
              <p className="text-[10px] font-medium text-slate-600">Refunded</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900">Recent Activities</h3>
            <span className="text-[10px] text-blue-600 font-medium">Live Feed</span>
          </div>
          <div className="space-y-2.5 text-xs max-h-48 overflow-y-auto pr-1">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 text-[11px]">Shipment TZL-20261025-001 updated to In Transit</p>
                <span className="text-[10px] text-slate-400">15 minutes ago</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 text-[11px]">Driver Ali Hassan started route to Zanzibar</p>
                <span className="text-[10px] text-slate-400">28 minutes ago</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-purple-500 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 text-[11px]">Goods received for booking WHB-2026-0045 (38/40 cartons)</p>
                <span className="text-[10px] text-slate-400">1 hour ago</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 text-[11px]">Payment of TZS 450,000 verified (INV-2026-0783)</p>
                <span className="text-[10px] text-slate-400">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Shipments Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Recent Shipments</h3>
            <p className="text-[11px] text-slate-500">Latest active and historical logistics dispatches</p>
          </div>
          <button
            onClick={() => handleNav('shipments')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All Shipments &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Tracking No.</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Service Type</th>
                <th className="py-2.5 px-4">Origin &rarr; Destination</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Driver</th>
                <th className="py-2.5 px-4">Est. Delivery</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {shipments.slice(0, 7).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-700">
                    {s.trackingNumber}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">
                    {s.customerName}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {s.serviceType}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    {s.origin} &rarr; {s.destination}
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        s.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : s.status === 'In Transit'
                          ? 'bg-blue-50 text-blue-700'
                          : s.status === 'Out for Delivery'
                          ? 'bg-amber-50 text-amber-700'
                          : s.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    {s.assignedDriverName || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">
                    {s.expectedDeliveryDate.includes('T')
                      ? s.expectedDeliveryDate.split('T')[0]
                      : s.expectedDeliveryDate}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => handleNav('shipments')}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Inspect"
                    >
                      <Eye className="h-4 w-4" />
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

export default AdminOverview;

