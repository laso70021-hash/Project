'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store-context';
import { Shipment } from '@/lib/types';
import { RouteMap } from '@/components/common/RouteMap';
import {
  Package,
  Search,
  Filter,
  Download,
  Plus,
  Copy,
  Printer,
  FileText,
  UserCheck,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  Phone,
} from 'lucide-react';

interface ShipmentsViewProps {
  onNavigateToCreate?: () => void;
}

export function ShipmentsView({ onNavigateToCreate }: ShipmentsViewProps) {
  const { shipments, updateShipmentStatus, assignDriver, drivers } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'transit' | 'out' | 'delivered' | 'cancelled'>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(shipments[0] || {} as Shipment);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [detailTab, setDetailTab] = useState<'overview' | 'timeline' | 'items' | 'documents'>('overview');
  const [isCopied, setIsCopied] = useState(false);

  // Status Filter Counts
  const countAll = shipments.length;
  const countPending = shipments.filter(s => s.status === 'Pending Pickup' || s.status === 'Assigned').length;
  const countTransit = shipments.filter(s => s.status === 'In Transit').length;
  const countOut = shipments.filter(s => s.status === 'Out for Delivery').length;
  const countDelivered = shipments.filter(s => s.status === 'Delivered').length;
  const countCancelled = shipments.filter(s => s.status === 'Cancelled').length;

  // Filtered shipments
  const filteredShipments = shipments.filter((s) => {
    // Tab filter
    if (activeTab === 'pending' && s.status !== 'Pending Pickup' && s.status !== 'Assigned') return false;
    if (activeTab === 'transit' && s.status !== 'In Transit') return false;
    if (activeTab === 'out' && s.status !== 'Out for Delivery') return false;
    if (activeTab === 'delivered' && s.status !== 'Delivered') return false;
    if (activeTab === 'cancelled' && s.status !== 'Cancelled') return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        s.trackingNumber.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        (s.referenceNumber && s.referenceNumber.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Service filter
    if (selectedService !== 'All' && s.serviceType !== selectedService) return false;

    return true;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Shipments</span>
            <span>&rsaquo;</span>
            <span className="text-slate-800 font-semibold">All Shipments</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Shipment Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting all shipment records as CSV...')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </button>
          {onNavigateToCreate && (
            <button
              onClick={onNavigateToCreate}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Shipment</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row (6 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Total Shipments</span>
          <p className="text-lg font-black text-slate-900 mt-1">{countAll}</p>
          <span className="text-[10px] text-emerald-600 font-medium">&uarr; 12% vs last month</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Pickup Pending</span>
          <p className="text-lg font-black text-slate-900 mt-1">{countPending}</p>
          <span className="text-[10px] text-amber-600 font-medium">&uarr; 8%</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">In Transit</span>
          <p className="text-lg font-black text-slate-900 mt-1">{countTransit}</p>
          <span className="text-[10px] text-blue-600 font-medium">&uarr; 18%</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Out for Delivery</span>
          <p className="text-lg font-black text-slate-900 mt-1">{countOut}</p>
          <span className="text-[10px] text-purple-600 font-medium">&uarr; 14%</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Delivered</span>
          <p className="text-lg font-black text-slate-900 mt-1">{countDelivered}</p>
          <span className="text-[10px] text-emerald-600 font-medium">&uarr; 22%</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Cancelled</span>
          <p className="text-lg font-black text-slate-900 mt-1">{countCancelled}</p>
          <span className="text-[10px] text-rose-600 font-medium">&uarr; 6%</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: `All Shipments (${countAll})` },
          { id: 'pending', label: `Pending Pickup (${countPending})` },
          { id: 'transit', label: `In Transit (${countTransit})` },
          { id: 'out', label: `Out for Delivery (${countOut})` },
          { id: 'delivered', label: `Delivered (${countDelivered})` },
          { id: 'cancelled', label: `Cancelled (${countCancelled})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Table (7 cols) & Right Detail Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Filter Bar & Shipments Table */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shipments..."
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700"
            >
              <option value="All">All Services</option>
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Storage + Shipping">Storage + Shipping</option>
              <option value="Freight">Freight</option>
            </select>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Tracking No.</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">From &rarr; To</th>
                    <th className="py-2.5 px-3">Weight</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Assigned To</th>
                    <th className="py-2.5 px-3">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredShipments.map((s, idx) => {
                    const isSelected = selectedShipment.id === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedShipment(s)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                          {s.trackingNumber}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 truncate max-w-[120px]">
                          {s.customerName}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                            {s.serviceType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px] truncate max-w-[140px]">
                          {s.origin} &rarr; {s.destination}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {s.weightKg} kg
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
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
                        <td className="py-2.5 px-3 font-medium text-slate-800 text-[11px]">
                          {s.assignedDriverName || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {s.expectedDeliveryDate.includes('T')
                            ? s.expectedDeliveryDate.split('T')[0]
                            : s.expectedDeliveryDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination footer */}
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 bg-slate-50/50">
              <span>Showing 1 - {filteredShipments.length} of {countAll} shipments</span>
              <div className="flex items-center gap-1">
                <button className="rounded p-1 border border-slate-200 hover:bg-white"><ChevronLeft className="h-3.5 w-3.5" /></button>
                <button className="rounded px-2.5 py-0.5 bg-blue-600 text-white font-bold">1</button>
                <button className="rounded px-2.5 py-0.5 hover:bg-white border border-slate-200">2</button>
                <button className="rounded p-1 border border-slate-200 hover:bg-white"><ChevronRight className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Permanent Shipment Details Panel */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                  selectedShipment.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {selectedShipment.status}
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                {selectedShipment.trackingNumber}
              </span>
              <button
                onClick={() => handleCopy(selectedShipment.trackingNumber)}
                className="text-slate-400 hover:text-slate-600"
                title="Copy tracking number"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {isCopied && <span className="text-[10px] text-emerald-600">Copied!</span>}
            </div>

            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>

          {/* Details Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-100 text-xs">
            {(['overview', 'timeline', 'items', 'documents'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDetailTab(t)}
                className={`pb-2 px-2.5 font-bold capitalize transition-colors ${
                  detailTab === t
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {detailTab === 'overview' && (
            <div className="space-y-3.5 text-xs">
              {/* Customer & Route Details */}
              <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-slate-50 p-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Customer</span>
                  <p className="font-bold text-slate-900">{selectedShipment.customerName}</p>
                  <p className="text-[10px] text-slate-500">{selectedShipment.customerCode}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Service Type</span>
                  <p className="font-bold text-slate-900">{selectedShipment.serviceType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">From</span>
                  <p className="font-bold text-slate-800">{selectedShipment.origin}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">To</span>
                  <p className="font-bold text-slate-800">{selectedShipment.destination}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Weight / Volume</span>
                  <p className="font-bold text-slate-900">{selectedShipment.weightKg} kg / 0.12 m&sup3;</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Reference No.</span>
                  <p className="font-bold text-slate-900">{selectedShipment.referenceNumber || 'N/A'}</p>
                </div>
              </div>

              {/* Assigned Driver Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                    {selectedShipment.assignedDriverName ? selectedShipment.assignedDriverName.slice(0, 2) : 'DR'}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Assigned Driver</span>
                    <p className="font-extrabold text-slate-900">{selectedShipment.assignedDriverName || 'No Driver Assigned'}</p>
                    <p className="text-[10px] text-slate-500">{selectedShipment.assignedDriverPhone || '+255 712 345 678'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-medium">Vehicle</span>
                  <p className="font-mono font-bold text-slate-800">{selectedShipment.assignedVehiclePlate || 'TZ 1234 AB'}</p>
                </div>
              </div>

              {/* Cost & Payment Breakdown */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1 font-bold text-slate-900">
                  <span>Cost & Payment</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                    {selectedShipment.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Base Shipping Fee</span>
                  <span>TZS {selectedShipment.baseFee?.toLocaleString() || '400,000'}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Storage Fee (3 days)</span>
                  <span>TZS {selectedShipment.storageFee?.toLocaleString() || '150,000'}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Handling Fee</span>
                  <span>TZS {selectedShipment.handlingFee?.toLocaleString() || '50,000'}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Insurance</span>
                  <span>TZS {selectedShipment.insuranceFee?.toLocaleString() || '20,000'}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1 font-extrabold text-slate-900 text-sm">
                  <span>Total Amount</span>
                  <span className="text-blue-700">TZS {selectedShipment.totalAmountTzs?.toLocaleString() || '620,000'}</span>
                </div>
              </div>

              {/* Quick Actions matching screenshot */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => alert(`Printing Shipping Label for ${selectedShipment.trackingNumber}...`)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" />
                  <span>Print Label</span>
                </button>
                <button
                  onClick={() => alert(`Generating Waybill for ${selectedShipment.trackingNumber}...`)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  <span>Waybill</span>
                </button>
                <button
                  onClick={() => {
                    const nextStatus = selectedShipment.status === 'Pending Pickup' ? 'In Transit' : selectedShipment.status === 'In Transit' ? 'Out for Delivery' : 'Delivered';
                    updateShipmentStatus(selectedShipment.id, nextStatus);
                    setSelectedShipment(prev => ({ ...prev, status: nextStatus }));
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-[11px] font-bold text-white hover:bg-blue-700 shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Advance Status</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Timeline */}
          {detailTab === 'timeline' && (
            <div className="space-y-3">
              <div className="h-44">
                <RouteMap variant="customer" heightClass="h-44" />
              </div>
              <div className="relative pl-5 space-y-3 border-l-2 border-slate-200 ml-2 text-xs">
                {selectedShipment.events?.map((ev) => (
                  <div key={ev.id} className="relative">
                    <div className="absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <p className="font-extrabold text-slate-900">{ev.title}</p>
                    <p className="text-[11px] text-slate-500">{ev.location} &bull; {ev.performedBy}</p>
                    <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Items */}
          {detailTab === 'items' && (
            <div className="space-y-2 text-xs">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Item Name</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2 text-right">Value (TZS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedShipment.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2 font-semibold text-slate-800">{item.name}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.weightKg} kg</td>
                        <td className="p-2 text-right font-mono">{item.valueTzs?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Documents */}
          {detailTab === 'documents' && (
            <div className="space-y-2 text-xs">
              {[
                { title: 'Shipping Label (Thermal 100x150)', ext: 'PDF' },
                { title: 'Waybill & Consignment Note', ext: 'PDF' },
                { title: 'Commercial Storage Invoice', ext: 'PDF' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-800 text-[11px]">{doc.title}</p>
                      <span className="text-[9px] text-slate-400">{doc.ext} File &bull; Ready</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading ${doc.title}...`)}
                    className="flex items-center gap-1 rounded bg-white px-2 py-1 text-[10px] font-semibold text-blue-700 border border-slate-200 shadow-2xs hover:bg-slate-100"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShipmentsView;

