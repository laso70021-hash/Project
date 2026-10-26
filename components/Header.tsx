'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store-context';
import {
  Search,
  Bell,
  MessageSquare,
  Globe,
  ChevronDown,
  Warehouse as WarehouseIcon,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  onOpenAiAssistant?: () => void;
  onOpenMaps?: () => void;
}

export function Header({ onOpenAiAssistant, onOpenMaps }: HeaderProps) {
  const handleOpenAssistant = onOpenMaps || onOpenAiAssistant;

  const { currentRole, setCurrentRole, setActiveTab, selectedWarehouse, setSelectedWarehouse, shipments } = useAppStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showWarehouseMenu, setShowWarehouseMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // User badge info based on active role
  const getRoleBadge = () => {
    switch (currentRole) {
      case 'warehouse_manager':
        return { initials: 'WM', title: 'Warehouse Manager', name: 'Abdullah M.' };
      case 'customer':
        return { initials: 'JM', title: 'Customer', name: 'Juma M. Traders' };
      case 'driver':
        return { initials: 'DA', title: 'Driver', name: 'Driver Ali Hassan' };
      default:
        return { initials: 'AD', title: 'Super Admin', name: 'Admin User' };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
      {/* Global Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shipments, customers, bookings, or tracking number... (Ctrl + K)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Google Maps AI Route Intelligence Button */}
        {handleOpenAssistant && (
          <button
            onClick={handleOpenAssistant}
            className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs"
            title="Google Maps Grounded Route Assistant"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span>GIS Route AI</span>
          </button>
        )}


        {/* Warehouse Selector (visible for Admin & Warehouse) */}
        {(currentRole === 'admin' || currentRole === 'warehouse_manager') && (
          <div className="relative">
            <button
              onClick={() => setShowWarehouseMenu(!showWarehouseMenu)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <WarehouseIcon className="h-3.5 w-3.5 text-slate-500" />
              <span>{selectedWarehouse.split(' - ')[0]}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showWarehouseMenu && (
              <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Facility
                </div>
                {[
                  { code: 'WH001 - Main Warehouse', loc: 'Dar es Salaam (DAR-WH01)' },
                  { code: 'WH002 - Island Facility', loc: 'Zanzibar (ZNZ-WH01)' },
                  { code: 'WH003 - Northern Hub', loc: 'Arusha (ARU-WH01)' },
                  { code: 'WH004 - Lake Hub', loc: 'Mwanza (MWZ-WH01)' },
                ].map((wh) => (
                  <button
                    key={wh.code}
                    onClick={() => {
                      setSelectedWarehouse(wh.code);
                      setShowWarehouseMenu(false);
                    }}
                    className={`flex w-full flex-col items-start rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      selectedWarehouse === wh.code
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{wh.code}</span>
                    <span className="text-[10px] text-slate-400">{wh.loc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800">Operational Alerts</h4>
                <span className="text-[10px] text-blue-600 font-medium">3 New</span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-blue-50/60">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">New Storage Booking</p>
                    <p className="text-[11px] text-slate-500">WHB-2026-0047 received 40 cartons.</p>
                    <span className="text-[10px] text-slate-400">10 mins ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50/60">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Cycle Count Discrepancy</p>
                    <p className="text-[11px] text-slate-500">Location R05-L02-B02 reported misplaced item.</p>
                    <span className="text-[10px] text-slate-400">32 mins ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/60">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Delivery Confirmed</p>
                    <p className="text-[11px] text-slate-500">PKG-1042 marked delivered by Ali Hassan.</p>
                    <span className="text-[10px] text-slate-400">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messaging shortcut */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
          <MessageSquare className="h-4 w-4" />
        </button>

        {/* Language selector */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600">
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-medium">English</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
              {roleInfo.initials}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800">{roleInfo.name}</span>
              <span className="text-[10px] text-slate-500">{roleInfo.title}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">SWAHIVO Role Switcher</p>
                <p className="text-[11px] text-slate-500">Instant multi-role dashboard navigation</p>
              </div>
              <div className="py-1 space-y-1">
                {[
                  { role: 'admin', label: 'Admin Dashboard', desc: 'Master operational view & system' },
                  { role: 'warehouse_manager', label: 'Warehouse Manager', desc: 'Floor map, racks, QR & counts' },
                  { role: 'customer', label: 'Customer Portal', desc: 'Inventory, bookings & dispatches' },
                  { role: 'driver', label: 'Driver Dashboard', desc: 'Routes, pickups & deliveries' },
                  { role: 'landing', label: 'Public Landing Page', desc: 'Marketing & public booking' },
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      setCurrentRole(item.role as any);
                      if (item.role === 'admin') setActiveTab('dashboard');
                      else if (item.role === 'warehouse_manager') setActiveTab('warehouse-overview');
                      else if (item.role === 'customer') setActiveTab('customer-overview');
                      else if (item.role === 'driver') setActiveTab('driver-dashboard');
                      setShowRoleMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                      currentRole === item.role
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                    {currentRole === item.role && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

