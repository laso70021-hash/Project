'use client';

import React, { useState } from 'react';
import {
  QrCode,
  Printer,
  Scan,
  Camera,
  CheckCircle2,
  Search,
  Layers,
  History,
  Copy,
  Check,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';

export default function WarehouseQRLabels() {
  const { packages, racks, scanHistory, addQRScanLog, recordCycleScan, setActiveTab } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'package' | 'bin' | 'scanner'>('package');
  const [selectedPackageId, setSelectedPackageId] = useState('PKG-1042');
  const [selectedRackId, setSelectedRackId] = useState('R05');

  // Scanner state
  const [manualScanInput, setManualScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const selectedPkg = packages.find((p) => p.packageId === selectedPackageId) || packages[0];
  const selectedRack = racks.find((r) => r.id === selectedRackId) || racks[0];

  const handleSimulateScan = (codeToScan?: string) => {
    const raw = codeToScan || manualScanInput;
    if (!raw.trim()) return;

    // Check if package or location
    const clean = raw.trim();
    const pkg = packages.find(
      (p) => p.packageId.toLowerCase() === clean.toLowerCase() || p.id === clean
    );
    const isBin = clean.startsWith('WH001');

    if (pkg) {
      const res = {
        type: 'package',
        id: pkg.packageId,
        customer: pkg.customerName,
        item: pkg.productName || pkg.itemName,
        location: pkg.locationCode || 'Receiving Dock',
        status: pkg.status,
      };
      setScanResult(res);
      addQRScanLog({
        barcode: clean,
        scannedCode: clean,
        type: 'Package',
        resultStatus: 'Found (In Storage)',
        scannedBy: 'Ali Mussa (WH-Staff)',
        deviceType: 'Zebra TC26 Handheld',
        location: pkg.locationCode || 'Dock Bay 2',
        result: 'Verified Valid Package',
      });
    } else if (isBin) {
      const res = {
        type: 'bin',
        code: clean,
        status: 'Active Bin Location',
        warehouse: 'WH001 Main Facility',
      };
      setScanResult(res);
      addQRScanLog({
        barcode: clean,
        scannedCode: clean,
        type: 'Location',
        resultStatus: 'Found (Available)',
        scannedBy: 'Ali Mussa (WH-Staff)',
        deviceType: 'Zebra TC26 Handheld',
        location: clean,
        result: 'Verified Storage Bin',
      });
    } else {
      setScanResult({
        type: 'unknown',
        code: clean,
        status: 'Unregistered Barcode',
      });
    }
    setManualScanInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">QR Labels & Barcode Scanner Engine</h1>
          <p className="text-sm text-slate-500">
            Generate 203 DPI standard thermal logistics labels, print shelf bin barcodes, and scan QR packages in real time
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTabMode('package')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTabMode === 'package' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Package Labels
          </button>
          <button
            onClick={() => setActiveTabMode('bin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTabMode === 'bin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bin Shelf Strips
          </button>
          <button
            onClick={() => setActiveTabMode('scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTabMode === 'scanner' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scan & Verify
          </button>
        </div>
      </div>

      {activeTabMode === 'package' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Package Selector & Thermal Label Configuration (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Select Package for Printing</h2>
              <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {selectedPackageId}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Package</label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-900 bg-white font-medium"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.packageId}>
                    {pkg.packageId} — {pkg.customerName} ({pkg.productName || pkg.itemName})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Consignee:</span>
                <span className="font-bold text-slate-900">{selectedPkg.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Weight & Size:</span>
                <span className="font-bold text-slate-900">{selectedPkg.weightKg} kg • {selectedPkg.dimensions || '40x30x25cm'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Storage Location:</span>
                <span className="font-mono font-bold text-blue-600">{selectedPkg.locationCode || 'Receiving Dock'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Label Format:</span>
                <span className="font-medium text-slate-700">4&quot; × 6&quot; Thermal (100mm × 150mm)</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Thermal Label
            </button>
          </div>

          {/* Right: Printable Label Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
            {/* The actual 4x6 label representation */}
            <div className="w-full max-w-md border-4 border-slate-900 rounded-2xl p-6 bg-white text-slate-950 font-sans shadow-xl space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-950 pb-3">
                <div>
                  <div className="font-black text-lg tracking-wider">SWAHIVO LOGISTICS OS</div>
                  <div className="text-[10px] font-bold text-slate-600">DAR ES SALAAM PORT FREIGHT HUB</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-extrabold text-xs px-2 py-0.5 bg-slate-950 text-white rounded">
                    PRIORITY INBOUND
                  </div>
                </div>
              </div>

              {/* Main barcode & QR section */}
              <div className="flex items-center justify-between gap-4 py-2 border-b-2 border-slate-950">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Tracking Number</div>
                  <div className="font-mono text-2xl font-black tracking-tight">{selectedPkg.packageId}</div>
                  <div className="text-xs font-bold text-slate-900">{selectedPkg.customerName}</div>
                  <div className="text-xs text-slate-600">{selectedPkg.productName || selectedPkg.itemName}</div>
                </div>
                <div className="p-1 border-2 border-slate-950 rounded-lg shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https://swahivo.logistics/pkg/${selectedPkg.packageId}`}
                    alt="QR Code"
                    className="w-24 h-24"
                  />
                </div>
              </div>

              {/* Physical specifications */}
              <div className="grid grid-cols-2 gap-4 py-2 border-b-2 border-slate-950 text-xs">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Verified Scale Weight</div>
                  <div className="font-black text-sm">{selectedPkg.weightKg} KG</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Package Dimensions</div>
                  <div className="font-black text-sm">{selectedPkg.dimensions || '40x30x25 CM'}</div>
                </div>
              </div>

              {/* Storage Bin Location */}
              <div className="pt-2 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Dedicated Warehouse Bin Location
                </div>
                <div className="font-mono text-xl font-black bg-slate-100 py-2 border-2 border-dashed border-slate-950 rounded-lg">
                  {selectedPkg.locationCode || 'UNASSIGNED - DOCK BAY 2'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTabMode === 'bin' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Select Rack:</span>
              <div className="flex items-center gap-1">
                {racks.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRackId(r.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                      selectedRackId === r.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {r.id}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" /> Print All 9 Bin Barcodes
            </button>
          </div>

          {/* 3x3 Grid of Bin Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {((selectedRack.bins && selectedRack.bins.length > 0)
              ? selectedRack.bins
              : [
                  { id: `${selectedRack.rackCode}-L03-B01`, locationCode: `WH001-A-${selectedRack.rackCode}-L03-B01`, level: 'L03 (Top)', levelNumber: 3, binCode: 'B01', maxWeightKg: 100 },
                  { id: `${selectedRack.rackCode}-L03-B02`, locationCode: `WH001-A-${selectedRack.rackCode}-L03-B02`, level: 'L03 (Top)', levelNumber: 3, binCode: 'B02', maxWeightKg: 100 },
                  { id: `${selectedRack.rackCode}-L03-B03`, locationCode: `WH001-A-${selectedRack.rackCode}-L03-B03`, level: 'L03 (Top)', levelNumber: 3, binCode: 'B03', maxWeightKg: 100 },
                  { id: `${selectedRack.rackCode}-L02-B01`, locationCode: `WH001-A-${selectedRack.rackCode}-L02-B01`, level: 'L02 (Middle)', levelNumber: 2, binCode: 'B01', maxWeightKg: 100 },
                  { id: `${selectedRack.rackCode}-L02-B02`, locationCode: `WH001-A-${selectedRack.rackCode}-L02-B02`, level: 'L02 (Middle)', levelNumber: 2, binCode: 'B02', maxWeightKg: 100 },
                  { id: `${selectedRack.rackCode}-L02-B03`, locationCode: `WH001-A-${selectedRack.rackCode}-L02-B03`, level: 'L02 (Middle)', levelNumber: 2, binCode: 'B03', maxWeightKg: 100 },
                  { id: `${selectedRack.rackCode}-L01-B01`, locationCode: `WH001-A-${selectedRack.rackCode}-L01-B01`, level: 'L01 (Bottom)', levelNumber: 1, binCode: 'B01', maxWeightKg: 100 },
                  { id: `${selectedRack.rackCode}-L01-B02`, locationCode: `WH001-A-${selectedRack.rackCode}-L01-B02`, level: 'L01 (Bottom)', levelNumber: 1, binCode: 'B02', maxWeightKg: 100 },
                  { id: `${selectedRack.rackCode}-L01-B03`, locationCode: `WH001-A-${selectedRack.rackCode}-L01-B03`, level: 'L01 (Bottom)', levelNumber: 1, binCode: 'B03', maxWeightKg: 100 },
                ]
            ).map((bin) => {
              const code = bin.locationCode || (bin as any).code || `WH001-A-${selectedRack.rackCode}-L0${bin.levelNumber}-${bin.binCode}`;
              return (
                <div
                  key={bin.id}
                  className="bg-white p-4 rounded-xl border-2 border-slate-800 shadow-sm flex items-center justify-between gap-3 font-sans"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Shelf Position L0{bin.levelNumber} - Bin {bin.binCode}
                    </span>
                    <div className="font-mono font-black text-sm text-slate-900">{code}</div>
                    <div className="text-[11px] text-slate-600 font-semibold">Max {bin.maxWeightKg || 100} kg</div>
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(code)}`}
                    alt="Bin QR"
                    className="w-16 h-16 border border-slate-800 p-0.5 rounded"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTabMode === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Viewport Simulation (6 cols) */}
          <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> Scanner Camera Active
              </span>
              <span className="text-xs text-slate-400">Aim target inside crosshair</span>
            </div>

            {/* Target Viewport */}
            <div className="relative w-full h-64 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
              {/* Animated laser line */}
              <div className="absolute inset-x-8 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse"></div>
              {/* Corner crosshair brackets */}
              <div className="w-44 h-44 border-2 border-emerald-400/80 rounded-2xl relative flex items-center justify-center">
                <Scan className="w-16 h-16 text-emerald-400/40" />
              </div>
            </div>

            {/* Manual Quick Scan Input for testing */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-300">
                Or Enter / Simulate Handheld Scanner Input
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualScanInput}
                  onChange={(e) => setManualScanInput(e.target.value)}
                  placeholder="Scan PKG-1042 or WH001-C-R05-L02-B03..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => handleSimulateScan()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition"
                >
                  Decode
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                <span>Quick tests:</span>
                <button
                  onClick={() => handleSimulateScan('PKG-1042')}
                  className="text-blue-400 hover:underline font-mono"
                >
                  PKG-1042
                </button>
                <span>•</span>
                <button
                  onClick={() => handleSimulateScan('WH001-C-R05-L02-B03')}
                  className="text-emerald-400 hover:underline font-mono"
                >
                  WH001-C-R05-L02-B03
                </button>
              </div>
            </div>
          </div>

          {/* Decoded Result & Scan History (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {scanResult && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Decoded Barcode Result
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-emerald-50 text-emerald-700">
                    {scanResult.type}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div className="font-mono text-lg font-bold text-blue-600">{scanResult.id || scanResult.code}</div>
                  {scanResult.customer && (
                    <div className="text-slate-800">Consignee: <span className="font-bold">{scanResult.customer}</span></div>
                  )}
                  {scanResult.item && (
                    <div className="text-slate-600">Cargo: {scanResult.item}</div>
                  )}
                  {scanResult.location && (
                    <div className="text-slate-800">
                      Location: <span className="font-mono font-bold text-emerald-600">{scanResult.location}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('wh_locator')}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
                >
                  Inspect on Floor Map
                </button>
              </div>
            )}

            {/* Audit Log Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                Recent Scan Verification Logs
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                {scanHistory.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900">{log.barcode}</span>
                      <div className="text-[11px] text-slate-500">{log.scannedBy} • {log.timestamp}</div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {log.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
