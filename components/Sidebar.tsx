'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store-context';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Truck,
  Warehouse,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  QrCode,
  Map,
  Grid3X3,
  Download,
  Repeat,
  Compass,
  FileText,
  Navigation,
  CheckCircle,
  History,
  PhoneCall,
  Boxes,
  Send,
  CalendarCheck,
  ShieldCheck,
  Building2,
  Box,
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function Sidebar({ activeTab: propActiveTab, setActiveTab: propSetActiveTab }: SidebarProps = {}) {
  const store = useAppStore();
  const activeTab = propActiveTab || store.activeTab;
  const setActiveTab = propSetActiveTab || store.setActiveTab;
  const { currentRole, setCurrentRole } = store;
  const [warehouseOpen, setWarehouseOpen] = useState(true);
  const [shipmentsOpen, setShipmentsOpen] = useState(true);


  // Common item class
  const getItemClasses = (tabId: string) => {
    const isActive = activeTab === tabId;
    return `group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
      isActive
        ? 'bg-blue-600 text-white font-semibold shadow-xs'
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;
  };

  const getSubItemClasses = (tabId: string) => {
    const isActive = activeTab === tabId;
    return `flex items-center gap-2 rounded-md py-1.5 pl-8 pr-3 text-xs transition-colors ${
      isActive
        ? 'bg-blue-600/90 text-white font-semibold'
        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
    }`;
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[235px] flex-col bg-[#0b132b] text-white select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800/80 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
          <Box className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold tracking-wider text-white">SWAHIVO</span>
          <span className="text-[10px] font-medium text-blue-400 -mt-1 tracking-wider uppercase">
            Logistics OS
          </span>
        </div>
      </div>

      {/* Role Indicator Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 text-[11px] text-slate-400">
        <span className="truncate">
          {currentRole === 'admin' && 'Admin Workspace'}
          {currentRole === 'warehouse_manager' && 'Warehouse Facility'}
          {currentRole === 'customer' && 'Customer Portal'}
          {currentRole === 'driver' && 'Driver Portal'}
          {currentRole === 'landing' && 'Public Website'}
        </span>
        <button
          onClick={() => setCurrentRole(currentRole === 'admin' ? 'warehouse_manager' : currentRole === 'warehouse_manager' ? 'customer' : currentRole === 'customer' ? 'driver' : 'admin')}
          className="text-blue-400 hover:text-blue-300 text-[10px] underline font-medium"
          title="Switch view"
        >
          Switch
        </button>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {/* ================= ADMIN NAVIGATION ================= */}
        {currentRole === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={getItemClasses('dashboard')}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </button>

            {/* Shipments Menu Group */}
            <div>
              <button
                onClick={() => setShipmentsOpen(!shipmentsOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="h-4 w-4" />
                  <span>Shipments</span>
                </div>
                {shipmentsOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
              </button>

              {shipmentsOpen && (
                <div className="mt-1 space-y-0.5">
                  <button onClick={() => setActiveTab('shipments')} className={getSubItemClasses('shipments')}>
                    <span>All Shipments</span>
                  </button>
                  <button onClick={() => setActiveTab('create-shipment')} className={getSubItemClasses('create-shipment')}>
                    <span>Create Shipment</span>
                  </button>
                </div>
              )}
            </div>

            {/* Warehouse Management Group */}
            <div>
              <button
                onClick={() => setWarehouseOpen(!warehouseOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2.5">
                  <Warehouse className="h-4 w-4" />
                  <span>Warehouse</span>
                </div>
                {warehouseOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
              </button>

              {warehouseOpen && (
                <div className="mt-1 space-y-0.5">
                  <button onClick={() => setActiveTab('warehouse-overview')} className={getSubItemClasses('warehouse-overview')}>
                    <span>Overview</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-map-designer')} className={getSubItemClasses('warehouse-map-designer')}>
                    <span>Map Designer</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-racks-bins')} className={getSubItemClasses('warehouse-racks-bins')}>
                    <span>Racks & Bins</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-receiving')} className={getSubItemClasses('warehouse-receiving')}>
                    <span>Receiving & Putaway</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-qr-labels')} className={getSubItemClasses('warehouse-qr-labels')}>
                    <span>QR Labels & Scanner</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-locate-package')} className={getSubItemClasses('warehouse-locate-package')}>
                    <span>Locate Package</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getSubItemClasses('warehouse-transfers-picking')}>
                    <span>Transfers & Picking</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-cycle-counts')} className={getSubItemClasses('warehouse-cycle-counts')}>
                    <span>Cycle Counts</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-reports')} className={getSubItemClasses('warehouse-reports')}>
                    <span>Reports</span>
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setActiveTab('customers')} className={getItemClasses('customers')}>
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4" />
                <span>Customers</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('transporters')} className={getItemClasses('transporters')}>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4" />
                <span>Transporters</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('billing')} className={getItemClasses('billing')}>
              <div className="flex items-center gap-2.5">
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('analytics')} className={getItemClasses('analytics')}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('settings')} className={getItemClasses('settings')}>
              <div className="flex items-center gap-2.5">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </button>
          </>
        )}

        {/* ================= WAREHOUSE MANAGER NAVIGATION ================= */}
        {currentRole === 'warehouse_manager' && (
          <>
            <button onClick={() => setActiveTab('warehouse-overview')} className={getItemClasses('warehouse-overview')}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Warehouse Dashboard</span>
              </div>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              OPERATIONS
            </div>

            <button onClick={() => setActiveTab('warehouse-receiving')} className={getItemClasses('warehouse-receiving')}>
              <div className="flex items-center gap-2.5">
                <Download className="h-4 w-4" />
                <span>Receiving & Putaway</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-racks-bins')} className={getItemClasses('warehouse-racks-bins')}>
              <div className="flex items-center gap-2.5">
                <Grid3X3 className="h-4 w-4" />
                <span>Racks & Bins</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-qr-labels')} className={getItemClasses('warehouse-qr-labels')}>
              <div className="flex items-center gap-2.5">
                <QrCode className="h-4 w-4" />
                <span>QR Labels & Scanner</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-locate-package')} className={getItemClasses('warehouse-locate-package')}>
              <div className="flex items-center gap-2.5">
                <Compass className="h-4 w-4" />
                <span>Locate Package</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getItemClasses('warehouse-transfers-picking')}>
              <div className="flex items-center gap-2.5">
                <Repeat className="h-4 w-4" />
                <span>Transfers & Picking</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-cycle-counts')} className={getItemClasses('warehouse-cycle-counts')}>
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="h-4 w-4" />
                <span>Cycle Counts</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-map-designer')} className={getItemClasses('warehouse-map-designer')}>
              <div className="flex items-center gap-2.5">
                <Map className="h-4 w-4" />
                <span>Map Designer</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-reports')} className={getItemClasses('warehouse-reports')}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4" />
                <span>Reports</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('settings')} className={getItemClasses('settings')}>
              <div className="flex items-center gap-2.5">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </button>
          </>
        )}

        {/* ================= CUSTOMER PORTAL NAVIGATION ================= */}
        {currentRole === 'customer' && (
          <>
            <button onClick={() => setActiveTab('customer-overview')} className={getItemClasses('customer-overview')}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customer-bookings')} className={getItemClasses('customer-bookings')}>
              <div className="flex items-center gap-2.5">
                <Warehouse className="h-4 w-4" />
                <span>Warehouse Bookings</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customer-inventory')} className={getItemClasses('customer-inventory')}>
              <div className="flex items-center gap-2.5">
                <Boxes className="h-4 w-4" />
                <span>My Inventory</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customer-dispatch')} className={getItemClasses('customer-dispatch')}>
              <div className="flex items-center gap-2.5">
                <Send className="h-4 w-4" />
                <span>Request Dispatch</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customer-shipments')} className={getItemClasses('customer-shipments')}>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4" />
                <span>My Shipments</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customer-create-shipment')} className={getItemClasses('customer-create-shipment')}>
              <div className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4" />
                <span>Create Shipment</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customer-track')} className={getItemClasses('customer-track')}>
              <div className="flex items-center gap-2.5">
                <Compass className="h-4 w-4" />
                <span>Track Shipment</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customer-invoices')} className={getItemClasses('customer-invoices')}>
              <div className="flex items-center gap-2.5">
                <CreditCard className="h-4 w-4" />
                <span>Payments & Invoices</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('settings')} className={getItemClasses('settings')}>
              <div className="flex items-center gap-2.5">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </button>
          </>
        )}

        {/* ================= DRIVER PORTAL NAVIGATION ================= */}
        {currentRole === 'driver' && (
          <>
            <button onClick={() => setActiveTab('driver-dashboard')} className={getItemClasses('driver-dashboard')}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('driver-assignments')} className={getItemClasses('driver-assignments')}>
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4" />
                <span>My Assignments</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                6
              </span>
            </button>

            <button onClick={() => setActiveTab('driver-pickups')} className={getItemClasses('driver-pickups')}>
              <div className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4" />
                <span>Scheduled Pickups</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button onClick={() => setActiveTab('driver-active')} className={getItemClasses('driver-active')}>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4" />
                <span>Active Shipments</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                2
              </span>
            </button>

            <button onClick={() => setActiveTab('driver-deliveries')} className={getItemClasses('driver-deliveries')}>
              <div className="flex items-center gap-2.5">
                <Navigation className="h-4 w-4" />
                <span>Deliveries</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('driver-scan')} className={getItemClasses('driver-scan')}>
              <div className="flex items-center gap-2.5">
                <QrCode className="h-4 w-4" />
                <span>Scan Package</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('driver-confirmation')} className={getItemClasses('driver-confirmation')}>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4" />
                <span>Delivery Confirmation</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('driver-history')} className={getItemClasses('driver-history')}>
              <div className="flex items-center gap-2.5">
                <History className="h-4 w-4" />
                <span>Trip History</span>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Driver Help Box (visible on driver mode as shown in Driver Dashboard screenshot) */}
      {currentRole === 'driver' && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-xs font-bold text-white">Need Help?</p>
              <p className="text-[10px] text-slate-400">Contact dispatch team</p>
            </div>
          </div>
          <button className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/60 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700">
            <PhoneCall className="h-3.5 w-3.5 text-blue-400" />
            <span>Call Support</span>
          </button>
        </div>
      )}

      {/* Customer Help Box */}
      {currentRole === 'customer' && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <p className="text-xs font-bold text-white">Need Help?</p>
          <p className="text-[10px] text-slate-400">Contact our support team</p>
          <button className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700">
            Contact Support
          </button>
        </div>
      )}

      {/* Footer Status */}
      <div className="border-t border-slate-800/80 p-3 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">v2.4.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;

