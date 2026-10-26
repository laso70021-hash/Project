'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, MapPin, Eye } from 'lucide-react';

interface WarehouseFloorMapProps {
  highlightRack?: string; // e.g. 'R05'
  highlightRackId?: string;
  highlightBin?: string; // e.g. 'B03'
  selectedRack?: string;
  onSelectRack?: (rackCode: string) => void;
  showPickPath?: boolean;
  showCycleCountHeatmap?: boolean;
  interactive?: boolean;
  heightClass?: string;
}

export function WarehouseFloorMap({
  highlightRack,
  highlightRackId,
  highlightBin = 'B03',
  selectedRack,
  onSelectRack,
  showPickPath = false,
  showCycleCountHeatmap = false,
  interactive = true,
  heightClass = 'h-[360px]',
}: WarehouseFloorMapProps) {
  const activeHighlightRack = highlightRack || highlightRackId || 'R05';
  const [zoom, setZoom] = useState(1);

  // Racks layout matching the screenshot (R01-R04 top row, R05-R08 bottom row)
  const racks = [
    { code: 'R01', name: 'R01', x: 195, y: 150, width: 42, height: 75, countStatus: 'counted', occupancy: '92%' },
    { code: 'R02', name: 'R02', x: 260, y: 150, width: 42, height: 75, countStatus: 'discrepancy', occupancy: '83%' },
    { code: 'R03', name: 'R03', x: 325, y: 150, width: 42, height: 75, countStatus: 'counted', occupancy: '100%' },
    { code: 'R04', name: 'R04', x: 390, y: 150, width: 42, height: 75, countStatus: 'pending', occupancy: '56%' },

    { code: 'R05', name: 'R05', x: 195, y: 265, width: 42, height: 75, countStatus: 'counted', occupancy: '78%' },
    { code: 'R06', name: 'R06', x: 260, y: 265, width: 42, height: 75, countStatus: 'counted', occupancy: '56%' },
    { code: 'R07', name: 'R07', x: 325, y: 265, width: 42, height: 75, countStatus: 'counted', occupancy: '67%' },
    { code: 'R08', name: 'R08', x: 390, y: 265, width: 42, height: 75, countStatus: 'pending', occupancy: '78%' },
  ];

  const currentSelection = selectedRack || activeHighlightRack;

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl border border-slate-300 bg-[#334155] shadow-inner`}>
      <svg
        viewBox="0 0 640 400"
        className="w-full h-full object-cover transition-transform duration-200 select-none"
        style={{ transform: `scale(${zoom})` }}
      >
        <defs>
          <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.4" />
          </pattern>
          <filter id="glowPin" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Warehouse Concrete Floor Base */}
        <rect width="640" height="400" fill="#f1f5f9" />
        <rect width="640" height="400" fill="url(#gridPattern)" />

        {/* Outer Structural Perimeter Walls */}
        <rect x="25" y="20" width="590" height="360" fill="none" stroke="#1e293b" strokeWidth="6" rx="4" />

        {/* Left Logistics Zones */}
        {/* Loading Dock & Truck Bay */}
        <rect x="40" y="35" width="130" height="110" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="75" y="60" fontSize="10" fontWeight="bold" fill="#475569">Loading Zone</text>
        {/* Stylized Delivery Truck */}
        <g transform="translate(48, 70)">
          <rect x="0" y="0" width="110" height="35" rx="3" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
          <rect x="85" y="2" width="22" height="31" rx="2" fill="#3b82f6" />
          <circle cx="25" cy="35" r="5" fill="#1e293b" />
          <circle cx="85" cy="35" r="5" fill="#1e293b" />
        </g>

        {/* Quarantine Area (Pink) */}
        <rect x="40" y="160" width="130" height="50" fill="#fce7f3" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="65" y="190" fontSize="9" fontWeight="bold" fill="#be123c">Quarantine Area</text>

        {/* Staging Area (Purple) */}
        <rect x="40" y="220" width="130" height="50" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="75" y="250" fontSize="9" fontWeight="bold" fill="#7e22ce">Staging Area</text>

        {/* Returns Area (Light Blue) */}
        <rect x="40" y="280" width="130" height="85" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="75" y="325" fontSize="9" fontWeight="bold" fill="#0369a1">Returns Area</text>

        {/* Receiving Area (Top Green) */}
        <rect x="195" y="35" width="235" height="75" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="290" y="65" fontSize="11" fontWeight="bold" fill="#15803d">Receiving Area</text>
        {/* Pallets in Receiving */}
        <g transform="translate(205, 50)">
          <rect x="0" y="0" width="22" height="22" fill="#fed7aa" stroke="#f97316" strokeWidth="1" />
          <rect x="26" y="0" width="22" height="22" fill="#fed7aa" stroke="#f97316" strokeWidth="1" />
          <rect x="52" y="0" width="22" height="22" fill="#fed7aa" stroke="#f97316" strokeWidth="1" />
        </g>

        {/* Right Logistics Zones */}
        {/* Office */}
        <rect x="455" y="35" width="145" height="70" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
        <text x="510" y="75" fontSize="12" fontWeight="bold" fill="#334155">Office</text>

        {/* Packing Area */}
        <rect x="455" y="125" width="145" height="95" fill="#fef3c7" stroke="#eab308" strokeWidth="1.5" />
        <text x="500" y="170" fontSize="11" fontWeight="bold" fill="#854d0e">Packing Area</text>

        {/* Dispatch Area */}
        <rect x="455" y="240" width="145" height="125" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1.5" />
        <text x="495" y="305" fontSize="11" fontWeight="bold" fill="#4338ca">Dispatch Area</text>

        {/* Central Walkway Lines & Directional Arrows */}
        <line x1="180" y1="120" x2="445" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
        <line x1="180" y1="240" x2="445" y2="240" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
        <line x1="180" y1="355" x2="445" y2="355" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />

        {/* Optional Pick Path (Transfers & Picking Dashboard) */}
        {showPickPath && (
          <g>
            <path
              d="M 215 90 L 215 130 L 280 130 L 280 160 L 345 160 L 345 240 L 215 240 L 215 285 L 470 285"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
            {/* Pick Stops Markers */}
            <circle cx="215" cy="170" r="10" fill="#22c55e" stroke="#ffffff" strokeWidth="2" />
            <text x="212" y="174" fontSize="10" fontWeight="bold" fill="#ffffff">1</text>

            <circle cx="345" cy="170" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <text x="342" y="174" fontSize="10" fontWeight="bold" fill="#ffffff">2</text>

            <circle cx="215" cy="285" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <text x="212" y="289" fontSize="10" fontWeight="bold" fill="#ffffff">3</text>
          </g>
        )}

        {/* Central Storage Racks (R01 to R08) */}
        {racks.map((rack) => {
          const isHighlighted = currentSelection === rack.code;
          let fillColor = '#ea580c'; // default industrial rack orange
          let strokeColor = '#9a3412';

          if (showCycleCountHeatmap) {
            if (rack.countStatus === 'counted') {
              fillColor = '#16a34a';
              strokeColor = '#14532d';
            } else if (rack.countStatus === 'discrepancy') {
              fillColor = '#dc2626';
              strokeColor = '#7f1d1d';
            } else {
              fillColor = '#64748b';
              strokeColor = '#334155';
            }
          } else if (isHighlighted) {
            fillColor = '#0284c7'; // active bright blue
            strokeColor = '#0369a1';
          }

          return (
            <g
              key={rack.code}
              className={interactive ? 'cursor-pointer transition-transform hover:opacity-90' : ''}
              onClick={() => onSelectRack?.(rack.code)}
            >
              {/* Rack Shadow & Shelf Base */}
              <rect
                x={rack.x}
                y={rack.y}
                width={rack.width}
                height={rack.height}
                rx="4"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isHighlighted ? '3' : '1.5'}
                filter={isHighlighted ? 'url(#glowPin)' : undefined}
              />

              {/* Shelf Shelving dividers */}
              <line x1={rack.x} y1={rack.y + 25} x2={rack.x + rack.width} y2={rack.y + 25} stroke="#ffffff" strokeWidth="1" opacity="0.6" />
              <line x1={rack.x} y1={rack.y + 50} x2={rack.x + rack.width} y2={rack.y + 50} stroke="#ffffff" strokeWidth="1" opacity="0.6" />

              {/* Rack Code Label Badge */}
              <rect
                x={rack.x + 3}
                y={rack.y + rack.height - 18}
                width={rack.width - 6}
                height="15"
                rx="3"
                fill="#0f172a"
              />
              <text
                x={rack.x + rack.width / 2}
                y={rack.y + rack.height - 7}
                fontSize="10"
                fontWeight="extrabold"
                fill="#ffffff"
                textAnchor="middle"
              >
                {rack.code}
              </text>
            </g>
          );
        })}

        {/* Glowing Pin for Located Package (e.g. PKG-1042 on R05) */}
        {(activeHighlightRack === 'R05' || activeHighlightRack.includes('R05')) && (
          <g transform="translate(216, 260)" filter="url(#glowPin)">
            <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
            <path
              d="M -6 -4 L 6 -4 L 8 2 L -8 2 Z"
              fill="#ffffff"
            />
            {/* Callout box */}
            <rect x="20" y="-15" width="85" height="30" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="26" y="-2" fontSize="9" fontWeight="bold" fill="#ffffff">PKG-1042</text>
            <text x="26" y="9" fontSize="8" fill="#94a3b8">R05 - L02 - B03</text>
          </g>
        )}
      </svg>

      {/* Map Control Buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 p-1 shadow-sm">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.15, 1.8))}
          className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.85))}
          className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
          title="Fit"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Bottom Color Legend matching screenshots */}
      <div className="absolute bottom-2 left-3 flex flex-wrap items-center gap-3 rounded-lg bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-2xs border border-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span>Full</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <span>Selected / Target</span>
        </div>
      </div>
    </div>
  );
}

export default WarehouseFloorMap;

