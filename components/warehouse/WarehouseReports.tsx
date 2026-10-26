'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Boxes,
  Clock,
  CheckCircle2,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useApp } from '@/lib/store-context';

export default function WarehouseReports() {
  const { packages, racks, shipments } = useApp();
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');

  const monthlyVolumeData = [
    { month: 'May', inbound: 3100, outbound: 2850 },
    { month: 'Jun', inbound: 3450, outbound: 3200 },
    { month: 'Jul', inbound: 3900, outbound: 3650 },
    { month: 'Aug', inbound: 4200, outbound: 3900 },
    { month: 'Sep', inbound: 4500, outbound: 4100 },
    { month: 'Oct', inbound: 4820, outbound: 4210 },
  ];

  const categoryBreakdown = [
    { name: 'Electronics & Solar', value: 38, color: '#3b82f6' },
    { name: 'Industrial Equipment', value: 24, color: '#6366f1' },
    { name: 'Fast Moving Dry Goods', value: 20, color: '#10b981' },
    { name: 'Automotive Spares', value: 12, color: '#f59e0b' },
    { name: 'Pharmaceuticals', value: 6, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Analytics & KPI Reports</h1>
          <p className="text-sm text-slate-500">
            Comprehensive throughput metrics, dwell time analysis, and capacity utilization forecasts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit PDF
          </button>
        </div>
      </div>

      {/* 4 Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Monthly Inbound Volume</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4,820</div>
          <div className="text-[11px] text-emerald-600 font-medium">↑ +14.2% vs previous month</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Outbound Dispatches</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4,210</div>
          <div className="text-[11px] text-blue-600 font-medium">↑ +8.5% dispatch velocity</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Avg Storage Dwell Time</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">8.4 Days</div>
          <div className="text-[11px] text-purple-600 font-medium">Fast turnover in Zone C</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Fulfillment SLA Accuracy</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">99.2%</div>
          <div className="text-[11px] text-emerald-600 font-medium">Verified without damage claims</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inbound vs Outbound Monthly Flow Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Throughput Volume: Inbound vs Outbound</h2>
              <p className="text-xs text-slate-500">Number of verified packages processed per month</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVolumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="inbound" fill="#3b82f6" name="Inbound Received" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outbound" fill="#10b981" name="Outbound Picked" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cargo Category Allocation</h3>
              <p className="text-xs text-slate-500">Distribution by total stored packages</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {categoryBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
