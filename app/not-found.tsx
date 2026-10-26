'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen bg-[#0f172a] items-center justify-center text-white px-4">
      <div className="text-center max-w-md space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Package className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">404 - Page Not Found</h1>
        <p className="text-xs text-slate-400">
          The logistics resource or route you requested could not be located on SWAHIVO Logistics OS.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
