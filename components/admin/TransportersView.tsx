'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store-context';
import { Transporter } from '@/lib/types';
import { RouteMap } from '@/components/common/RouteMap';
import {
  Truck,
  Users,
  Search,
  Plus,
  Download,
  Filter,
  Star,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  ShieldCheck,
} from 'lucide-react';

export function TransportersView() {
  const { transporters } = useAppStore();
  const [selectedTransporter, setSelectedTransporter] = useState<Transporter>(transporters[0] || {} as Transporter);
  const [activeSubTab, setActiveSubTab] = useState<'Transporters' | 'Drivers' | 'Vehicles' | 'Assignments'>('Transporters');
  const [detailTab, setDetailTab] = useState<'Vehicles' | 'Drivers' | 'Shipments' | 'Documents' | 'Performance'>('Vehicles');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransporters = transporters.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.companyName.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Transporters & Fleets</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Carrier networks, linehaul fleets, cross-border trucks, and vehicle tracking
          </p>
        </div>

        <button
          onClick={() => alert('Add Transporter onboarding form opened...')}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transporter</span>
        </button>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 14%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Total Transporters</span>
            <p className="text-xl font-black text-slate-900">48</p>
            <span className="text-[10px] text-slate-400">partner carriers</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">88%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Active Transporters</span>
            <p className="text-xl font-black text-slate-900">42</p>
            <span className="text-[10px] text-slate-400">contracted</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 12%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Total Drivers</span>
            <p className="text-xl font-black text-slate-900">320</p>
            <span className="text-[10px] text-slate-400">licensed drivers</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 10%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Total Vehicles</span>
            <p className="text-xl font-black text-slate-900">156</p>
            <span className="text-[10px] text-slate-400">registered fleet</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 5%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">On Deliveries</span>
            <p className="text-xl font-black text-slate-900">64</p>
            <span className="text-[10px] text-slate-400">active on road</span>
          </div>
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
        {(['Transporters', 'Drivers', 'Vehicles', 'Assignments'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === tab
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Table (7 cols) & Right Map/Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Transporters Table */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transporters..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-9 pr-3 text-xs"
              />
            </div>
            <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <Download className="h-3 w-3" />
              <span>Export</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Company Name</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Region</th>
                  <th className="py-2.5 px-3">Drivers</th>
                  <th className="py-2.5 px-3">Vehicles</th>
                  <th className="py-2.5 px-3">Active</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTransporters.map((t) => {
                  const isSelected = selectedTransporter.id === t.id;
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTransporter(t)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 text-blue-700 font-bold text-[10px]">
                            {t.companyName.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 leading-tight">{t.companyName}</p>
                            <span className="text-[10px] text-slate-400">{t.code}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">
                        <p className="font-medium text-slate-800">{t.contactPhone}</p>
                        <p className="text-slate-400 text-[10px] truncate max-w-[120px]">{t.contactEmail}</p>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{t.region}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{t.driversCount}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{t.vehiclesCount}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">{t.activeShipmentsCount}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            t.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-xs text-slate-500 bg-slate-50/50">
            <span>Showing 1 - {filteredTransporters.length} of 48 transporters</span>
            <div className="flex items-center gap-1">
              <button className="rounded p-1 border border-slate-200"><ChevronLeft className="h-3.5 w-3.5" /></button>
              <button className="rounded px-2.5 py-0.5 bg-blue-600 text-white font-bold">1</button>
              <button className="rounded px-2.5 py-0.5 border border-slate-200">2</button>
              <button className="rounded p-1 border border-slate-200"><ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Right Column: Transporter Coverage Map & Details */}
        <div className="lg:col-span-5 space-y-4">
          {/* Coverage Map */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Transporter Coverage Map</h3>
              <span className="text-[10px] text-blue-600 font-medium">Regional Corridors</span>
            </div>
            <RouteMap variant="transporter" heightClass="h-52" />
          </div>

          {/* Transporter Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-sm shadow-xs">
                  {selectedTransporter.companyName.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-extrabold text-slate-900">{selectedTransporter.companyName}</h3>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                      Active
                    </span>
                  </div>
                  <span className="rounded bg-blue-50 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                    Preferred Partner
                  </span>
                </div>
              </div>
              <button className="rounded border border-slate-200 p-1 text-slate-600 hover:bg-slate-50">
                <Edit className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400">Phone</span>
                <p className="font-semibold text-slate-900">{selectedTransporter.contactPhone}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Email</span>
                <p className="font-semibold text-slate-900 truncate">{selectedTransporter.contactEmail}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Hub Region</span>
                <p className="font-semibold text-slate-900">{selectedTransporter.region}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">On-Time Rate</span>
                <p className="font-semibold text-emerald-700">{selectedTransporter.onTimeRatePercent}%</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 text-center text-xs">
              <div className="rounded bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">Drivers</span>
                <p className="font-black text-slate-900">{selectedTransporter.driversCount}</p>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">Vehicles</span>
                <p className="font-black text-slate-900">{selectedTransporter.vehiclesCount}</p>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">Rating</span>
                <p className="font-black text-amber-600 flex items-center justify-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {selectedTransporter.rating}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransportersView;

