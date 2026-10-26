'use client';

import React from 'react';
import { StorageBin } from '@/lib/types';
import { Box, Check, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';

interface RackShelfViewProps {
  rackCode?: string;
  rackId?: string;
  selectedBinCode?: string; // e.g. 'B03' or 'WH001-A-R05-L02-B03'
  onSelectBin?: (bin: StorageBin) => void;
  bins?: StorageBin[];
  highlightBinCode?: string;
  highlightPackageId?: string;
}

export function RackShelfView({
  rackCode = 'R05',
  rackId,
  selectedBinCode = 'B03',
  onSelectBin,
  bins,
  highlightBinCode = 'B03',
  highlightPackageId,
}: RackShelfViewProps) {
  const effectiveRackCode = rackCode || (rackId ? rackId.toUpperCase().replace('R-00', 'R0').replace('R-0', 'R') : 'R05');
  // Default bins for Rack R05 matching screenshot
  const defaultBins: StorageBin[] = [
    // Level 3 (Top)
    { id: 'b31', binCode: 'B01', locationCode: `WH001-A-${rackCode}-L03-B01`, zone: 'A', rackCode, level: 'L03 (Top)', levelNumber: 3, status: 'Occupied', currentWeightKg: 25, maxWeightKg: 100, currentPackagesCount: 1, maxPackagesCount: 5, packageIds: ['PKG-1038'], lastUpdated: '12 Jun 2024' },
    { id: 'b32', binCode: 'B02', locationCode: `WH001-A-${rackCode}-L03-B02`, zone: 'A', rackCode, level: 'L03 (Top)', levelNumber: 3, status: 'Occupied', currentWeightKg: 18, maxWeightKg: 100, currentPackagesCount: 1, maxPackagesCount: 5, packageIds: ['PKG-1039'], lastUpdated: '12 Jun 2024' },
    { id: 'b33', binCode: 'B03', locationCode: `WH001-A-${rackCode}-L03-B03`, zone: 'A', rackCode, level: 'L03 (Top)', levelNumber: 3, status: 'Full', currentWeightKg: 82, maxWeightKg: 100, currentPackagesCount: 5, maxPackagesCount: 5, packageIds: ['PKG-1031', 'PKG-1032'], lastUpdated: '12 Jun 2024' },

    // Level 2 (Middle)
    { id: 'b21', binCode: 'B01', locationCode: `WH001-A-${rackCode}-L02-B01`, zone: 'A', rackCode, level: 'L02 (Middle)', levelNumber: 2, status: 'Available', currentWeightKg: 0, maxWeightKg: 100, currentPackagesCount: 0, maxPackagesCount: 5, packageIds: [], lastUpdated: '11 Jun 2024' },
    { id: 'b22', binCode: 'B02', locationCode: `WH001-A-${rackCode}-L02-B02`, zone: 'A', rackCode, level: 'L02 (Middle)', levelNumber: 2, status: 'Partially Filled', currentWeightKg: 30, maxWeightKg: 100, currentPackagesCount: 2, maxPackagesCount: 5, packageIds: ['PKG-1040'], lastUpdated: '12 Jun 2024' },
    { id: 'b23', binCode: 'B03', locationCode: `WH001-A-${rackCode}-L02-B03`, zone: 'A', rackCode, level: 'L02 (Middle)', levelNumber: 2, status: 'Occupied', currentWeightKg: 25, maxWeightKg: 100, currentPackagesCount: 1, maxPackagesCount: 5, packageIds: ['PKG-1042'], lastUpdated: '12 Jun 2024' },

    // Level 1 (Bottom)
    { id: 'b11', binCode: 'B01', locationCode: `WH001-A-${rackCode}-L01-B01`, zone: 'A', rackCode, level: 'L01 (Bottom)', levelNumber: 1, status: 'Occupied', currentWeightKg: 20, maxWeightKg: 100, currentPackagesCount: 1, maxPackagesCount: 5, packageIds: ['PKG-1040'], lastUpdated: '11 Jun 2024' },
    { id: 'b12', binCode: 'B02', locationCode: `WH001-A-${rackCode}-L01-B02`, zone: 'A', rackCode, level: 'L01 (Bottom)', levelNumber: 1, status: 'Available', currentWeightKg: 0, maxWeightKg: 100, currentPackagesCount: 0, maxPackagesCount: 5, packageIds: [], lastUpdated: '10 Jun 2024' },
    { id: 'b13', binCode: 'B03', locationCode: `WH001-A-${rackCode}-L01-B03`, zone: 'A', rackCode, level: 'L01 (Bottom)', levelNumber: 1, status: 'Blocked', currentWeightKg: 0, maxWeightKg: 100, currentPackagesCount: 0, maxPackagesCount: 5, packageIds: [], lastUpdated: '10 Jun 2024' },
  ];

  const activeBins = bins && bins.length > 0 ? bins : defaultBins;

  const levels = [
    { label: 'L03', sub: '(Top)', number: 3 },
    { label: 'L02', sub: '(Middle)', number: 2 },
    { label: 'L01', sub: '(Bottom)', number: 1 },
  ];

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      {/* Rack Frame Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-slate-900">Rack {rackCode}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Zone A | 3 Levels | 3 Bins/Level | Max 100 kg/bin
        </div>
      </div>

      {/* Industrial Orange Upright Rack Structure */}
      <div className="relative rounded-lg border-4 border-[#ea580c] bg-slate-100 p-2.5 shadow-inner">
        {/* Rack shelf vertical columns */}
        <div className="space-y-3">
          {levels.map((lvl) => {
            const levelBins = activeBins.filter((b) => b.levelNumber === lvl.number);

            return (
              <div key={lvl.label} className="relative flex items-center gap-2">
                {/* Level Tag Label on Left */}
                <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded bg-slate-800 py-2 text-white shadow-xs">
                  <span className="text-xs font-bold leading-tight">{lvl.label}</span>
                  <span className="text-[9px] text-slate-300 leading-tight">{lvl.sub}</span>
                </div>

                {/* Level Bins Container (Shelf horizontal beam) */}
                <div className="grid flex-1 grid-cols-3 gap-2.5 rounded bg-slate-300 p-1.5 border-b-4 border-[#c2410c]">
                  {levelBins.map((bin) => {
                    const isTarget =
                      bin.levelNumber === 2 &&
                      bin.binCode === highlightBinCode;

                    let bgClass = 'bg-white border-slate-200';
                    let badgeClass = 'bg-slate-100 text-slate-700';

                    if (bin.status === 'Occupied') {
                      bgClass = 'bg-slate-50 border-blue-200';
                      badgeClass = 'bg-blue-100 text-blue-700';
                    } else if (bin.status === 'Available') {
                      bgClass = 'bg-emerald-50/50 border-emerald-200';
                      badgeClass = 'bg-emerald-100 text-emerald-700';
                    } else if (bin.status === 'Full') {
                      bgClass = 'bg-red-50/50 border-red-200';
                      badgeClass = 'bg-red-100 text-red-700';
                    } else if (bin.status === 'Partially Filled') {
                      bgClass = 'bg-sky-50/50 border-sky-200';
                      badgeClass = 'bg-sky-100 text-sky-700';
                    } else if (bin.status === 'Blocked') {
                      bgClass = 'bg-amber-50/70 border-amber-300';
                      badgeClass = 'bg-amber-100 text-amber-800';
                    }

                    return (
                      <div
                        key={bin.id}
                        onClick={() => onSelectBin?.(bin)}
                        className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:shadow-md ${bgClass} ${
                          isTarget
                            ? 'ring-3 ring-cyan-400 border-cyan-500 shadow-md scale-[1.02]'
                            : ''
                        }`}
                      >
                        {/* Bin Code header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                          <span className="text-[11px] font-extrabold text-slate-800">
                            {bin.binCode}
                          </span>
                          <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${badgeClass}`}>
                            {bin.status}
                          </span>
                        </div>

                        {/* Bin Content Representation */}
                        <div className="mt-1.5 flex flex-col items-center justify-center min-h-[46px] text-center">
                          {bin.packageIds.length > 0 ? (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-900">
                                {bin.packageIds[0]}
                              </span>
                              <span className="text-[9px] text-slate-500">
                                {bin.currentWeightKg} kg
                              </span>
                            </div>
                          ) : bin.status === 'Blocked' ? (
                            <div className="flex flex-col items-center text-amber-700">
                              <Wrench className="h-3.5 w-3.5" />
                              <span className="text-[9px] font-medium">Maintenance</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-slate-400">
                              <span className="text-[9px]">0/5 pkgs</span>
                              <span className="text-[9px]">0 kg</span>
                            </div>
                          )}
                        </div>

                        {/* Highlighted Marker Badge */}
                        {isTarget && (
                          <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white shadow-xs">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RackShelfView;

