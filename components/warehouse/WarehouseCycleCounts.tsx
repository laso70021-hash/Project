'use client';

import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Scan,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Building2,
  Home,
  Bell,
  MoreHorizontal,
  ChevronRight,
  Truck,
  Eye,
  Check,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useAppStore } from '@/lib/store-context';

export default function WarehouseCycleCounts() {
  const { packages, racks } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'locations' | 'discrepancies' | 'history'>('overview');
  const [selectedWarehouse, setSelectedWarehouse] = useState('WH001 - Main Warehouse');
  const [selectedFloor, setSelectedFloor] = useState('F01 - Ground Floor');
  const [selectedZone, setSelectedZone] = useState('Zone A');
  const [listTab, setListTab] = useState<'all' | 'discrepancies' | 'notCounted' | 'empty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeScanMode, setActiveScanMode] = useState<'camera' | 'manual'>('camera');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [quickFilter, setQuickFilter] = useState<'all' | 'discrepancies' | 'notCounted' | 'empty'>('all');

  // Scanner state
  const [scannedPkg, setScannedPkg] = useState({
    id: 'PKG-1042',
    expectedLoc: 'WH001-A-R05-L02-B03',
    currentLoc: 'WH001-A-R05-L02-B03',
    result: 'Matched',
    details: 'Electronics (25 kg)',
  });
  const [manualInput, setManualInput] = useState('');

  // Count Summary Donut data
  const countSummaryData = [
    { name: 'Matched', value: 1102, pct: '88%', color: '#10b981' },
    { name: 'Discrepancies', value: 32, pct: '2.6%', color: '#ef4444' },
    { name: 'Not Counted', value: 98, pct: '8%', color: '#64748b' },
    { name: 'Empty', value: 16, pct: '1.4%', color: '#94a3b8' },
  ];

  // Cycle Count Locations table data
  const locationRows = [
    {
      code: 'WH001-A-R05-L02-B03',
      zone: 'A',
      rack: 'R05',
      level: 'L02',
      bin: 'B03',
      expected: 1,
      counted: 1,
      status: 'Matched',
      lastScanned: '12 Jun 2024, 10:32 AM',
      scannedBy: 'John M.',
    },
    {
      code: 'WH001-A-R05-L02-B02',
      zone: 'A',
      rack: 'R05',
      level: 'L02',
      bin: 'B02',
      expected: 2,
      counted: 1,
      status: 'Discrepancy',
      lastScanned: '12 Jun 2024, 10:28 AM',
      scannedBy: 'John M.',
    },
    {
      code: 'WH001-A-R05-L02-B01',
      zone: 'A',
      rack: 'R05',
      level: 'L02',
      bin: 'B01',
      expected: 1,
      counted: 0,
      status: 'Not Counted',
      lastScanned: '-',
      scannedBy: '-',
    },
    {
      code: 'WH001-A-R04-L01-B03',
      zone: 'A',
      rack: 'R04',
      level: 'L01',
      bin: 'B03',
      expected: 0,
      counted: 0,
      status: 'Empty',
      lastScanned: '12 Jun 2024, 09:15 AM',
      scannedBy: 'Amina K.',
    },
    {
      code: 'WH001-A-R03-L03-B02',
      zone: 'A',
      rack: 'R03',
      level: 'L03',
      bin: 'B02',
      expected: 3,
      counted: 3,
      status: 'Matched',
      lastScanned: '12 Jun 2024, 09:05 AM',
      scannedBy: 'Amina K.',
    },
    {
      code: 'WH001-A-R02-L01-B04',
      zone: 'A',
      rack: 'R02',
      level: 'L01',
      bin: 'B04',
      expected: 2,
      counted: 2,
      status: 'Matched',
      lastScanned: '12 Jun 2024, 08:45 AM',
      scannedBy: 'Fatma H.',
    },
  ];

  // Recent Discrepancies list
  const recentDiscrepancies = [
    { pkgId: 'PKG-1043', expected: 'R05-L02-B02', found: 'R05-L02-B01', status: 'Misplaced' },
    { pkgId: 'PKG-1047', expected: 'R03-L01-B03', found: 'R03-L01-B02', status: 'Misplaced' },
    { pkgId: 'PKG-1051', expected: 'R06-L03-B01', found: 'Not Found', status: 'Missing' },
    { pkgId: 'PKG-1058', expected: 'R04-L02-B02', found: 'R04-L02-B03', status: 'Misplaced' },
  ];

  // Racks layout in the warehouse floor map
  const floorRacksCol1 = ['R01', 'R02', 'R03', 'R04'];
  const floorRacksCol2 = ['R05', 'R06', 'R07', 'R08'];

  // Filtered rows for list tab
  const filteredLocationRows = locationRows.filter((loc) => {
    if (listTab === 'discrepancies' && loc.status !== 'Discrepancy') return false;
    if (listTab === 'notCounted' && loc.status !== 'Not Counted') return false;
    if (listTab === 'empty' && loc.status !== 'Empty') return false;
    if (quickFilter === 'discrepancies' && loc.status !== 'Discrepancy') return false;
    if (quickFilter === 'notCounted' && loc.status !== 'Not Counted') return false;
    if (quickFilter === 'empty' && loc.status !== 'Empty') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return loc.code.toLowerCase().includes(q) || loc.rack.toLowerCase().includes(q);
    }
    return true;
  });

  const handleScanNext = () => {
    const nextPkg = {
      id: `PKG-${Math.floor(1000 + Math.random() * 900)}`,
      expectedLoc: 'WH001-A-R05-L02-B03',
      currentLoc: 'WH001-A-R05-L02-B03',
      result: 'Matched',
      details: 'Industrial Spares (18 kg)',
    };
    setScannedPkg(nextPkg);
  };

  return (
    <div className="space-y-4 p-5 max-w-[1600px] mx-auto text-slate-800">
      {/* Top Header Bar with Breadcrumb and Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Home className="h-4 w-4 text-slate-400" />
          <span>Warehouse</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-bold text-slate-900">Cycle Counts</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Warehouse Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-slate-700 font-medium">
            <span>{selectedWarehouse}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          {/* Floor Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-slate-700 font-medium">
            <span>{selectedFloor}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          {/* Notification bell */}
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

      {/* 5 KPI Metric Cards + New Cycle Count CTA */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Locations */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Locations</div>
            <div className="text-xl font-black text-slate-900 leading-tight">1,248</div>
          </div>
        </div>

        {/* Card 2: Counted */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Counted</div>
            <div className="text-xl font-black text-slate-900 leading-tight">1,102</div>
            <span className="text-[10px] font-bold text-emerald-600">88%</span>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pending</div>
            <div className="text-xl font-black text-slate-900 leading-tight">98</div>
            <span className="text-[10px] font-bold text-amber-600">8%</span>
          </div>
        </div>

        {/* Card 4: Discrepancies */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Discrepancies</div>
            <div className="text-xl font-black text-slate-900 leading-tight">32</div>
            <span className="text-[10px] font-bold text-red-600">2.6%</span>
          </div>
        </div>

        {/* Card 5: Active Count */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active Count</div>
            <div className="text-sm font-black text-slate-900 leading-tight">Zone A</div>
            <span className="text-[9px] text-slate-400">Started 12 Jun 2024</span>
          </div>
        </div>

        {/* CTA: New Cycle Count Button */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center col-span-2 md:col-span-1">
          <button
            onClick={() => alert('Start New Cycle Count Audit Session')}
            className="w-full h-full min-h-[48px] rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Cycle Count</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Active Count
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'locations'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Location List
        </button>
        <button
          onClick={() => setActiveTab('discrepancies')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'discrepancies'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Discrepancies
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          History
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Floor Map (Cycle Count Progress) & Cycle Count Lists */}
        <div className="lg:col-span-8 space-y-4">
          {/* Panel 1: Warehouse Floor Map (Cycle Count Progress) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            {/* Map Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Warehouse Floor Map (Cycle Count Progress)</h2>

              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700 font-medium">
                  <span>{selectedZone}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
                <div className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700 font-medium">
                  <span>Status View</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.4))}
                  className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 text-[11px]"
                >
                  <ZoomIn className="h-3 w-3" />
                  <span>Zoom In</span>
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.8))}
                  className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 text-[11px]"
                >
                  <ZoomOut className="h-3 w-3" />
                  <span>Zoom Out</span>
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 text-[11px]"
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>Fit</span>
                </button>
              </div>
            </div>

            {/* Warehouse Floor Visual Plan matching screenshot */}
            <div className="relative w-full h-[360px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-3 select-none flex items-center justify-center">
              <div
                className="relative w-full h-full max-w-[800px] transition-transform duration-200 flex"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Left Warehouse Area: Receiving Area & Loading Zone with Truck */}
                <div className="w-1/4 h-full border-r border-slate-700/80 pr-2 flex flex-col justify-between">
                  {/* Receiving Area */}
                  <div className="h-[48%] rounded-lg bg-slate-800/80 border border-slate-700 p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Receiving Area</span>
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      <div className="h-4 w-4 rounded bg-amber-500/30 border border-amber-500/50" />
                      <div className="h-4 w-4 rounded bg-amber-500/50 border border-amber-500/70" />
                      <div className="h-4 w-4 rounded bg-amber-500/30 border border-amber-500/50" />
                    </div>
                  </div>

                  {/* Loading Zone with Delivery Truck */}
                  <div className="h-[48%] rounded-lg bg-slate-800/80 border border-slate-700 p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Loading Zone</span>
                    <div className="relative w-16 h-24 bg-white/95 rounded-md shadow-lg border border-slate-400 flex flex-col items-center p-1">
                      <div className="w-full h-6 bg-slate-800 rounded-t-xs text-white text-[8px] flex items-center justify-center font-bold">
                        TZ TRUCK
                      </div>
                      <div className="flex-1 w-full bg-slate-200 my-1 rounded-2xs border border-slate-300 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-slate-700" />
                      </div>
                      <div className="flex justify-between w-full px-1">
                        <span className="h-2 w-2 rounded-full bg-slate-900" />
                        <span className="h-2 w-2 rounded-full bg-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Warehouse Area: Two Columns of Racks (R01-R04 and R05-R08) */}
                <div className="w-2/4 h-full px-3 flex justify-between gap-3">
                  {/* Column 1: R01 to R04 */}
                  <div className="flex-1 h-full grid grid-cols-4 gap-2">
                    {floorRacksCol1.map((rId, idx) => (
                      <div
                        key={rId}
                        className="h-full bg-slate-800/90 rounded-lg border border-slate-700 p-1 flex flex-col justify-between"
                      >
                        <div className="text-[9px] font-bold text-blue-400 text-center">{rId}</div>
                        {/* Rack Bins Grid with Colored status dots */}
                        <div className="flex-1 my-1 grid grid-cols-2 gap-1 py-1">
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" title="Counted: Matched" />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" title="Counted: Matched" />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" title="Counted: Matched" />
                          <div
                            className={`rounded-2xs ${idx === 1 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'} shadow-xs`}
                            title={idx === 1 ? 'Discrepancy' : 'Counted: Matched'}
                          />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" />
                          <div className="rounded-2xs bg-slate-600" title="Not Counted" />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" />
                        </div>
                        <div className="text-[7px] text-slate-400 text-center font-mono">100%</div>
                      </div>
                    ))}
                  </div>

                  {/* Column 2: R05 to R08 */}
                  <div className="flex-1 h-full grid grid-cols-4 gap-2">
                    {floorRacksCol2.map((rId, idx) => (
                      <div
                        key={rId}
                        className="h-full bg-slate-800/90 rounded-lg border border-slate-700 p-1 flex flex-col justify-between"
                      >
                        <div className="text-[9px] font-bold text-blue-400 text-center">{rId}</div>
                        {/* Rack Bins Grid */}
                        <div className="flex-1 my-1 grid grid-cols-2 gap-1 py-1">
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" />
                          <div
                            className={`rounded-2xs ${idx === 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'} shadow-xs`}
                            title={idx === 0 ? 'Discrepancy' : 'Matched'}
                          />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" />
                          <div className="rounded-2xs bg-slate-600" title="Not Counted" />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" />
                          <div className="rounded-2xs bg-slate-700" title="Empty" />
                          <div className="rounded-2xs bg-emerald-500 shadow-xs" />
                        </div>
                        <div className="text-[7px] text-slate-400 text-center font-mono">85%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Warehouse Area: Office, Packing Area, Dispatch Area */}
                <div className="w-1/4 h-full border-l border-slate-700/80 pl-2 flex flex-col justify-between">
                  <div className="h-[30%] rounded-lg bg-slate-800/80 border border-slate-700 p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Office</span>
                  </div>
                  <div className="h-[30%] rounded-lg bg-slate-800/80 border border-slate-700 p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Packing Area</span>
                  </div>
                  <div className="h-[32%] rounded-lg bg-slate-800/80 border border-slate-700 p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Dispatch Area</span>
                    <span className="text-[8px] text-slate-400 mt-1">Forklift Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Legend & Progress Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              {/* Location Status Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                <div className="text-[11px] font-bold text-slate-800">Location Status</div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 text-[11px]">Counted (Matched)</span>
                  <span className="font-bold text-slate-900 text-[11px]">1,102</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="text-slate-600 text-[11px]">Discrepancy</span>
                  <span className="font-bold text-slate-900 text-[11px]">32</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                  <span className="text-slate-600 text-[11px]">Not Counted</span>
                  <span className="font-bold text-slate-900 text-[11px]">98</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="text-slate-600 text-[11px]">Empty Location</span>
                  <span className="font-bold text-slate-900 text-[11px]">16</span>
                </div>
              </div>

              {/* Progress Bar & Quick Filters */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs font-bold text-slate-700">Progress</span>
                    <span className="text-xs font-black text-slate-900">88%</span>
                  </div>
                  <div className="text-[9px] text-slate-400">1,102 of 1,248 locations counted</div>
                </div>
                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>

            {/* Quick Filter Buttons matching screenshot */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 mr-1">Quick Filters:</span>
              <button
                onClick={() => setQuickFilter(quickFilter === 'discrepancies' ? 'all' : 'discrepancies')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border transition ${
                  quickFilter === 'discrepancies'
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'bg-white border-red-200 text-red-600 hover:bg-red-50/50'
                }`}
              >
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span>Show Discrepancies</span>
              </button>
              <button
                onClick={() => setQuickFilter(quickFilter === 'notCounted' ? 'all' : 'notCounted')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                  quickFilter === 'notCounted'
                    ? 'bg-slate-100 border-slate-400 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Show Not Counted</span>
              </button>
              <button
                onClick={() => setQuickFilter(quickFilter === 'empty' ? 'all' : 'empty')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                  quickFilter === 'empty'
                    ? 'bg-slate-100 border-slate-400 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Show Empty</span>
              </button>
            </div>
          </div>

          {/* Panel 2: Cycle Count Lists */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Cycle Count Lists</h2>

            {/* Filter Tabs matching screenshot */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2 text-xs">
              <button
                onClick={() => setListTab('all')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  listTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Locations (1,248)
              </button>
              <button
                onClick={() => setListTab('discrepancies')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  listTab === 'discrepancies' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Discrepancies (32)
              </button>
              <button
                onClick={() => setListTab('notCounted')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  listTab === 'notCounted' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Not Counted (98)
              </button>
              <button
                onClick={() => setListTab('empty')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  listTab === 'empty' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Empty Locations (16)
              </button>
            </div>

            {/* Search and Dropdowns bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by location code, package ID or rack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-slate-700 font-medium">
                  <span>All Zones</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
                <div className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-slate-700 font-medium">
                  <span>All Racks</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
                <div className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-slate-700 font-medium">
                  <span>All Statuses</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
                <button
                  onClick={() => alert('Exporting cycle count report as CSV...')}
                  className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-slate-700 font-bold hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                    <th className="pb-2 w-6">
                      <input type="checkbox" className="rounded text-blue-600" />
                    </th>
                    <th className="pb-2">Location Code</th>
                    <th className="pb-2">Zone</th>
                    <th className="pb-2">Rack</th>
                    <th className="pb-2">Level</th>
                    <th className="pb-2">Bin</th>
                    <th className="pb-2 text-center">Expected Packages</th>
                    <th className="pb-2 text-center">Counted Packages</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Last Scanned</th>
                    <th className="pb-2">Scanned By</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLocationRows.map((row) => (
                    <tr key={row.code} className="hover:bg-slate-50/70">
                      <td className="py-2.5">
                        <input type="checkbox" className="rounded text-blue-600" />
                      </td>
                      <td className="py-2.5 font-mono font-bold text-slate-900 text-[11px]">{row.code}</td>
                      <td className="py-2.5 text-slate-600">{row.zone}</td>
                      <td className="py-2.5 font-semibold text-slate-800">{row.rack}</td>
                      <td className="py-2.5 text-slate-600">{row.level}</td>
                      <td className="py-2.5 text-slate-600">{row.bin}</td>
                      <td className="py-2.5 text-center font-mono font-semibold text-slate-700">{row.expected}</td>
                      <td className="py-2.5 text-center font-mono font-semibold text-slate-900">{row.counted}</td>
                      <td className="py-2.5">
                        {row.status === 'Matched' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Matched
                          </span>
                        )}
                        {row.status === 'Discrepancy' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Discrepancy
                          </span>
                        )}
                        {row.status === 'Not Counted' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Not Counted
                          </span>
                        )}
                        {row.status === 'Empty' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Empty
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-slate-600 text-[11px]">{row.lastScanned}</td>
                      <td className="py-2.5 text-slate-800 font-medium">{row.scannedBy}</td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold">
                            View
                          </button>
                          <MoreHorizontal className="h-3.5 w-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Scan for Cycle Count, Count Summary, Recent Discrepancies */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Scan for Cycle Count */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Scan for Cycle Count</h2>

            {/* Scan Package vs Manual Entry Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveScanMode('camera')}
                className={`py-1.5 rounded-md text-center transition ${
                  activeScanMode === 'camera' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Scan Package
              </button>
              <button
                onClick={() => setActiveScanMode('manual')}
                className={`py-1.5 rounded-md text-center transition ${
                  activeScanMode === 'manual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Manual Entry
              </button>
            </div>

            {/* Live Camera Viewfinder Simulation with PKG-1042 package */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
              {/* Cardboard box background representation */}
              <div className="absolute inset-0 bg-[#c89d66] flex items-center justify-center p-4">
                <div className="relative w-36 h-36 bg-white rounded-lg shadow-md p-2 flex flex-col items-center justify-center border border-slate-300">
                  {/* Real QR SVG */}
                  <svg className="w-20 h-20" viewBox="0 0 29 29" fill="none">
                    <rect width="29" height="29" fill="white" />
                    <rect x="2" y="2" width="7" height="7" fill="black" />
                    <rect x="3" y="3" width="5" height="5" fill="white" />
                    <rect x="4" y="4" width="3" height="3" fill="black" />
                    <rect x="20" y="2" width="7" height="7" fill="black" />
                    <rect x="21" y="3" width="5" height="5" fill="white" />
                    <rect x="22" y="4" width="3" height="3" fill="black" />
                    <rect x="2" y="20" width="7" height="7" fill="black" />
                    <rect x="3" y="21" width="5" height="5" fill="white" />
                    <rect x="4" y="22" width="3" height="3" fill="black" />
                    <rect x="11" y="4" width="2" height="2" fill="black" />
                    <rect x="15" y="4" width="2" height="2" fill="black" />
                    <rect x="11" y="11" width="7" height="7" fill="black" />
                    <rect x="13" y="13" width="3" height="3" fill="white" />
                    <rect x="20" y="12" width="2" height="4" fill="black" />
                    <rect x="12" y="20" width="4" height="2" fill="black" />
                    <rect x="22" y="22" width="3" height="3" fill="black" />
                  </svg>
                  <span className="font-mono font-bold text-xs text-slate-900 mt-1">PKG-1042</span>
                </div>
              </div>

              {/* Viewfinder brackets overlay */}
              <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl-sm" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr-sm" />
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl-sm" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br-sm" />
                </div>
              </div>
            </div>

            {/* Scanned Result Card */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Package Scanned</span>
                  <div className="font-mono font-black text-slate-900 text-xs">{scannedPkg.id}</div>
                </div>
              </div>

              <div className="divide-y divide-emerald-100 text-[11px] pt-1">
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Expected Location</span>
                  <span className="font-mono font-bold text-slate-900">{scannedPkg.expectedLoc}</span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Current Scan Location</span>
                  <span className="font-mono font-bold text-slate-900">{scannedPkg.currentLoc}</span>
                </div>
                <div className="py-1 flex justify-between items-center">
                  <span className="text-slate-500">Result</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {scannedPkg.result}
                  </span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Package</span>
                  <span className="font-medium text-slate-800">{scannedPkg.details}</span>
                </div>
              </div>
            </div>

            {/* Action CTA: Scan Next Package */}
            <button
              onClick={handleScanNext}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Scan className="h-4 w-4" />
              <span>Scan Next Package</span>
            </button>
          </div>

          {/* Card 2: Count Summary Donut Chart */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Count Summary</h2>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Donut */}
              <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countSummaryData}
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {countSummaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-black text-slate-900">1,248</span>
                  <span className="text-[7px] text-slate-400 font-semibold uppercase">Total Locations</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-xs w-full">
                {countSummaryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
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

          {/* Card 3: Recent Discrepancies */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Recent Discrepancies</h2>
              <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentDiscrepancies.map((d) => (
                <div key={d.pkgId} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-slate-900 text-[11px]">{d.pkgId}</div>
                    <div className="text-[10px] text-slate-500">
                      Expected: <span className="font-mono font-medium text-slate-700">{d.expected}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Found: <span className="font-mono font-medium text-slate-700">{d.found}</span>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
