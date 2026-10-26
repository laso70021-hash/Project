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
  Building2,
  Clock,
  ChevronRight as ChevronRightIcon,
  Check,
} from 'lucide-react';

export function TransportersView() {
  const { transporters } = useAppStore();
  const [selectedTransporter, setSelectedTransporter] = useState<Transporter>(
    transporters[0] || {
      id: 'TRP-001',
      code: 'TRP-001',
      companyName: 'Swahivo Transport Co.',
      contactPerson: 'Mohammed Bakari',
      contactPhone: '+255 712 345 678',
      contactEmail: 'info@swahivotrans.co.tz',
      region: 'Dar es Salaam',
      driversCount: 45,
      vehiclesCount: 22,
      activeShipmentsCount: 18,
      rating: 4.8,
      onTimeRatePercent: 96,
      status: 'Active',
      coverageCities: ['Dar es Salaam', 'Morogoro', 'Dodoma', 'Zanzibar'],
      operatingLicenceNumber: 'TCAA-TR-9481',
      totalShipmentsCompleted: 1240,
    }
  );
  const [activeSubTab, setActiveSubTab] = useState<'Transporters' | 'Drivers' | 'Vehicles' | 'Assignments'>('Transporters');
  const [detailTab, setDetailTab] = useState<'Vehicles' | 'Drivers' | 'Shipments' | 'Documents' | 'Performance'>('Vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All Vehicle Types');

  // Transporter records matching reference screenshot
  const referenceTransporters = [
    {
      id: 'TRP-001',
      code: 'TRP-001',
      companyName: 'Swahivo Transport Co.',
      contactPhone: '+255 712 345 678',
      contactEmail: 'info@swahivotrans.co.tz',
      region: 'Dar es Salaam',
      driversCount: 45,
      vehiclesCount: 22,
      activeShipmentsCount: 18,
      status: 'Active',
      rating: 4.8,
      reviewsCount: 36,
      onTimeRatePercent: 96,
      totalShipments: 1240,
      joinedDate: '12 Jan 2023',
    },
    {
      id: 'TRP-002',
      code: 'TRP-002',
      companyName: 'Zanzibar Express',
      contactPhone: '+255 777 123 456',
      contactEmail: 'ops@zanzibarexpress.co.tz',
      region: 'Zanzibar',
      driversCount: 32,
      vehiclesCount: 18,
      activeShipmentsCount: 12,
      status: 'Active',
      rating: 4.7,
      reviewsCount: 28,
      onTimeRatePercent: 94,
      totalShipments: 890,
      joinedDate: '05 Mar 2023',
    },
    {
      id: 'TRP-003',
      code: 'TRP-003',
      companyName: 'Rift Valley Carriers',
      contactPhone: '+254 700 222 444',
      contactEmail: 'dispatch@riftvalley.co.ke',
      region: 'Nairobi',
      driversCount: 58,
      vehiclesCount: 25,
      activeShipmentsCount: 14,
      status: 'Active',
      rating: 4.9,
      reviewsCount: 52,
      onTimeRatePercent: 98,
      totalShipments: 1650,
      joinedDate: '18 Nov 2022',
    },
    {
      id: 'TRP-004',
      code: 'TRP-004',
      companyName: 'Tanzania Haulage Ltd',
      contactPhone: '+255 689 555 666',
      contactEmail: 'contact@tanhaulage.co.tz',
      region: 'Arusha',
      driversCount: 28,
      vehiclesCount: 14,
      activeShipmentsCount: 8,
      status: 'Active',
      rating: 4.6,
      reviewsCount: 22,
      onTimeRatePercent: 92,
      totalShipments: 720,
      joinedDate: '24 Apr 2023',
    },
    {
      id: 'TRP-005',
      code: 'TRP-005',
      companyName: 'Kigali Logistics',
      contactPhone: '+250 788 321 098',
      contactEmail: 'info@kigalilogistics.rw',
      region: 'Kigali',
      driversCount: 22,
      vehiclesCount: 11,
      activeShipmentsCount: 6,
      status: 'Active',
      rating: 4.7,
      reviewsCount: 19,
      onTimeRatePercent: 95,
      totalShipments: 540,
      joinedDate: '10 Aug 2023',
    },
    {
      id: 'TRP-006',
      code: 'TRP-006',
      companyName: 'Mwanza Transport',
      contactPhone: '+255 767 444 999',
      contactEmail: 'ops@mwanzatrans.co.tz',
      region: 'Mwanza',
      driversCount: 18,
      vehiclesCount: 9,
      activeShipmentsCount: 4,
      status: 'Suspended',
      rating: 4.1,
      reviewsCount: 14,
      onTimeRatePercent: 84,
      totalShipments: 380,
      joinedDate: '15 Sep 2023',
    },
    {
      id: 'TRP-007',
      code: 'TRP-007',
      companyName: 'Nairobi Freight Ltd',
      contactPhone: '+254 711 987 654',
      contactEmail: 'freight@nairobi.co.ke',
      region: 'Nairobi',
      driversCount: 36,
      vehiclesCount: 20,
      activeShipmentsCount: 10,
      status: 'Active',
      rating: 4.8,
      reviewsCount: 34,
      onTimeRatePercent: 96,
      totalShipments: 980,
      joinedDate: '02 Feb 2023',
    },
    {
      id: 'TRP-008',
      code: 'TRP-008',
      companyName: 'East Africa Movers',
      contactPhone: '+255 756 111 333',
      contactEmail: 'info@eamovers.co.tz',
      region: 'Dodoma',
      driversCount: 16,
      vehiclesCount: 8,
      activeShipmentsCount: 3,
      status: 'Active',
      rating: 4.5,
      reviewsCount: 17,
      onTimeRatePercent: 90,
      totalShipments: 410,
      joinedDate: '19 Oct 2023',
    },
  ];

  // Specific vehicles for TRP-001 matching reference screenshot
  const trp001Vehicles = [
    { num: 1, plate: 'TZ 1234', type: 'DAF Truck', capacity: '20,000 kg', status: 'Active', location: 'Dar es Salaam' },
    { num: 2, plate: 'TZ 5678', type: 'Hino Truck', capacity: '15,000 kg', status: 'On Delivery', location: 'Arusha' },
    { num: 3, plate: 'TZ 9012', type: 'Isuzu Van', capacity: '5,000 kg', status: 'Active', location: 'Zanzibar' },
    { num: 4, plate: 'TZ 3456', type: 'Toyota Pickup', capacity: '1,500 kg', status: 'Maintenance', location: 'Workshop' },
    { num: 5, plate: 'TZ 7890', type: 'Scania Truck', capacity: '25,000 kg', status: 'Active', location: 'Dodoma' },
  ];

  // Specific drivers for TRP-001 matching reference screenshot
  const trp001Drivers = [
    { num: 1, name: 'Mohammed Ali', license: 'TZD-001', phone: '+255 712 001 001', status: 'Active', avatar: 'MA' },
    { num: 2, name: 'Salim Hassan', license: 'TZD-002', phone: '+255 715 002 002', status: 'Active', avatar: 'SH' },
    { num: 3, name: 'Juma Mwinyi', license: 'TZD-003', phone: '+255 715 003 003', status: 'On Trip', avatar: 'JM' },
    { num: 4, name: 'Amina Suleiman', license: 'TZD-004', phone: '+255 715 004 004', status: 'Active', avatar: 'AS' },
    { num: 5, name: 'Omar Khamis', license: 'TZD-005', phone: '+255 715 005 005', status: 'Resting', avatar: 'OK' },
  ];

  // Recent Activities matching reference screenshot
  const trp001Activities = [
    { num: 1, dateTime: '12 Jun 2024, 10:32 AM', activity: 'Assigned shipment', ref: 'SHP-88321', by: 'John M.' },
    { num: 2, dateTime: '12 Jun 2024, 09:15 AM', activity: 'Driver checked in', ref: 'DRV-001', by: 'Salim H.' },
    { num: 3, dateTime: '11 Jun 2024, 04:28 PM', activity: 'Vehicle maintenance', ref: 'TZ 3456', by: 'System' },
    { num: 4, dateTime: '11 Jun 2024, 02:14 PM', activity: 'Completed delivery', ref: 'SHP-88310', by: 'Omar K.' },
    { num: 5, dateTime: '10 Jun 2024, 11:05 AM', activity: 'New vehicle added', ref: 'TZ 7890', by: 'Admin' },
  ];

  const filteredTransporters = referenceTransporters.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!t.companyName.toLowerCase().includes(q) && !t.code.toLowerCase().includes(q) && !t.region.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'All Statuses' && t.status !== statusFilter) return false;
    if (regionFilter !== 'All Regions' && t.region !== regionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4 p-5 bg-[#f8fafc]">
      {/* 5 Top KPI Cards + Add Transporter Button Matching Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-stretch">
        {/* KPI 1 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 14%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Total Transporters</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">48</span>
              <span className="text-[10px] text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">88%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Active Transporters</span>
            <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">42</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 12%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Total Drivers</span>
            <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">320</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 10%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">Total Vehicles</span>
            <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">156</p>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">&uarr; 5%</span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-slate-500">On Deliveries</span>
            <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">64</p>
          </div>
        </div>

        {/* Action Button: Add Transporter */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => alert('Add Transporter onboarding form opened...')}
            className="w-full h-full min-h-[92px] flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transporter</span>
          </button>
        </div>
      </div>

      {/* Sub navigation tabs: Transporters, Drivers, Vehicles, Assignments */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
        {(['Transporters', 'Drivers', 'Vehicles', 'Assignments'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Table (7 cols) & Right Map/Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Transporters Table */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden flex flex-col justify-between">
          {/* Table Toolbar */}
          <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-white">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transporters..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-8 pr-3 text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700"
              >
                <option>All Regions</option>
                <option>Dar es Salaam</option>
                <option>Zanzibar</option>
                <option>Nairobi</option>
                <option>Arusha</option>
                <option>Kigali</option>
                <option>Mwanza</option>
                <option>Dodoma</option>
              </select>

              <select
                value={vehicleTypeFilter}
                onChange={(e) => setVehicleTypeFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700"
              >
                <option>All Vehicle Types</option>
                <option>Trucks</option>
                <option>Vans</option>
                <option>Trailers</option>
              </select>

              <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input type="checkbox" className="rounded text-blue-600 h-3.5 w-3.5" />
                  </th>
                  <th className="py-2.5 px-2 w-8">#</th>
                  <th className="py-2.5 px-3">Company Name</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Region</th>
                  <th className="py-2.5 px-2 text-center">Drivers</th>
                  <th className="py-2.5 px-2 text-center">Vehicles</th>
                  <th className="py-2.5 px-2 text-center">Active Shipments</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTransporters.map((t, idx) => {
                  const isSelected = selectedTransporter.code === t.code;
                  return (
                    <tr
                      key={t.code}
                      onClick={() => setSelectedTransporter(t as any)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded text-blue-600 h-3.5 w-3.5" />
                      </td>
                      <td className="py-2.5 px-2 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-black text-[10px]">
                            {t.companyName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{t.companyName}</p>
                            <span className="text-[10px] text-slate-400 font-mono">{t.code}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">
                        <p className="font-semibold text-slate-800">{t.contactPhone}</p>
                        <p className="text-slate-400 text-[10px] truncate max-w-[130px]">{t.contactEmail}</p>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{t.region}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-900">{t.driversCount}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-900">{t.vehiclesCount}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-blue-700">{t.activeShipmentsCount}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            t.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <button className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                          •••
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Matching Screenshot */}
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 bg-white">
            <span>Showing 1 - {filteredTransporters.length} of 48 transporters</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="rounded p-1 border border-slate-200 hover:bg-slate-50"><ChevronLeft className="h-3.5 w-3.5" /></button>
                <button className="rounded px-2.5 py-0.5 bg-blue-600 text-white font-bold">1</button>
                <button className="rounded px-2.5 py-0.5 border border-slate-200 hover:bg-slate-50">2</button>
                <button className="rounded px-2.5 py-0.5 border border-slate-200 hover:bg-slate-50">3</button>
                <button className="rounded px-2.5 py-0.5 border border-slate-200 hover:bg-slate-50">4</button>
                <button className="rounded px-2.5 py-0.5 border border-slate-200 hover:bg-slate-50">5</button>
                <button className="rounded p-1 border border-slate-200 hover:bg-slate-50"><ChevronRight className="h-3.5 w-3.5" /></button>
              </div>
              <span className="text-[11px] text-slate-400 ml-2">Rows per page: 10</span>
            </div>
          </div>
        </div>

        {/* Right Column: Transporter Coverage Map & Transporter Details */}
        <div className="lg:col-span-5 space-y-4">
          {/* Transporter Coverage Map Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-900">Transporter Coverage Map</h3>
                <ChevronRightIcon className="h-3 w-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">
                Regional Routes
              </span>
            </div>
            <RouteMap variant="transporter" heightClass="h-64" />
          </div>

          {/* Transporter Details Card Matching Screenshot */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-xs">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{selectedTransporter.companyName}</h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.2 text-[9px] font-bold text-emerald-700 border border-emerald-200/60">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-400">{selectedTransporter.code}</span>
                    <span className="rounded bg-blue-50 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                      Preferred Partner
                    </span>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Edit className="h-3 w-3 text-slate-500" />
                <span>Edit</span>
              </button>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900">{selectedTransporter.contactPhone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900 truncate">{selectedTransporter.contactEmail}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900">{selectedTransporter.region}, Tanzania</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500">Joined: 12 Jan 2023</span>
              </div>
            </div>

            {/* Detailed summary statistics */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">Drivers</span>
                <p className="font-black text-slate-900 text-sm">{selectedTransporter.driversCount}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">Vehicles</span>
                <p className="font-black text-slate-900 text-sm">{selectedTransporter.vehiclesCount}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">Active Shipments</span>
                <p className="font-black text-blue-700 text-sm">{selectedTransporter.activeShipmentsCount}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">Total Shipments</span>
                <p className="font-black text-slate-900 text-sm">1,240</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">On-Time Rate</span>
                <p className="font-black text-emerald-700 text-sm">{selectedTransporter.onTimeRatePercent}%</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="text-[10px] text-slate-400">Rating</span>
                <p className="font-black text-amber-600 text-sm flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{selectedTransporter.rating} (36)</span>
                </p>
              </div>
            </div>

            {/* Tabs for details */}
            <div className="flex items-center gap-1 border-t border-slate-100 pt-2">
              {(['Vehicles', 'Drivers', 'Shipments', 'Documents', 'Performance'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setDetailTab(t)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
                    detailTab === t
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 3 Columns Matching Reference Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
        {/* Card 1: Vehicles (TRP-001) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <h3 className="text-xs font-bold text-slate-900">Vehicles ({selectedTransporter.code})</h3>
              <button className="text-[11px] font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-[10px] font-semibold text-slate-400">
                  <tr>
                    <th className="py-1 px-1.5">#</th>
                    <th className="py-1 px-2">Plate No.</th>
                    <th className="py-1 px-2">Type</th>
                    <th className="py-1 px-2">Capacity</th>
                    <th className="py-1 px-2">Status</th>
                    <th className="py-1 px-2">Current Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {trp001Vehicles.map((v) => (
                    <tr key={v.num} className="hover:bg-slate-50/60">
                      <td className="py-1.5 px-1.5 text-slate-400 font-mono">{v.num}</td>
                      <td className="py-1.5 px-2 font-bold text-slate-900">{v.plate}</td>
                      <td className="py-1.5 px-2 text-slate-600">{v.type}</td>
                      <td className="py-1.5 px-2 font-mono text-[10px] text-slate-500">{v.capacity}</td>
                      <td className="py-1.5 px-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full mr-1 ${
                            v.status === 'Active'
                              ? 'bg-emerald-500'
                              : v.status === 'On Delivery'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span className="text-[10px] font-medium">{v.status}</span>
                      </td>
                      <td className="py-1.5 px-2 text-slate-600">{v.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card 2: Drivers (TRP-001) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <h3 className="text-xs font-bold text-slate-900">Drivers ({selectedTransporter.code})</h3>
              <button className="text-[11px] font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-[10px] font-semibold text-slate-400">
                  <tr>
                    <th className="py-1 px-1.5">#</th>
                    <th className="py-1 px-2">Name</th>
                    <th className="py-1 px-2">License No.</th>
                    <th className="py-1 px-2">Phone</th>
                    <th className="py-1 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {trp001Drivers.map((d) => (
                    <tr key={d.num} className="hover:bg-slate-50/60">
                      <td className="py-1.5 px-1.5 text-slate-400 font-mono">{d.num}</td>
                      <td className="py-1.5 px-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[9px]">
                            {d.avatar}
                          </div>
                          <span className="font-semibold text-slate-900">{d.name}</span>
                        </div>
                      </td>
                      <td className="py-1.5 px-2 font-mono text-[10px] text-slate-500">{d.license}</td>
                      <td className="py-1.5 px-2 text-slate-600">{d.phone}</td>
                      <td className="py-1.5 px-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full mr-1 ${
                            d.status === 'Active'
                              ? 'bg-emerald-500'
                              : d.status === 'On Trip'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="text-[10px] font-medium">{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card 3: Recent Activities */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <h3 className="text-xs font-bold text-slate-900">Recent Activities</h3>
              <button className="text-[11px] font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-[10px] font-semibold text-slate-400">
                  <tr>
                    <th className="py-1 px-1.5">#</th>
                    <th className="py-1 px-2">Date & Time</th>
                    <th className="py-1 px-2">Activity</th>
                    <th className="py-1 px-2">Reference</th>
                    <th className="py-1 px-2">By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {trp001Activities.map((a) => (
                    <tr key={a.num} className="hover:bg-slate-50/60">
                      <td className="py-1.5 px-1.5 text-slate-400 font-mono">{a.num}</td>
                      <td className="py-1.5 px-2 text-slate-500">{a.dateTime}</td>
                      <td className="py-1.5 px-2 font-medium text-slate-800">{a.activity}</td>
                      <td className="py-1.5 px-2 font-mono text-[10px] text-blue-600 font-bold">{a.ref}</td>
                      <td className="py-1.5 px-2 text-slate-600">{a.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransportersView;
