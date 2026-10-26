'use client';

import React, { useState } from 'react';
import {
  Square,
  Layers,
  Save,
  Upload,
  Download,
  RotateCw,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Lock,
  Boxes,
  MapPin,
  Move,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/lib/store-context';

type ToolType = 'select' | 'rack' | 'zone' | 'wall' | 'dock' | 'aisle';

interface MapElement {
  id: string;
  type: ToolType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  zone: string;
  levels?: number;
  binsPerLevel?: number;
  capacityKg?: number;
}

export default function WarehouseMapDesigner() {
  const { racks } = useApp();
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string>('R05');

  // Interactive floor plan elements
  const [elements, setElements] = useState<MapElement[]>([
    { id: 'Z_REC', type: 'zone', name: 'Inbound Receiving Staging', x: 2, y: 3, width: 9, height: 12, color: 'rgba(245, 158, 11, 0.15)', zone: 'Receiving' },
    { id: 'Z_DIS', type: 'zone', name: 'Outbound Dispatch Staging', x: 2, y: 16, width: 9, height: 12, color: 'rgba(59, 130, 246, 0.15)', zone: 'Dispatch' },
    { id: 'R01', type: 'rack', name: 'Rack R01 (Electronics)', x: 13, y: 4, width: 3, height: 10, color: '#3b82f6', zone: 'Zone A', levels: 3, binsPerLevel: 3, capacityKg: 4500 },
    { id: 'R02', type: 'rack', name: 'Rack R02 (Electronics)', x: 17, y: 4, width: 3, height: 10, color: '#3b82f6', zone: 'Zone A', levels: 3, binsPerLevel: 3, capacityKg: 4500 },
    { id: 'R03', type: 'rack', name: 'Rack R03 (Industrial/Auto)', x: 22, y: 4, width: 3, height: 10, color: '#6366f1', zone: 'Zone B', levels: 3, binsPerLevel: 3, capacityKg: 6000 },
    { id: 'R04', type: 'rack', name: 'Rack R04 (Industrial/Auto)', x: 26, y: 4, width: 3, height: 10, color: '#6366f1', zone: 'Zone B', levels: 3, binsPerLevel: 3, capacityKg: 6000 },
    { id: 'R05', type: 'rack', name: 'Rack R05 (Fast Moving Dry Goods)', x: 31, y: 4, width: 3, height: 10, color: '#10b981', zone: 'Zone C', levels: 3, binsPerLevel: 3, capacityKg: 5000 },
    { id: 'R06', type: 'rack', name: 'Rack R06 (Fast Moving Dry Goods)', x: 35, y: 4, width: 3, height: 10, color: '#10b981', zone: 'Zone C', levels: 3, binsPerLevel: 3, capacityKg: 5000 },
    { id: 'R07', type: 'rack', name: 'Rack R07 (Bulk Overstock)', x: 13, y: 17, width: 10, height: 3, color: '#8b5cf6', zone: 'Zone D', levels: 3, binsPerLevel: 3, capacityKg: 8000 },
    { id: 'R08', type: 'rack', name: 'Rack R08 (Bulk Overstock)', x: 26, y: 17, width: 10, height: 3, color: '#8b5cf6', zone: 'Zone D', levels: 3, binsPerLevel: 3, capacityKg: 8000 },
    { id: 'DOCK_1', type: 'dock', name: 'Dock Bay 1 (Heavy Truck)', x: 0, y: 5, width: 2, height: 3, color: '#475569', zone: 'Exterior' },
    { id: 'DOCK_2', type: 'dock', name: 'Dock Bay 2 (Container Inbound)', x: 0, y: 9, width: 2, height: 3, color: '#475569', zone: 'Exterior' },
    { id: 'DOCK_3', type: 'dock', name: 'Dock Bay 3 (Outbound Dispatch)', x: 0, y: 18, width: 2, height: 3, color: '#475569', zone: 'Exterior' },
  ]);

  const selectedElement = elements.find((e) => e.id === selectedElementId);

  const handleSaveDraft = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddRack = () => {
    const newId = `R0${elements.filter((e) => e.type === 'rack').length + 1}`;
    const newRack: MapElement = {
      id: newId,
      type: 'rack',
      name: `Rack ${newId}`,
      x: 39,
      y: 5,
      width: 3,
      height: 10,
      color: '#0ea5e9',
      zone: 'Zone E',
      levels: 3,
      binsPerLevel: 3,
      capacityKg: 5000,
    };
    setElements([...elements, newRack]);
    setSelectedElementId(newId);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Map Designer</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">Live Twin Active</span>
          </div>
          <p className="text-sm text-slate-500">
            WH001 Main Warehouse — Floor Grid 48m × 30m • 1m Grid Snap • PostgreSQL Geometry Synced
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-3.5 h-3.5" /> Published to Supabase
            </span>
          )}
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            Publish Layout
          </button>
        </div>
      </div>

      {/* Main Designer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Toolbar (1 col) */}
        <div className="lg:col-span-1 bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex lg:flex-col items-center justify-center gap-2">
          <button
            onClick={() => setActiveTool('select')}
            title="Select & Move Object"
            className={`p-2.5 rounded-lg text-xs font-medium transition ${
              activeTool === 'select' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Move className="w-5 h-5 mx-auto" />
          </button>
          <button
            onClick={() => {
              setActiveTool('rack');
              handleAddRack();
            }}
            title="Add Storage Rack"
            className={`p-2.5 rounded-lg text-xs font-medium transition ${
              activeTool === 'rack' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Boxes className="w-5 h-5 mx-auto" />
          </button>
          <button
            onClick={() => setActiveTool('zone')}
            title="Draw Zone"
            className={`p-2.5 rounded-lg text-xs font-medium transition ${
              activeTool === 'zone' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Square className="w-5 h-5 mx-auto" />
          </button>
          <button
            onClick={() => setActiveTool('dock')}
            title="Add Loading Dock"
            className={`p-2.5 rounded-lg text-xs font-medium transition ${
              activeTool === 'dock' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-5 h-5 mx-auto" />
          </button>
          <div className="w-full h-px bg-slate-200 my-1 hidden lg:block"></div>
          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
            title="Zoom In"
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <ZoomIn className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
            title="Zoom Out"
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <ZoomOut className="w-4 h-4 mx-auto" />
          </button>
        </div>

        {/* Center Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
            <span className="font-mono text-[11px] text-slate-400">Warehouse Dimensions: 48.0m × 30.0m (Scale 1m = 16px)</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                Snap to 1m Grid
              </label>
              <span className="text-slate-400">Zoom: {zoomLevel}%</span>
            </div>
          </div>

          {/* SVG Scaled Floor Surface */}
          <div className="relative w-full h-[540px] overflow-auto flex items-center justify-center p-4">
            <svg
              viewBox="0 0 768 480"
              className="w-full h-full bg-slate-950 border border-slate-700 rounded-lg shadow-2xl"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
            >
              <defs>
                <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <pattern id="majorGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#334155" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Grid backgrounds */}
              <rect width="768" height="480" fill="url(#grid)" />
              <rect width="768" height="480" fill="url(#majorGrid)" />

              {/* Placed Elements */}
              {elements.map((el) => {
                const pxX = el.x * 16;
                const pxY = el.y * 16;
                const pxW = el.width * 16;
                const pxH = el.height * 16;
                const isSelected = el.id === selectedElementId;

                if (el.type === 'zone') {
                  return (
                    <g key={el.id} onClick={() => setSelectedElementId(el.id)} className="cursor-pointer">
                      <rect
                        x={pxX}
                        y={pxY}
                        width={pxW}
                        height={pxH}
                        fill={el.color}
                        stroke="#f59e0b"
                        strokeWidth={isSelected ? '2' : '1'}
                        strokeDasharray="4 2"
                        rx="4"
                      />
                      <text x={pxX + 8} y={pxY + 16} fill="#fbbf24" fontSize="10" fontWeight="bold">
                        {el.name}
                      </text>
                    </g>
                  );
                }

                if (el.type === 'dock') {
                  return (
                    <g key={el.id} onClick={() => setSelectedElementId(el.id)} className="cursor-pointer">
                      <rect
                        x={pxX}
                        y={pxY}
                        width={pxW}
                        height={pxH}
                        fill="#334155"
                        stroke={isSelected ? '#38bdf8' : '#64748b'}
                        strokeWidth="1.5"
                        rx="2"
                      />
                      <text x={pxX + 4} y={pxY + 20} fill="#f1f5f9" fontSize="8" fontWeight="bold">
                        {el.id}
                      </text>
                    </g>
                  );
                }

                // Rack
                return (
                  <g key={el.id} onClick={() => setSelectedElementId(el.id)} className="cursor-pointer">
                    <rect
                      x={pxX}
                      y={pxY}
                      width={pxW}
                      height={pxH}
                      fill={el.color}
                      stroke={isSelected ? '#f8fafc' : '#1e293b'}
                      strokeWidth={isSelected ? '2.5' : '1'}
                      rx="4"
                      className="transition-all"
                    />
                    {/* Shelf dividers */}
                    <line x1={pxX} y1={pxY + pxH * 0.33} x2={pxX + pxW} y2={pxY + pxH * 0.33} stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
                    <line x1={pxX} y1={pxY + pxH * 0.66} x2={pxX + pxW} y2={pxY + pxH * 0.66} stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
                    <text
                      x={pxX + pxW / 2}
                      y={pxY + pxH / 2 + 4}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {el.id}
                    </text>
                  </g>
                );
              })}

              {/* Main Forklift Driveway */}
              <line x1="200" y1="20" x2="200" y2="460" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
              <text x="204" y="240" fill="#fbbf24" fontSize="9" opacity="0.6" transform="rotate(-90 204 240)">
                PRIMARY FORKLIFT AISLE (4.0m)
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Click any entity to configure racks, levels, and generate location codes.</span>
            <span>Objects: {elements.length} placed</span>
          </div>
        </div>

        {/* Right Inspector Panel (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-sm font-bold text-slate-900">Rack & Bin Inspector</h2>
            <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold">
              {selectedElement?.id || 'None'}
            </span>
          </div>

          {selectedElement ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Entity Label</label>
                <input
                  type="text"
                  value={selectedElement.name}
                  onChange={(e) => {
                    const updated = elements.map((item) =>
                      item.id === selectedElement.id ? { ...item, name: e.target.value } : item
                    );
                    setElements(updated);
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">X Position (m)</label>
                  <input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => {
                      const updated = elements.map((item) =>
                        item.id === selectedElement.id ? { ...item, x: Number(e.target.value) } : item
                      );
                      setElements(updated);
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Y Position (m)</label>
                  <input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => {
                      const updated = elements.map((item) =>
                        item.id === selectedElement.id ? { ...item, y: Number(e.target.value) } : item
                      );
                      setElements(updated);
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              {selectedElement.type === 'rack' && (
                <>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="font-bold text-slate-800">Storage Capacity Config</div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tier Levels:</span>
                      <span className="font-bold text-slate-900">{selectedElement.levels || 3} Levels (L01–L03)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bins Per Level:</span>
                      <span className="font-bold text-slate-900">{selectedElement.binsPerLevel || 3} Bins (B01–B03)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Rack Payload:</span>
                      <span className="font-bold text-slate-900">{(selectedElement.capacityKg || 4500) / 1000} Tons</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                    <div className="font-semibold text-blue-900">Generated Code Hierarchy:</div>
                    <div className="font-mono text-[11px] text-blue-700">
                      WH001-{selectedElement.zone.replace('Zone ', '')}-{selectedElement.id}-L02-B03
                    </div>
                    <div className="text-[10px] text-blue-600">
                      Auto-registers 9 storage bins with unique barcodes in Supabase.
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() => {
                  setElements(elements.filter((e) => e.id !== selectedElement.id));
                  setSelectedElementId('R01');
                }}
                className="w-full py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Object
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-10 text-center">
              Select an element on the canvas to inspect coordinates & properties
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
