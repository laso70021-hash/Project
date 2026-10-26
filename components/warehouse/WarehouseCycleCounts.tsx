'use client';

import React, { useState } from 'react';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  Scan,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ShieldAlert,
  Clock,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';

export default function WarehouseCycleCounts() {
  const { cycleCounts, packages, racks, recordCycleScan, setActiveTab } = useApp();

  const [selectedAuditZone, setSelectedAuditZone] = useState('Zone C - Fast Moving');
  const [scanPkgInput, setScanPkgInput] = useState('PKG-1042');
  const [scanLocInput, setScanLocInput] = useState('WH001-C-R05-L02-B03');
  const [scanAuditFeedback, setScanAuditFeedback] = useState<any>(null);

  const totalCounted = 138;
  const totalExpected = 142;
  const countAccuracyPct = 99.4;

  const handleAuditVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanPkgInput.trim() || !scanLocInput.trim()) return;

    const res = recordCycleScan(scanPkgInput.trim(), scanLocInput.trim());
    setScanAuditFeedback(res);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Cycle Counts & Physical Audit</h1>
          <p className="text-sm text-slate-500">
            Perpetual inventory counting, QR shelf reconciliations, and strict variance investigation protocols
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Export Audit Report PDF
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Inventory Accuracy</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{countAccuracyPct}%</div>
          <div className="text-[11px] text-emerald-600 font-medium">Exceeds 98.5% Target</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Counted Packages</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCounted} / {totalExpected}</div>
          <div className="text-[11px] text-blue-600 font-medium">97.1% zone completion</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Variances / Discrepancies</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{cycleCounts.length} Item</div>
          <div className="text-[11px] text-slate-500 font-medium">1 Under Review</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Last Audit Schedule</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">Today</div>
          <div className="text-[11px] text-slate-500 font-medium">Auditor: J. Makori (Lead)</div>
        </div>
      </div>

      {/* Main Grid: Barcode Physical Verification & Active Discrepancy Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Barcode Audit Scan Station (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scan className="w-4 h-4 text-blue-600" />
              Physical Audit Scan Verification
            </h2>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
              Zebra TC26 Synced
            </span>
          </div>

          <form onSubmit={handleAuditVerification} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Scanned Package Barcode</label>
              <input
                type="text"
                value={scanPkgInput}
                onChange={(e) => setScanPkgInput(e.target.value)}
                placeholder="e.g. PKG-1042"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Scanned Shelf Bin Barcode</label>
              <input
                type="text"
                value={scanLocInput}
                onChange={(e) => setScanLocInput(e.target.value)}
                placeholder="e.g. WH001-C-R05-L02-B03"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-sm flex items-center justify-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" />
              Verify Match in Supabase
            </button>
          </form>

          {/* Feedback response */}
          {scanAuditFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                scanAuditFeedback.matched
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {scanAuditFeedback.matched ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Exact Match Confirmed
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Discrepancy Detected
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">
                {scanAuditFeedback.matched
                  ? `Package ${scanPkgInput} is physically and digitally reconciled in bin ${scanLocInput}. Count verified.`
                  : `Package ${scanPkgInput} was expected at ${scanAuditFeedback.details?.expected || 'another location'} but found at ${scanLocInput}. Flagged in audit log.`}
              </p>
            </div>
          )}
        </div>

        {/* Right: Variance / Discrepancy Log Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Current Discrepancy Log & Variances</h3>
              <p className="text-xs text-slate-500">Requires supervisor investigation before closing count wave</p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
              {cycleCounts.length} Item Flagged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Package</th>
                  <th className="py-2.5 px-3">Expected Location</th>
                  <th className="py-2.5 px-3">Found Location</th>
                  <th className="py-2.5 px-3">Auditor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cycleCounts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.packageId}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.expectedLocation}</td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-600">{item.actualLocation}</td>
                    <td className="py-3 px-3 text-slate-600">{item.countedBy}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveTab('wh_transfers')}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-[11px]"
                      >
                        Reconcile Location
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
