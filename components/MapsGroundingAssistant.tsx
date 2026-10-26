'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, ExternalLink, Send, X, Compass, Loader2 } from 'lucide-react';

interface MapsGroundingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MapsGroundingAssistant({ isOpen, onClose }: MapsGroundingAssistantProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMarkdown, setResponseMarkdown] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<{ uri: string; title: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Check highway route & toll status from Dar es Salaam to Arusha via Morogoro',
    'Best ferry schedule and cargo terminal access for Zanzibar Port',
    'Cross-border customs checkpoints between Tanzania and Rwanda (Kigali route)',
    'Truck weighbridges and road conditions between Dar es Salaam and Mwanza',
  ];

  const handleAsk = async (promptToUse?: string) => {
    const q = promptToUse || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResponseMarkdown(null);
    setGroundingLinks([]);

    try {
      const res = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          latitude: -6.7924,
          longitude: 39.2083,
          locationName: 'Dar es Salaam, Tanzania',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      setResponseMarkdown(data.text);

      // Extract Google Maps grounding chunks as URLs
      const links: { uri: string; title: string }[] = [];
      if (Array.isArray(data.groundingChunks)) {
        for (const chunk of data.groundingChunks) {
          if (chunk.maps?.uri) {
            links.push({
              uri: chunk.maps.uri,
              title: chunk.maps.title || 'Google Maps Location',
            });
          }
        }
      }
      setGroundingLinks(links);
    } catch (err: any) {
      console.error('Maps Grounding error:', err);
      setErrorMsg(err.message || 'Failed to query Maps Grounding service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl border-l border-slate-200">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">GIS Route & Highway Intelligence</h3>
            <p className="text-[11px] text-blue-200">Powered by Gemini 3.8 Flash + Google Maps</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 text-xs text-blue-900">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Real-Time East African Corridor Grounding</span>
          </div>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Verify actual highway distances, bypass routes, ferry logistics, customs border points, and road conditions across Dar es Salaam, Zanzibar, Dodoma, Arusha, Mwanza, Kigali, and Nairobi.
          </p>
        </div>

        {/* Quick Suggestions */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Quick Route Queries
          </span>
          <div className="mt-2 space-y-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleAsk(p);
                }}
                className="w-full text-left rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-xs text-slate-700 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-xs font-medium">Grounding route with Google Maps...</p>
          </div>
        )}

        {/* Error State */}
        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
            <p className="font-semibold">Unable to fetch intelligence</p>
            <p className="text-[11px] mt-0.5">{errorMsg}</p>
          </div>
        )}

        {/* Response */}
        {responseMarkdown && (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-800 shadow-xs leading-relaxed whitespace-pre-wrap">
              {responseMarkdown}
            </div>

            {/* Google Maps Links from Grounding Chunks */}
            {groundingLinks.length > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                <p className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Google Maps Grounded Places:</span>
                </p>
                <div className="space-y-1.5">
                  {groundingLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg bg-white p-2 text-xs font-medium text-blue-700 hover:bg-slate-50 border border-emerald-100"
                    >
                      <span className="truncate">{link.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about a route, checkpoint, or terminal..."
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MapsGroundingAssistant;

