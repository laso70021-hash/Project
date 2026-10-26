'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  MapPin,
  ClipboardList,
  DollarSign,
  UserCheck,
  Bell,
  Activity,
  Layers,
  ArrowRightLeft,
  LifeBuoy,
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
  const [financeOpen, setFinanceOpen] = useState(true);
  const [visualToolsOpen, setVisualToolsOpen] = useState(true);

  // Styling helpers
  const getItemClasses = (tabId: string) => {
    const isActive = activeTab === tabId;
    return `group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
      isActive
        ? 'bg-blue-600 text-white font-semibold shadow-xs'
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;
  };

  const getSubItemClasses = (tabId: string) => {
    const isActive = activeTab === tabId;
    return `flex w-full items-center gap-2 rounded-md py-1.5 pl-8 pr-3 text-xs transition-colors ${
      isActive
        ? 'bg-blue-600/90 text-white font-semibold'
        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
    }`;
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[235px] flex-col bg-[#0b132b] text-white select-none">
      {/* Brand Header with Authentic SWAHIVO Light Logo */}
      <div className="flex h-16 items-center border-b border-slate-800/80 px-4">
        <button
          onClick={() => {
            setCurrentRole('landing');
          }}
          className="relative h-8 w-44 hover:opacity-90 transition text-left"
          title="Return to Public Landing Page"
        >
          <Image
            src="/assets/aistudio/light_bd56867f.png"
            alt="SWAHIVO Logistics OS"
            fill
            className="object-contain object-left"
            priority
          />
        </button>
      </div>

      {/* Role Indicator Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800/60 text-[11px] text-slate-300">
        <span className="font-semibold truncate">
          {currentRole === 'admin' && 'Admin Workspace'}
          {currentRole === 'warehouse_manager' && 'Warehouse Facility'}
          {currentRole === 'customer' && 'Customer Portal'}
          {currentRole === 'driver' && 'Driver Portal'}
          {currentRole === 'landing' && 'Public Website'}
        </span>
        <button
          onClick={() => {
            if (currentRole === 'admin') setCurrentRole('warehouse_manager');
            else if (currentRole === 'warehouse_manager') setCurrentRole('customer');
            else if (currentRole === 'customer') setCurrentRole('driver');
            else setCurrentRole('admin');
          }}
          className="text-blue-400 hover:text-blue-300 text-[10px] font-bold underline transition"
        >
          Switch
        </button>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {/* ========================================================= */}
        {/* ================= ADMIN NAVIGATION ====================== */}
        {/* ========================================================= */}
        {currentRole === 'admin' && (
          <>
            <div className="pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              MAIN
            </div>

            <button onClick={() => setActiveTab('dashboard')} className={getItemClasses('dashboard')}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              OPERATIONS
            </div>

            <button onClick={() => setActiveTab('shipments')} className={getItemClasses('shipments')}>
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4" />
                <span>Shipments</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('create-shipment')} className={getItemClasses('create-shipment')}>
              <div className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4" />
                <span>Create Shipment</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('pickup-management')} className={getItemClasses('pickup-management')}>
              <div className="flex items-center gap-2.5">
                <Send className="h-4 w-4" />
                <span>Pickup Management</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('delivery-management')} className={getItemClasses('delivery-management')}>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4" />
                <span>Delivery Management</span>
              </div>
            </button>

            {/* Warehouse Management Accordion */}
            <div>
              <button
                onClick={() => setWarehouseOpen(!warehouseOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2.5">
                  <Warehouse className="h-4 w-4" />
                  <span>Warehouse Management</span>
                </div>
                {warehouseOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
              </button>

              {warehouseOpen && (
                <div className="mt-1 space-y-0.5">
                  <button onClick={() => setActiveTab('warehouse-overview')} className={getSubItemClasses('warehouse-overview')}>
                    <span>Warehouses</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-bookings')} className={getSubItemClasses('warehouse-bookings')}>
                    <span>Storage Bookings</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-receiving')} className={getSubItemClasses('warehouse-receiving')}>
                    <span>Receiving</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-overview')} className={getSubItemClasses('warehouse-inventory')}>
                    <span>Inventory</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getSubItemClasses('warehouse-transfers-picking')}>
                    <span>Warehouse &rarr; Shipping</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getSubItemClasses('warehouse-movements')}>
                    <span>Stock Movements</span>
                  </button>
                  <button onClick={() => setActiveTab('billing')} className={getSubItemClasses('warehouse-rates')}>
                    <span>Storage Rates</span>
                  </button>
                  <button onClick={() => setActiveTab('warehouse-racks-bins')} className={getSubItemClasses('warehouse-racks-bins')}>
                    <span>Locations &amp; Bins</span>
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
                <span>Drivers &amp; Vehicles</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('transporters')} className={getItemClasses('routes-coverage')}>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4" />
                <span>Routes &amp; Coverage</span>
              </div>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              FINANCE
            </div>

            <button onClick={() => setActiveTab('billing')} className={getItemClasses('quotes-pricing')}>
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4" />
                <span>Quotes &amp; Pricing</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('billing')} className={getItemClasses('billing')}>
              <div className="flex items-center gap-2.5">
                <CreditCard className="h-4 w-4" />
                <span>Invoices &amp; Payments</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('analytics')} className={getItemClasses('analytics')}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4" />
                <span>Reports &amp; Analytics</span>
              </div>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SYSTEM
            </div>

            <button onClick={() => setActiveTab('customers')} className={getItemClasses('users-permissions')}>
              <div className="flex items-center gap-2.5">
                <UserCheck className="h-4 w-4" />
                <span>Users &amp; Permissions</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('notifications')} className={getItemClasses('notifications')}>
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('analytics')} className={getItemClasses('audit-logs')}>
              <div className="flex items-center gap-2.5">
                <Activity className="h-4 w-4" />
                <span>Audit Logs</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('settings')} className={getItemClasses('settings')}>
              <div className="flex items-center gap-2.5">
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </div>
            </button>
          </>
        )}

        {/* ========================================================= */}
        {/* ============= WAREHOUSE MANAGER NAVIGATION ============== */}
        {/* ========================================================= */}
        {currentRole === 'warehouse_manager' && (
          <>
            <button onClick={() => setActiveTab('warehouse-overview')} className={getItemClasses('warehouse-overview')}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Warehouse Dashboard</span>
              </div>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              OPERATIONS
            </div>

            <button onClick={() => setActiveTab('warehouse-bookings')} className={getItemClasses('warehouse-bookings')}>
              <div className="flex items-center gap-2.5">
                <Boxes className="h-4 w-4" />
                <span>Storage Bookings</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                12
              </span>
            </button>

            <button onClick={() => setActiveTab('warehouse-receiving')} className={getItemClasses('warehouse-receiving')}>
              <div className="flex items-center gap-2.5">
                <Download className="h-4 w-4" />
                <span>Expected Arrivals</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                5
              </span>
            </button>

            <button onClick={() => setActiveTab('warehouse-receiving')} className={getItemClasses('warehouse-receiving-putaway')}>
              <div className="flex items-center gap-2.5">
                <Download className="h-4 w-4" />
                <span>Goods Receiving</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-overview')} className={getItemClasses('warehouse-inventory')}>
              <div className="flex items-center gap-2.5">
                <Boxes className="h-4 w-4" />
                <span>Inventory</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getItemClasses('warehouse-transfers-picking')}>
              <div className="flex items-center gap-2.5">
                <Repeat className="h-4 w-4" />
                <span>Picking Tasks</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                8
              </span>
            </button>

            <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getItemClasses('warehouse-dispatch')}>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4" />
                <span>Packing &amp; Dispatch</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getItemClasses('warehouse-shipping-handoff')}>
              <div className="flex items-center gap-2.5">
                <ArrowRightLeft className="h-4 w-4" />
                <span>Warehouse &rarr; Shipping</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getItemClasses('warehouse-movements')}>
              <div className="flex items-center gap-2.5">
                <Repeat className="h-4 w-4" />
                <span>Stock Movements</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-racks-bins')} className={getItemClasses('warehouse-locations-bins')}>
              <div className="flex items-center gap-2.5">
                <Grid3X3 className="h-4 w-4" />
                <span>Locations &amp; Bins</span>
              </div>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              VISUAL WAREHOUSE TOOLS
            </div>

            <button onClick={() => setActiveTab('warehouse-map-designer')} className={getItemClasses('warehouse-map-designer')}>
              <div className="flex items-center gap-2.5">
                <Map className="h-4 w-4" />
                <span>Warehouse Map</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-map-designer')} className={getSubItemClasses('warehouse-map-designer')}>
              <span>Map Designer</span>
            </button>

            <button onClick={() => setActiveTab('warehouse-racks-bins')} className={getItemClasses('warehouse-racks-bins')}>
              <div className="flex items-center gap-2.5">
                <Grid3X3 className="h-4 w-4" />
                <span>Racks &amp; Bins</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-receiving')} className={getItemClasses('warehouse-putaway')}>
              <div className="flex items-center gap-2.5">
                <Download className="h-4 w-4" />
                <span>Receiving &amp; Putaway</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-qr-labels')} className={getItemClasses('warehouse-qr-labels')}>
              <div className="flex items-center gap-2.5">
                <QrCode className="h-4 w-4" />
                <span>QR Labels &amp; Scanner</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-locate-package')} className={getItemClasses('warehouse-locate-package')}>
              <div className="flex items-center gap-2.5">
                <Compass className="h-4 w-4" />
                <span>Locate Package</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-transfers-picking')} className={getItemClasses('warehouse-transfers')}>
              <div className="flex items-center gap-2.5">
                <Repeat className="h-4 w-4" />
                <span>Transfers &amp; Picking</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-cycle-counts')} className={getItemClasses('warehouse-cycle-counts')}>
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="h-4 w-4" />
                <span>Cycle Counts</span>
              </div>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              MANAGEMENT
            </div>

            <button onClick={() => setActiveTab('warehouse-overview')} className={getItemClasses('mgmt-warehouses')}>
              <div className="flex items-center gap-2.5">
                <Warehouse className="h-4 w-4" />
                <span>Warehouses</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('billing')} className={getItemClasses('mgmt-rates')}>
              <div className="flex items-center gap-2.5">
                <DollarSign className="h-4 w-4" />
                <span>Storage Rates</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customers')} className={getItemClasses('mgmt-customers')}>
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4" />
                <span>Customers</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('customers')} className={getItemClasses('mgmt-employees')}>
              <div className="flex items-center gap-2.5">
                <UserCheck className="h-4 w-4" />
                <span>Employees</span>
              </div>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              REPORTS
            </div>

            <button onClick={() => setActiveTab('warehouse-reports')} className={getItemClasses('warehouse-reports')}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4" />
                <span>Occupancy Report</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('warehouse-reports')} className={getSubItemClasses('warehouse-reports')}>
              <span>Inventory Report</span>
            </button>

            <button onClick={() => setActiveTab('billing')} className={getSubItemClasses('billing')}>
              <span>Storage Revenue</span>
            </button>

            <button onClick={() => setActiveTab('analytics')} className={getSubItemClasses('analytics')}>
              <span>Activity Logs</span>
            </button>
          </>
        )}

        {/* ========================================================= */}
        {/* ============= CUSTOMER PORTAL NAVIGATION ================ */}
        {/* ========================================================= */}
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
                <span>Payments &amp; Invoices</span>
              </div>
            </button>

            <button onClick={() => setActiveTab('notifications')} className={getItemClasses('notifications')}>
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button onClick={() => alert('Customer 24/7 dedicated support desk: +255 777 000 888')} className={getItemClasses('support')}>
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="h-4 w-4" />
                <span>Support</span>
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

        {/* ========================================================= */}
        {/* ============= DRIVER PORTAL NAVIGATION ================== */}
        {/* ========================================================= */}
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

            <button onClick={() => setActiveTab('notifications')} className={getItemClasses('notifications')}>
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button onClick={() => setActiveTab('settings')} className={getItemClasses('settings')}>
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4" />
                <span>Profile</span>
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
          <button
            onClick={() => alert('Dialing central dispatch hotline: +255 777 123 456')}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900/60 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <PhoneCall className="h-3.5 w-3.5 text-blue-400" />
            <span>Call Support</span>
          </button>
        </div>
      )}

      {/* Customer Help Box (as shown in Customer Dashboard screenshot) */}
      {currentRole === 'customer' && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <p className="text-xs font-bold text-white">Need Help?</p>
          <p className="text-[10px] text-slate-400">Contact our support team</p>
          <button
            onClick={() => alert('Customer 24/7 dedicated support desk: +255 777 000 888')}
            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/60 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
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
        <span className="text-[10px] font-mono text-slate-400 font-bold">SWAHIVO OS</span>
      </div>
    </aside>
  );
}

export default Sidebar;
