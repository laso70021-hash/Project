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

  // Render active operational module
  const renderActiveModule = () => {
    switch (activeTab) {
      // Admin Operations
      case 'dashboard':
        return <AdminOverview onNavigate={setActiveTab} />;

      case 'shipments':
        return <ShipmentsView />;
      case 'create_shipment':
        return <CreateShipmentView />;
      case 'customers':
        return <CustomersCRMView />;
      case 'transporters':
      case 'fleet':
        return <TransportersView />;
      case 'billing':
        return <BillingView />;

      // Warehouse Operations
      case 'wh_overview':
      case 'wh_inventory':
        return <WarehouseOverview />;
      case 'wh_designer':
        return <WarehouseMapDesigner />;
      case 'wh_racks':
      case 'wh_bins':
        return <WarehouseRacksBins />;
      case 'wh_receiving':
      case 'wh_expected':
        return <WarehouseReceiving />;
      case 'wh_locator':
        return <WarehousePackageLocator />;
      case 'wh_qr':
        return <WarehouseQRLabels />;
      case 'wh_transfers':
        return <WarehouseTransfersPicking />;
      case 'wh_cycle_counts':
        return <WarehouseCycleCounts />;
      case 'wh_reports':
        return <WarehouseReports />;

      // Customer Portal
      case 'customer_portal':
        return <CustomerPortalView />;

      // Driver Portal
      case 'driver_portal':
        return <DriverPortalView />;

      default:
        if (currentRole === 'warehouse_manager') return <WarehouseOverview />;
        if (currentRole === 'customer') return <CustomerPortalView />;
        if (currentRole === 'driver') return <DriverPortalView />;
        return <AdminOverview onNavigate={setActiveTab} />;
    }

  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900 font-sans">
      {/* Dark Navy Persistent Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Operational Header */}
        <Header onOpenMaps={() => setIsMapsOpen(true)} />

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderActiveModule()}</div>
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
