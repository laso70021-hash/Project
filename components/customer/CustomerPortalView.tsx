'use client';

import React, { useState } from 'react';
import {
  Package,
  Boxes,
  Truck,
  Plus,
  ArrowUpRight,
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
} from 'lucide-react';
import { useApp } from '@/lib/store-context';
import RouteMap from '@/components/common/RouteMap';

export default function CustomerPortalView() {
  const { customers, packages, shipments, bookings, invoices, createStorageBooking, setActiveTab } = useApp();

  // Active customer: ABC Company Ltd (CUS-0001)
  const activeCustomer = customers.find((c) => c.customerCode === 'CUS-0001') || customers[0];

  const [activeCustomerTab, setActiveCustomerTab] = useState<'inventory' | 'bookings' | 'shipments' | 'invoices'>('inventory');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSpaceSqM, setBookingSpaceSqM] = useState(25);
  const [bookingDays, setBookingDays] = useState(30);
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Customer filtered data
  const myPackages = packages.filter((p) => p.customerId === activeCustomer.id || p.customerName === activeCustomer.name);
  const myShipments = shipments.filter((s) => s.customerId === activeCustomer.id || s.customerName === activeCustomer.name);
  const myBookings = bookings.filter((b) => b.customerId === activeCustomer.id || b.customerName === activeCustomer.name);
  const myInvoices = invoices.filter((i) => i.customerId === activeCustomer.id || i.customerName === activeCustomer.name);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    createStorageBooking({
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      warehouseId: 'WH001',
      warehouseName: 'WH001 - Main Warehouse (Kurasini Port)',
      reservedSpaceSqM: bookingSpaceSqM,
      monthlyRateTzs: bookingSpaceSqM * 25000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + bookingDays * 86400000).toISOString().split('T')[0],
      status: 'Active',
      itemsStoredCount: 0,
    });
    setBookingSuccess(`Storage space of ${bookingSpaceSqM} m² successfully reserved in WH001!`);
    setShowBookingModal(false);
    setTimeout(() => setBookingSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Customer Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Customer Self-Service Portal
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-200">
              {activeCustomer.customerCode}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{activeCustomer.name}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Primary Contact: {activeCustomer.contactPerson} • {activeCustomer.phone} • {activeCustomer.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBookingModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <Boxes className="w-3.5 h-3.5" /> Book Warehouse Storage
          </button>
          <button
            onClick={() => setActiveTab('create_shipment')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create Shipment
          </button>
        </div>
      </div>

      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* 4 Customer KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">My Stored Packages</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{myPackages.length} Pkgs</div>
          <div className="text-[11px] text-blue-600 font-medium">WH001 Kurasini Warehouse</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active Shipments</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{myShipments.length} Orders</div>
          <div className="text-[11px] text-emerald-600 font-medium">Tracking milestones active</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Storage Bookings</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{myBookings.length} Active</div>
          <div className="text-[11px] text-purple-600 font-medium">
            {myBookings.reduce((acc, b) => acc + (b.reservedSpaceSqM || 0), 0)} m² allocated
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Outstanding Balance</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            TZS {(myInvoices.filter((i) => i.status === 'Pending').reduce((acc, i) => acc + (i.amountTzs || 0), 0) || 0).toLocaleString()}

          </div>
          <div className="text-[11px] text-amber-600 font-medium">Due in 14 days</div>
        </div>
      </div>

      {/* Customer Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveCustomerTab('inventory')}
          className={`pb-3 px-1 border-b-2 transition ${
            activeCustomerTab === 'inventory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Stored Warehouse Inventory ({myPackages.length})
        </button>
        <button
          onClick={() => setActiveCustomerTab('shipments')}
          className={`pb-3 px-1 border-b-2 transition ${
            activeCustomerTab === 'shipments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Shipments & Live Tracking ({myShipments.length})
        </button>
        <button
          onClick={() => setActiveCustomerTab('bookings')}
          className={`pb-3 px-1 border-b-2 transition ${
            activeCustomerTab === 'bookings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Storage Space Bookings ({myBookings.length})
        </button>
        <button
          onClick={() => setActiveCustomerTab('invoices')}
          className={`pb-3 px-1 border-b-2 transition ${
            activeCustomerTab === 'invoices'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Invoices & Receipts ({myInvoices.length})
        </button>
      </div>

      {/* Tab 1: Stored Inventory */}
      {activeCustomerTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Physical Packages Currently in SWAHIVO WH001 Warehouse
            </h3>
            <span className="text-xs text-slate-500">
              Verified daily via barcode cycle audits
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Package ID</th>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4">Storage Location</th>
                  <th className="py-3 px-4">Weight & Dimensions</th>
                  <th className="py-3 px-4">Check-In Date</th>
                  <th className="py-3 px-4">Storage Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {myPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{pkg.packageId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{pkg.itemName || pkg.productName}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold border border-slate-200">
                        {pkg.locationCode || pkg.currentLocationCode || 'In Transit'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {pkg.weightKg} kg • {pkg.dimensions || '40x30x25cm'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{pkg.receivedAt}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {pkg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveTab('create_shipment')}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs"
                      >
                        Request Dispatch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Shipments & Tracking */}
      {activeCustomerTab === 'shipments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Consignment Progress</h3>
            {myShipments.map((shp) => (
              <div key={shp.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-600">{shp.trackingNumber}</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {shp.status}
                  </span>
                </div>
                <div className="text-slate-800 font-semibold">
                  {shp.origin} → {shp.destination}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Driver: {shp.assignedDriverName || 'Ali Hassan (DRV-001)'} • Vehicle: {shp.assignedVehiclePlate || 'TZ 1234 AB'}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Transit Corridor Map</h3>
            <div className="h-64 border border-slate-200 rounded-lg overflow-hidden">
              <RouteMap />
            </div>
          </div>
        </div>
      )}

      {/* Storage Booking Modal / Dialog */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Book Warehouse Storage Space</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Facility</label>
                <input
                  type="text"
                  readOnly
                  value="WH001 - Main Warehouse (Kurasini Port, Dar es Salaam)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Floor Area Space (m²)</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={bookingSpaceSqM}
                  onChange={(e) => setBookingSpaceSqM(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Duration (Days)</label>
                <select
                  value={bookingDays}
                  onChange={(e) => setBookingDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium"
                >
                  <option value={15}>15 Days</option>
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={60}>60 Days (2 Months)</option>
                  <option value={90}>90 Days (Quarterly)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Estimated Storage Fee:</span>
                  <span>TZS {(bookingSpaceSqM * 25000).toLocaleString()} / month</span>
                </div>
                <div className="text-[11px] text-blue-700">Rate: 25,000 TZS per m² with 24/7 CCTV & insurance</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
