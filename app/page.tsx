'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/store-context';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MapsGroundingAssistant from '@/components/MapsGroundingAssistant';

// Admin views
import AdminOverview from '@/components/admin/AdminOverview';
import ShipmentsView from '@/components/admin/ShipmentsView';
import CreateShipmentView from '@/components/admin/CreateShipmentView';
import CustomersCRMView from '@/components/admin/CustomersCRMView';
import TransportersView from '@/components/admin/TransportersView';
import BillingView from '@/components/admin/BillingView';

// Warehouse views
import WarehouseOverview from '@/components/warehouse/WarehouseOverview';
import WarehouseMapDesigner from '@/components/warehouse/WarehouseMapDesigner';
import WarehouseRacksBins from '@/components/warehouse/WarehouseRacksBins';
import WarehouseReceiving from '@/components/warehouse/WarehouseReceiving';
import WarehousePackageLocator from '@/components/warehouse/WarehousePackageLocator';
import WarehouseQRLabels from '@/components/warehouse/WarehouseQRLabels';
import WarehouseTransfersPicking from '@/components/warehouse/WarehouseTransfersPicking';
import WarehouseCycleCounts from '@/components/warehouse/WarehouseCycleCounts';
import WarehouseReports from '@/components/warehouse/WarehouseReports';

// Customer & Driver views
import CustomerPortalView from '@/components/customer/CustomerPortalView';
import DriverPortalView from '@/components/driver/DriverPortalView';

// Landing Page view
import LandingPageView from '@/components/landing/LandingPageView';

const emptySubscribe = () => () => {};

function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function MainAppShell() {
  const mounted = useMounted();
  const { currentRole, activeTab, setActiveTab } = useApp();
  const [isMapsOpen, setIsMapsOpen] = useState(false);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-[#0f172a] items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            SWAHIVO Logistics OS
          </div>
        </div>
      </div>
    );
  }

  // If role is set to landing page, display the public landing page full-screen
  if (currentRole === 'landing') {
    return <LandingPageView />;
  }

  // Render active operational module according to activeTab and currentRole
  const renderActiveModule = () => {
    switch (activeTab) {
      // Admin Operations
      case 'dashboard':
      case 'admin-overview':
      case 'admin_overview':
        return <AdminOverview onNavigate={setActiveTab} />;

      case 'shipments':
      case 'all-shipments':
      case 'pickup-management':
      case 'delivery-management':
        return <ShipmentsView onNavigateToCreate={() => setActiveTab('create-shipment')} />;

      case 'create-shipment':
      case 'create_shipment':
        return (
          <CreateShipmentView
            onSuccess={() => setActiveTab('shipments')}
            onCancel={() => setActiveTab('dashboard')}
          />
        );

      case 'customers':
      case 'customers-crm':
      case 'users-permissions':
      case 'mgmt-customers':
      case 'mgmt-employees':
        return <CustomersCRMView />;

      case 'transporters':
      case 'fleet':
      case 'routes-coverage':
        return <TransportersView />;

      case 'billing':
      case 'invoices-payments':
      case 'quotes-pricing':
      case 'mgmt-rates':
        return <BillingView />;

      case 'analytics':
      case 'reports':
      case 'audit-logs':
        return <WarehouseReports />;

      // Warehouse Operations
      case 'warehouse-overview':
      case 'wh_overview':
      case 'wh_inventory':
      case 'warehouse-inventory':
      case 'mgmt-warehouses':
        return <WarehouseOverview />;

      case 'warehouse-map-designer':
      case 'wh_designer':
        return <WarehouseMapDesigner />;

      case 'warehouse-racks-bins':
      case 'warehouse-locations-bins':
      case 'wh_racks':
      case 'wh_bins':
        return <WarehouseRacksBins />;

      case 'warehouse-receiving':
      case 'warehouse-receiving-putaway':
      case 'warehouse-putaway':
      case 'warehouse-bookings':
      case 'wh_receiving':
      case 'wh_expected':
        return <WarehouseReceiving />;

      case 'warehouse-locate-package':
      case 'wh_locator':
        return <WarehousePackageLocator />;

      case 'warehouse-qr-labels':
      case 'wh_qr':
        return <WarehouseQRLabels />;

      case 'warehouse-transfers-picking':
      case 'warehouse-transfers':
      case 'warehouse-dispatch':
      case 'warehouse-shipping-handoff':
      case 'warehouse-movements':
      case 'wh_transfers':
        return <WarehouseTransfersPicking />;

      case 'warehouse-cycle-counts':
      case 'wh_cycle_counts':
        return <WarehouseCycleCounts />;

      case 'warehouse-reports':
      case 'wh_reports':
        return <WarehouseReports />;

      // Customer Portal (Full-page child routing)
      case 'customer-overview':
      case 'customer_overview':
      case 'customer_portal':
      case 'customer-bookings':
      case 'customer-inventory':
      case 'customer-dispatch':
      case 'customer-shipments':
      case 'customer-create-shipment':
      case 'customer-track':
      case 'customer-invoices':
        return <CustomerPortalView initialTab={activeTab} />;

      // Driver Portal (Full-page child routing)
      case 'driver-dashboard':
      case 'driver_dashboard':
      case 'driver_portal':
      case 'driver-assignments':
      case 'driver-pickups':
      case 'driver-active':
      case 'driver-deliveries':
      case 'driver-scan':
      case 'driver-confirmation':
      case 'driver-history':
        return <DriverPortalView initialTab={activeTab} />;

      case 'settings':
        if (currentRole === 'customer') return <CustomerPortalView initialTab="settings" />;
        if (currentRole === 'driver') return <DriverPortalView initialTab="settings" />;
        return <BillingView />;

      case 'notifications':
        return <AdminOverview onNavigate={setActiveTab} />;

      default:
        if (currentRole === 'warehouse_manager') return <WarehouseOverview />;
        if (currentRole === 'customer') return <CustomerPortalView initialTab={activeTab} />;
        if (currentRole === 'driver') return <DriverPortalView initialTab={activeTab} />;
        return <AdminOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900 font-sans">
      {/* Dark Navy Persistent Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area (Offset by 220px sidebar width) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pl-[220px]">
        {/* Global Operational Header */}
        <Header onOpenMaps={() => setIsMapsOpen(true)} />

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-100/90 p-3.5 sm:p-4">
          <div className="w-full">{renderActiveModule()}</div>
        </main>
      </div>

      {/* Slide-Over Google Maps Grounding GIS Assistant */}
      <MapsGroundingAssistant isOpen={isMapsOpen} onClose={() => setIsMapsOpen(false)} />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}
