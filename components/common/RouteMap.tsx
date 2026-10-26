'use client';

import React, { useState } from 'react';
import { Plus, Minus, Maximize2, MapPin, Truck } from 'lucide-react';

interface RouteMapProps {
  title?: string;
  variant?: 'admin' | 'driver' | 'customer' | 'transporter';
  activeStopIndex?: number;
  heightClass?: string;
}

export function RouteMap({
  variant = 'admin',
  heightClass = 'h-72',
}: RouteMapProps) {
  const [zoom, setZoom] = useState(1);

  // Key city coordinates mapped to an East Africa viewBox (0 0 500 400)
  // Coordinates calibrated for coastal Tanzania & inland corridors
  const cities = [
    { name: 'Kigali', x: 80, y: 150, country: 'Rwanda' },
    { name: 'Mwanza', x: 180, y: 170, country: 'Tanzania' },
    { name: 'Nairobi', x: 330, y: 90, country: 'Kenya' },
    { name: 'Arusha', x: 300, y: 160, country: 'Tanzania' },
    { name: 'Dodoma', x: 260, y: 250, country: 'Tanzania' },
    { name: 'Morogoro', x: 340, y: 270, country: 'Tanzania' },
    { name: 'Bagamoyo', x: 380, y: 265, country: 'Tanzania' },
    { name: 'Zanzibar', x: 425, y: 255, country: 'Tanzania', isIsland: true },
    { name: 'Dar es Salaam', x: 400, y: 295, country: 'Tanzania', isHub: true },
    { name: 'Mkuranga', x: 405, y: 335, country: 'Tanzania' },
  ];

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl border border-slate-200 bg-[#e2edf8] shadow-xs`}>
      {/* Map Graphic Layer */}
      <svg
        viewBox="0 0 500 400"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="60%" stopColor="#eef4fa" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ocean Background & Coastline */}
        <rect width="500" height="400" fill="url(#oceanGrad)" />

        {/* Landmass Outlines */}
        <path
          d="M 20 20 L 450 20 Q 420 120 400 200 Q 380 250 410 300 Q 420 350 400 400 L 20 400 Z"
          fill="#dbeafe"
          opacity="0.5"
        />

        {/* Zanzibar & Pemba Islands */}
        <ellipse cx="425" cy="255" rx="14" ry="24" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <ellipse cx="440" cy="190" rx="10" ry="18" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <text x="445" y="258" fontSize="10" fontWeight="bold" fill="#1e293b">Zanzibar</text>

        {/* Lake Victoria */}
        <path
          d="M 140 100 Q 210 90 230 140 Q 200 190 150 170 Q 120 140 140 100 Z"
          fill="#93c5fd"
          stroke="#60a5fa"
          strokeWidth="1.5"
        />
        <text x="160" y="140" fontSize="9" fill="#2563eb" fontStyle="italic">Lake Victoria</text>

        {/* Highway Corridors */}
        {/* Coastal Corridor: Dar es Salaam -> Zanzibar (ferry line) */}
        <line x1="400" y1="295" x2="425" y2="255" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4 3" />

        {/* Central Northern Corridor: Dar es Salaam -> Morogoro -> Dodoma -> Mwanza */}
        <path
          d="M 400 295 L 340 270 L 260 250 L 180 170 L 80 150"
          fill="none"
          stroke="#2563eb"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Northern Corridor: Morogoro -> Arusha -> Nairobi */}
        <path
          d="M 340 270 L 300 160 L 330 90"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Driver specific route if variant === 'driver' */}
        {variant === 'driver' && (
          <path
            d="M 400 295 L 405 335 L 425 255 L 380 265 L 340 270 L 300 160"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#shadow)"
          />
        )}

        {/* Active Moving Truck Icon on Highway */}
        <g transform="translate(365, 275)" filter="url(#shadow)">
          <circle cx="12" cy="12" r="14" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
          <path
            d="M 7 14 L 7 10 Q 7 8 9 8 L 13 8 L 15 11 L 18 11 L 18 14 Z"
            fill="#ffffff"
          />
          <circle cx="9" cy="14" r="1.5" fill="#1e293b" />
          <circle cx="16" cy="14" r="1.5" fill="#1e293b" />
        </g>

        {/* City Markers */}
        {cities.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y})`}>
            {c.isHub ? (
              <>
                <circle cx="0" cy="0" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2" filter="url(#shadow)" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                <text x="12" y="4" fontSize="11" fontWeight="bold" fill="#0f172a">{c.name}</text>
              </>
            ) : (
              <>
                <circle cx="0" cy="0" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="8" y="3" fontSize="10" fontWeight="600" fill="#1e293b">{c.name}</text>
              </>
            )}
          </g>
        ))}

        {/* Country Labels */}
        <text x="270" y="320" fontSize="13" fontWeight="bold" fill="#64748b" opacity="0.6" letterSpacing="3">TANZANIA</text>
        <text x="350" y="60" fontSize="11" fontWeight="bold" fill="#64748b" opacity="0.6" letterSpacing="2">KENYA</text>
        <text x="30" y="130" fontSize="10" fontWeight="bold" fill="#64748b" opacity="0.6">RWANDA</text>
      </svg>

      {/* Floating Zoom & Controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white/95 p-1 shadow-md">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2.0))}
          className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
          title="Zoom In"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
          className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
          title="Zoom Out"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
          title="Reset"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Route Legend Indicator */}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-2xs border border-slate-200/80 backdrop-blur-xs">
        <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
        <span>Live Corridor Tracking Active</span>
      </div>
    </div>
  );
}

export default RouteMap;

