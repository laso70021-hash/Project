'use client';

import React, { useState } from 'react';
import {
  Package,
  Boxes,
  Clock,
  Truck,
  AlertTriangle,
  Download,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  ChevronDown,
  Layers,
  MoreHorizontal,
  Home,
  Bell,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useAppStore } from '@/lib/store-context';

export default function WarehouseReports() {
  const { packages, racks } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'utilization' | 'movement' | 'cycle' | 'aging' | 'custom'>('overview');
  const [selectedWarehouse, setSelectedWarehouse] = useState('WH001 - Main Warehouse');
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [dateRange, setDateRange] = useState('01 Jun 2024 - 30 Jun 2024');
  const [movementTimeframe, setMovementTimeframe] = useState('Last 30 Days');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('All Activities');

  // Donut 1: Inventory Status
  const inventoryStatusData = [
    { name: 'In Storage', value: 892, pct: '71.5%', color: '#10b981' },
    { name: 'Awaiting Putaway', value: 56, pct: '4.5%', color: '#f59e0b' },
    { name: 'Picked/Dispatched', value: 264, pct: '21.2%', color: '#6366f1' },
    { name: 'Discrepancies', value: 32, pct: '2.6%', color: '#ef4444' },
    { name: 'Empty Locations', value: 16, pct: '1.3%', color: '#94a3b8' },
  ];

  // Bar: Zone Utilization
  const zoneUtilizationData = [
    { zone: 'Zone A', utilization: 82, fill: '#3b82f6' },
    { zone: 'Zone B', utilization: 65, fill: '#06b6d4' },
    { zone: 'Zone C', utilization: 54, fill: '#f59e0b' },
    { zone: 'Zone D', utilization: 71, fill: '#2563eb' },
  ];

  // Line: Package Movements (30 days timeline)
  const movementTrendData = [
    { day: 'Jun 1', received: 42, putaway: 38, picked: 20 },
    { day: 'Jun 5', received: 38, putaway: 32, picked: 28 },
    { day: 'Jun 10', received: 50, putaway: 45, picked: 24 },
    { day: 'Jun 15', received: 68, putaway: 54, picked: 30 },
    { day: 'Jun 20', received: 58, putaway: 52, picked: 42 },
    { day: 'Jun 25', received: 78, putaway: 62, picked: 35 },
    { day: 'Jun 30', received: 82, putaway: 70, picked: 48 },
  ];

  // Donut 2: Package Type Distribution
  const packageTypeData = [
    { name: 'Electronics', count: 420, pct: '33.7%', color: '#3b82f6' },
    { name: 'Clothing', count: 280, pct: '22.4%', color: '#8b5cf6' },
    { name: 'Accessories', count: 180, pct: '14.4%', color: '#a855f7' },
    { name: 'Documents', count: 120, pct: '9.6%', color: '#facc15' },
    { name: 'Spare Parts', count: 110, pct: '8.8%', color: '#ec4899' },
    { name: 'Others', count: 138, pct: '11.1%', color: '#38bdf8' },
  ];

  // Top storage locations
  const topLocations = [
    { code: 'WH001-A-R05-L02-B03', zone: 'A', rack: 'R05', level: 'L02', bin: 'B03', packages: '100 / 100', util: 100, color: 'bg-red-500' },
    { code: 'WH001-A-R05-L02-B02', zone: 'A', rack: 'R05', level: 'L02', bin: 'B02', packages: '95 / 100', util: 95, color: 'bg-red-500' },
    { code: 'WH001-B-R03-L01-B01', zone: 'B', rack: 'R03', level: 'L01', bin: 'B01', packages: '92 / 100', util: 92, color: 'bg-orange-500' },
    { code: 'WH001-A-R06-L01-B04', zone: 'A', rack: 'R06', level: 'L01', bin: 'B04', packages: '88 / 100', util: 88, color: 'bg-amber-400' },
    { code: 'WH001-C-R02-L03-B01', zone: 'C', rack: 'R02', level: 'L03', bin: 'B01', packages: '85 / 100', util: 85, color: 'bg-emerald-500' },
  ];

  // Aging report
  const agingData = [
    { range: '0 - 7', packages: 362, barWidth: '85%', color: 'bg-emerald-500' },
    { range: '8 - 14', packages: 248, barWidth: '60%', color: 'bg-blue-600' },
    { range: '15 - 30', packages: 176, barWidth: '42%', color: 'bg-orange-500' },
    { range: '31 - 60', packages: 92, barWidth: '24%', color: 'bg-amber-400' },
    { range: '60+', packages: 14, barWidth: '8%', color: 'bg-red-500' },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      date: '12 Jun 2024, 10:32 AM',
      activity: 'Putaway',
      activityColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pkgId: 'PKG-1042',
      location: 'Receiving → WH001-A-R05-L02-B03',
      zone: 'A',
      user: 'John M.',
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800',
      notes: 'Package stored successfully',
    },
    {
      id: 2,
      date: '12 Jun 2024, 09:15 AM',
      activity: 'Picked',
      activityColor: 'bg-blue-50 text-blue-700 border-blue-200',
      pkgId: 'PKG-1041',
      location: 'WH001-B-R03-L01-B02 → Dispatch',
      zone: 'B',
      user: 'Amina K.',
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800',
      notes: 'Ready for dispatch',
    },
    {
      id: 3,
      date: '11 Jun 2024, 04:28 PM',
      activity: 'Transfer',
      activityColor: 'bg-purple-50 text-purple-700 border-purple-200',
      pkgId: 'PKG-1038',
      location: 'WH001-A-R05-L01-B01 → WH001-A-R05-L02-B01',
      zone: 'A',
      user: 'Omar S.',
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800',
      notes: 'Internal transfer',
    },
    {
      id: 4,
      date: '11 Jun 2024, 02:14 PM',
      activity: 'Received',
      activityColor: 'bg-sky-50 text-sky-700 border-sky-200',
      pkgId: 'PKG-1036',
      location: '- → Receiving',
      zone: '-',
      user: 'Fatma H.',
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800',
      notes: '5 packages received',
    },
    {
      id: 5,
      date: '10 Jun 2024, 11:05 AM',
      activity: 'Discrepancy',
      activityColor: 'bg-rose-50 text-rose-700 border-rose-200',
      pkgId: 'PKG-1029',
      location: 'WH001-C-R02-L02-B03',
      zone: 'C',
      user: 'Omar S.',
      status: 'Investigating',
      statusColor: 'bg-amber-100 text-amber-800',
      notes: 'Missing package during count',
    },
  ];

  return (
    <div className="space-y-4 p-5 max-w-[1600px] mx-auto text-slate-800">
      {/* Breadcrumb & Top Controls Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Home className="h-4 w-4 text-slate-400" />
          <span>Warehouse</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-bold text-slate-900">Reports</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-slate-700 font-medium">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>{dateRange}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          {/* Warehouse Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-slate-700 font-medium">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            <span>{selectedWarehouse}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          {/* Zone Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-slate-700 font-medium">
            <span>{selectedZone}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          {/* Notifications icon */}
          <div className="relative p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              3
            </span>
          </div>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              WM
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-bold text-slate-900 leading-tight">Warehouse Manager</div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Warehouse Overview
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Inventory Report
          </button>
          <button
            onClick={() => setActiveTab('utilization')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'utilization'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Location Utilization
          </button>
          <button
            onClick={() => setActiveTab('movement')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'movement'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Movement Report
          </button>
          <button
            onClick={() => setActiveTab('cycle')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'cycle'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Cycle Count Report
          </button>
          <button
            onClick={() => setActiveTab('aging')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'aging'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Aging Report
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'custom'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Custom Report
          </button>
        </div>

        <div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Total Packages */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Packages</div>
            <div className="text-xl font-black text-slate-900 leading-tight">1,248</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 12%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: In Storage */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">In Storage</div>
            <div className="text-xl font-black text-slate-900 leading-tight">892</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 8%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Awaiting Putaway */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Awaiting Putaway</div>
            <div className="text-xl font-black text-slate-900 leading-tight">56</div>
            <div className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
              <span>↓ 18%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Picked / Dispatched */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Picked / Dispatched</div>
            <div className="text-xl font-black text-slate-900 leading-tight">264</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 24%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 5: Discrepancies */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Discrepancies</div>
            <div className="text-xl font-black text-slate-900 leading-tight">32</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↓ 35%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Three Main Panels (Inventory Status Donut, Storage Capacity Utilization, Package Movements) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: Inventory Status Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Inventory Status</h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 my-auto">
            {/* Donut Chart */}
            <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryStatusData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {inventoryStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-slate-900">1,248</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Total Packages</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs w-full">
              {inventoryStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800">
                    {item.value} <span className="text-slate-400 text-[10px]">({item.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Storage Capacity Utilization (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Storage Capacity Utilization</h2>
            <span className="text-[11px] text-slate-500 font-medium">3,400 / 5,000 locations used</span>
          </div>

          <div className="space-y-3">
            {/* Main Progress Metric */}
            <div>
              <div className="text-2xl font-black text-slate-900">68%</div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Zone Utilization Bars */}
            <div className="h-32 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Utilization']} />
                  <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
                    {zoneUtilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Panel 3: Package Movements Line Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Package Movements</h2>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded px-2 py-0.5">
              <span>{movementTimeframe}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movementTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="received" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="Received" />
                <Line type="monotone" dataKey="putaway" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Putaway" />
                <Line type="monotone" dataKey="picked" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Picked" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Received
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Putaway
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Picked
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Three Panels (Top Storage Locations, Package Type Distribution, Aging Report) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: Top Storage Locations (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Top Storage Locations (Most Used)</h2>
            <ChevronRight className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Location Code</th>
                  <th className="pb-2">Zone</th>
                  <th className="pb-2">Rack</th>
                  <th className="pb-2">Level</th>
                  <th className="pb-2">Bin</th>
                  <th className="pb-2">Packages</th>
                  <th className="pb-2 text-right">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topLocations.map((loc, idx) => (
                  <tr key={loc.code} className="hover:bg-slate-50/70">
                    <td className="py-2 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2 font-mono font-bold text-slate-900 text-[11px]">{loc.code}</td>
                    <td className="py-2 text-slate-600">{loc.zone}</td>
                    <td className="py-2 text-slate-600">{loc.rack}</td>
                    <td className="py-2 text-slate-600">{loc.level}</td>
                    <td className="py-2 text-slate-600">{loc.bin}</td>
                    <td className="py-2 font-medium text-slate-700">{loc.packages}</td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`${loc.color} h-full rounded-full`} style={{ width: `${loc.util}%` }} />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-slate-800">{loc.util}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel 2: Package Type Distribution Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Package Type Distribution</h2>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded px-2 py-0.5">
              <span>All Packages</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Donut Chart */}
            <div className="relative h-36 w-36 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageTypeData}
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {packageTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-slate-900">1,248</span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase">Packages</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1 text-xs w-full">
              {packageTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800">
                    {item.count} <span className="text-slate-400 text-[10px]">({item.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 3: Aging Report (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Aging Report (In Storage)</h2>
            <ChevronRight className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <th className="pb-2">Days</th>
                <th className="pb-2">Packages</th>
                <th className="pb-2 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agingData.map((row) => (
                <tr key={row.range} className="hover:bg-slate-50/70">
                  <td className="py-2.5 font-bold text-slate-800 text-[11px]">{row.range}</td>
                  <td className="py-2.5 font-mono text-slate-700 text-[11px]">{row.packages}</td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`${row.color} h-full rounded-full`} style={{ width: row.barWidth }} />
                      </div>
                      <MoreHorizontal className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Bottom Full Panel — Recent Warehouse Activities */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">Recent Warehouse Activities</h2>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filter Dropdowns */}
            <div className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600 font-medium">
              <span>{activityFilter}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600 font-medium">
              <span>All Zones</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600 font-medium">
              <span>All Users</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="pl-8 pr-3 py-1 rounded border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Activities Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <th className="pb-2">#</th>
                <th className="pb-2">Date & Time</th>
                <th className="pb-2">Activity</th>
                <th className="pb-2">Package ID</th>
                <th className="pb-2">Location (From → To)</th>
                <th className="pb-2">Zone</th>
                <th className="pb-2">Performed By</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Notes</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 text-slate-400 font-mono text-[11px]">{act.id}</td>
                  <td className="py-2.5 text-slate-600 text-[11px]">{act.date}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${act.activityColor}`}>
                      {act.activity}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-slate-900 text-[11px]">{act.pkgId}</td>
                  <td className="py-2.5 font-mono text-slate-600 text-[11px]">{act.location}</td>
                  <td className="py-2.5 text-slate-700">{act.zone}</td>
                  <td className="py-2.5 text-slate-800 font-medium">{act.user}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${act.statusColor}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      {act.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500 text-[11px]">{act.notes}</td>
                  <td className="py-2.5 text-right">
                    <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer inline hover:text-slate-600" />
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
