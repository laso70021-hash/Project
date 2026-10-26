'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store-context';
import { Customer } from '@/lib/types';
import {
  Users,
  Search,
  Download,
  Filter,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Boxes,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function CustomersCRMView() {
  const { customers } = useAppStore();
  const [activeFilterTab, setActiveFilterTab] = useState<'All' | 'Business' | 'Individual' | 'Corporate' | 'VIP' | 'Inactive'>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0] || {} as Customer);
  const [detailSubTab, setDetailSubTab] = useState<'Overview' | 'Storage' | 'Shipments' | 'Billing' | 'Notes'>('Overview');
  const [searchQuery, setSearchQuery] = useState('');

  const regionData = [
    { name: 'Dar es Salaam', value: 450, color: '#2563eb' },
    { name: 'Zanzibar', value: 232, color: '#38bdf8' },
    { name: 'Nairobi', value: 193, color: '#f59e0b' },
    { name: 'Arusha', value: 154, color: '#ec4899' },
    { name: 'Mwanza', value: 103, color: '#10b981' },
    { name: 'Kigali', value: 90, color: '#8b5cf6' },
    { name: 'Other', value: 64, color: '#94a3b8' },
  ];

  const filteredCustomers = customers.filter((c) => {
    if (activeFilterTab !== 'All' && c.type !== activeFilterTab && c.status !== activeFilterTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.customerCode.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 p-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Customers CRM</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Client accounts, credit limits, storage volume, and lifetime value
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting customer CRM database as CSV...')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 12%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Total Customers</span>
            <p className="text-xl font-black text-slate-900">1,286</p>
            <span className="text-[10px] text-slate-400">vs last month</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 18%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Active Customers</span>
            <p className="text-xl font-black text-slate-900">1,042</p>
            <span className="text-[10px] text-slate-400">active this quarter</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-indigo-600">65%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Business Customers</span>
            <p className="text-xl font-black text-slate-900">836</p>
            <span className="text-[10px] text-slate-400">commercial entities</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-sky-600">35%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Individual Customers</span>
            <p className="text-xl font-black text-slate-900">450</p>
            <span className="text-[10px] text-slate-400">personal accounts</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 25%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">New Customers</span>
            <p className="text-xl font-black text-slate-900">86</p>
            <span className="text-[10px] text-slate-400">this month</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        {[
          { id: 'All', label: 'All Customers (1,286)' },
          { id: 'Business', label: 'Business (836)' },
          { id: 'Individual', label: 'Individual (450)' },
          { id: 'Corporate', label: 'Corporate (72)' },
          { id: 'VIP', label: 'VIP (28)' },
          { id: 'Inactive', label: 'Inactive (46)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilterTab(tab.id as any)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeFilterTab === tab.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Grid: Table (7 cols) & Selected Customer Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Customer Table */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Region</th>
                  <th className="py-2.5 px-3">Total Shipments</th>
                  <th className="py-2.5 px-3">In Storage</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCustomers.map((c) => {
                  const isSelected = selectedCustomer.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-200 font-bold text-[10px] text-slate-700">
                            {c.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 leading-tight">{c.name}</p>
                            <span className="text-[10px] text-slate-400">{c.customerCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700">
                          {c.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">
                        <p className="font-medium text-slate-800">{c.phone}</p>
                        <p className="text-slate-400 text-[10px] truncate max-w-[120px]">{c.email}</p>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {c.region}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {c.totalShipments}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">
                        {c.packagesInStorage}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            c.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : c.status === 'VIP'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-xs text-slate-500 bg-slate-50/50">
            <span>Showing 1 - {filteredCustomers.length} of 1,286 customers</span>
            <div className="flex items-center gap-1">
              <button className="rounded p-1 border border-slate-200"><ChevronLeft className="h-3.5 w-3.5" /></button>
              <button className="rounded px-2.5 py-0.5 bg-blue-600 text-white font-bold">1</button>
              <button className="rounded px-2.5 py-0.5 border border-slate-200">2</button>
              <button className="rounded p-1 border border-slate-200"><ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Selected Customer Details Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-base shadow-xs">
                {selectedCustomer.name.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">{selectedCustomer.name}</h3>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span>Customer ID: {selectedCustomer.customerCode}</span>
                  <span className="rounded bg-blue-50 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                    {selectedCustomer.type}
                  </span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedCustomer.notes || 'Electronics and general merchandise distribution.'}
          </p>

          {/* Subtabs */}
          <div className="flex items-center gap-1 border-b border-slate-100 text-xs">
            {(['Overview', 'Storage', 'Shipments', 'Billing', 'Notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setDetailSubTab(tab)}
                className={`pb-2 px-2 font-bold transition-colors ${
                  detailSubTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>Contact Person: <strong className="text-slate-900">{selectedCustomer.contactPerson}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>Phone: <strong className="text-slate-900">{selectedCustomer.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>Email: <strong className="text-slate-900">{selectedCustomer.email}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Address: <strong className="text-slate-900">{selectedCustomer.address}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Customer Since: <strong className="text-slate-900">{selectedCustomer.customerSince}</strong></span>
            </div>
          </div>

          {/* 4 Stats Grid matching screenshot */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <span className="text-[10px] text-slate-400 font-medium">Total Shipments</span>
              <p className="text-base font-black text-slate-900 mt-0.5">{selectedCustomer.totalShipments}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <span className="text-[10px] text-slate-400 font-medium">In Storage</span>
              <p className="text-base font-black text-blue-700 mt-0.5">{selectedCustomer.packagesInStorage}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <span className="text-[10px] text-slate-400 font-medium">This Month</span>
              <p className="text-base font-black text-slate-900 mt-0.5">12</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <span className="text-[10px] text-slate-400 font-medium">Total Spend</span>
              <p className="text-base font-black text-emerald-700 mt-0.5">
                TZS {(selectedCustomer.totalSpendTzs / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Customers, Customers by Region Donut, Recent Customers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Top Customers by Shipments */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900">Top Customers by Shipments</h4>
            <span className="text-[10px] text-blue-600 font-medium">View All</span>
          </div>
          <div className="space-y-2.5 text-xs">
            {[
              { rank: 1, name: 'Rift Valley Intermodal', count: 320, pct: 100 },
              { rank: 2, name: 'ABC Company', count: 142, pct: 45 },
              { rank: 3, name: 'Nairobi Electronics', count: 120, pct: 38 },
              { rank: 4, name: 'Zanzibar Retail Ltd', count: 98, pct: 30 },
              { rank: 5, name: 'Tanzania Traders', count: 85, pct: 27 },
            ].map((it) => (
              <div key={it.rank} className="flex items-center gap-2">
                <span className="w-3 text-slate-400 font-bold text-[11px]">{it.rank}</span>
                <span className="w-36 truncate font-medium text-slate-800 text-[11px]">{it.name}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${it.pct}%` }} />
                </div>
                <span className="font-extrabold text-slate-900 text-[11px]">{it.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customers by Region Donut */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900">Customers by Region</h4>
            <span className="text-[10px] text-blue-600 font-medium">View All</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative flex items-center justify-center h-28 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={regionData} dataKey="value" innerRadius={30} outerRadius={46}>
                    {regionData.map((e, idx) => (
                      <Cell key={idx} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-black text-slate-900">1,286</span>
                <span className="text-[8px] text-slate-400">Total</span>
              </div>
            </div>

            <div className="space-y-1 text-[10px] text-slate-600">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" /> Dar es Salaam (35%)</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-400" /> Zanzibar (18%)</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Nairobi (15%)</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pink-500" /> Arusha (12%)</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Mwanza (8%)</div>
            </div>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900">Recent Customers</h4>
            <span className="text-[10px] text-blue-600 font-medium">View All</span>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { name: 'Techno Mart Ltd', type: 'Business', phone: '+255 753 222 111', time: '5 hours ago' },
              { name: 'Zanzibar Fashion', type: 'Business', phone: '+255 777 333 444', time: '1 day ago' },
              { name: 'Asha Mohamed', type: 'Individual', phone: '+255 689 555 666', time: '2 days ago' },
              { name: 'East Africa Foods', type: 'Business', phone: '+254 711 444 888', time: '3 days ago' },
            ].map((rc, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-1.5 last:border-0">
                <div>
                  <p className="font-bold text-slate-900 text-[11px]">{rc.name}</p>
                  <p className="text-[10px] text-slate-400">{rc.phone}</p>
                </div>
                <div className="text-right">
                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600">{rc.type}</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">{rc.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomersCRMView;

