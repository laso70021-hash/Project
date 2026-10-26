'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  ClipboardList,
  CheckCircle2,
  Clock,
  MapPin,
  Move,
  Scan,
  Package,
  Layers,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';
import WarehouseFloorMap from '@/components/common/WarehouseFloorMap';

export default function WarehouseTransfersPicking() {
  const { pickTasks, packages, executePickItem, completePickTask, movePackage, setActiveTab } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string>('pt-1');
  const [internalPkgId, setInternalPkgId] = useState('PKG-1042');
  const [newLocationCode, setNewLocationCode] = useState('WH001-A-R01-L01-B01');
  const [transferSuccess, setTransferSuccess] = useState('');

  const currentTask = pickTasks.find((t) => t.id === selectedTaskId) || pickTasks[0];

  const handlePickItem = (pkgId: string) => {
    executePickItem(currentTask.id, pkgId);
  };

  const handleCompleteTask = () => {
    completePickTask(currentTask.id);
  };

  const handleInternalMove = (e: React.FormEvent) => {
    e.preventDefault();
    movePackage(internalPkgId, newLocationCode);
    setTransferSuccess(`Package ${internalPkgId} successfully relocated to ${newLocationCode}!`);
    setTimeout(() => setTransferSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transfers, Picking & Dispatch Waves</h1>
          <p className="text-sm text-slate-500">
            Guided serpentine pick routes, item barcode verification, and internal location reallocations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            Active Wave: Batch #4 (Zone C Priority)
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active Pick Tasks</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{pickTasks.length}</div>
          <div className="text-[11px] text-blue-600 font-medium">2 In Progress • 1 Pending</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Items Picked Today</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">142</div>
          <div className="text-[11px] text-emerald-600 font-medium">99.8% Accuracy Rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Average Pick Time</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4.2 min</div>
          <div className="text-[11px] text-purple-600 font-medium">Optimal Serpentine Routing</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Dispatched Staging</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">18 Pkgs</div>
          <div className="text-[11px] text-amber-600 font-medium">Awaiting Driver Loading</div>
        </div>
      </div>

      {/* Main Grid: Pick Wave List & Step-by-Step Pick Route */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Pick Tasks & Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              Assigned Pick Waves
            </h2>
            <span className="text-xs text-slate-500">Select task to execute</span>
          </div>

          <div className="space-y-3">
            {pickTasks.map((task) => {
              const isSelected = task.id === selectedTaskId;
              const completedCount = task.items.filter((i) => i.scanned).length;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs text-slate-900">{task.taskNumber}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">{task.customerName}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Shipment: <span className="font-mono">{task.shipmentTracking}</span> • Picker: {task.assignedPicker}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Picked: {completedCount} / {task.items.length} items
                    </span>
                    <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${(completedCount / task.items.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Internal Relocation Widget */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-slate-600" />
              Internal Bin-to-Bin Relocation
            </h3>

            {transferSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-[11px] rounded-lg font-semibold">
                {transferSuccess}
              </div>
            )}

            <form onSubmit={handleInternalMove} className="space-y-2 text-xs">
              <div>
                <label className="text-slate-500">Package to Relocate</label>
                <input
                  type="text"
                  value={internalPkgId}
                  onChange={(e) => setInternalPkgId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono font-bold mt-0.5"
                />
              </div>
              <div>
                <label className="text-slate-500">Destination Bin</label>
                <input
                  type="text"
                  value={newLocationCode}
                  onChange={(e) => setNewLocationCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono font-bold mt-0.5"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition"
              >
                Execute Transfer
              </button>
            </form>
          </div>
        </div>

        {/* Right: Active Pick Checklist & Map Route (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Pick Execution: {currentTask.taskNumber}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">
                  Zone C Priority
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Consignee: {currentTask.customerName} • Target Dock: Bay #3 Outbound
              </p>
            </div>

            {currentTask.status !== 'Completed' && (
              <button
                onClick={handleCompleteTask}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finish Pick Wave
              </button>
            )}
          </div>

          {/* Interactive Item Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Required Pick Items Checklist
            </h3>

            {currentTask.items.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${
                  item.scanned
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600">{item.packageId}</span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                      {item.locationCode}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-800">{item.productName || item.itemName}</div>
                  <div className="text-[11px] text-slate-500">Weight: {item.weightKg} kg</div>
                </div>

                <div>
                  {item.scanned ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" /> Picked
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePickItem(item.packageId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      Scan & Confirm Pick
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Warehouse Map Pick Route Visualizer */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Floor Pick Path (Serpentine Path to Rack R05)
              </span>
              <span className="text-slate-500 font-mono">Distance: 42m total</span>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950">
              <WarehouseFloorMap highlightRackId="R05" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
