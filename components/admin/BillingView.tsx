'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store-context';
import { Invoice } from '@/lib/types';
import {
  CreditCard,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Phone,
  Calendar,
  FileText,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function BillingView() {
  const { invoices, recordPayment } = useAppStore();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'quotes' | 'credit' | 'price' | 'usage' | 'settings'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[1] || invoices[0] || {} as Invoice);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment Recording form state
  const [paymentAmount, setPaymentAmount] = useState(selectedInvoice.amountTzs || 1250000);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Revenue overview monthly data
  const revenueMonthly = [
    { month: 'Jan', paid: 1.8, pending: 0.6, overdue: 0.2 },
    { month: 'Feb', paid: 2.2, pending: 0.5, overdue: 0.3 },
    { month: 'Mar', paid: 2.8, pending: 0.7, overdue: 0.2 },
    { month: 'Apr', paid: 2.5, pending: 0.8, overdue: 0.4 },
    { month: 'May', paid: 3.2, pending: 0.9, overdue: 0.3 },
    { month: 'Jun', paid: 3.4, pending: 0.8, overdue: 0.3 },
  ];

  // Revenue by Service donut
  const serviceShare = [
    { name: 'Storage Fees', value: 38, color: '#2563eb' },
    { name: 'Shipping', value: 27, color: '#10b981' },
    { name: 'Handling', value: 15, color: '#38bdf8' },
    { name: 'Transport', value: 12, color: '#8b5cf6' },
    { name: 'Other', value: 8, color: '#f59e0b' },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice.id) return;
    recordPayment(
      selectedInvoice.id,
      paymentAmount,
      paymentMethod,
      paymentReference || `TX-${Date.now().toString().slice(-6)}`
    );
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Billing & Invoices</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer receivables, automated storage billing, payments, and financial ledgers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting financial report as CSV...')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </button>
          <button
            onClick={() => alert('Open Create Invoice Form')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Total Invoiced</span>
          <p className="text-xl font-black text-slate-900 mt-1">TZS 18.5M</p>
          <span className="text-[10px] text-emerald-600 font-semibold">&uarr; 12% vs last month</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Paid</span>
          <p className="text-xl font-black text-emerald-600 mt-1">TZS 12.8M</p>
          <span className="text-[10px] text-emerald-600 font-semibold">&uarr; 18%</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Pending Payment</span>
          <p className="text-xl font-black text-amber-600 mt-1">TZS 4.6M</p>
          <span className="text-[10px] text-rose-600 font-semibold">&darr; 8%</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Overdue</span>
          <p className="text-xl font-black text-rose-600 mt-1">TZS 1.1M</p>
          <span className="text-[10px] text-rose-600 font-semibold">&uarr; 22%</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-500">Total Invoices</span>
          <p className="text-xl font-black text-purple-700 mt-1">428</p>
          <span className="text-[10px] text-emerald-600 font-semibold">&uarr; 14%</span>
        </div>
      </div>

      {/* Tabs Row matching screenshot */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        {[
          { id: 'invoices', label: 'Invoices' },
          { id: 'payments', label: 'Payments' },
          { id: 'quotes', label: 'Quotes' },
          { id: 'credit', label: 'Credit Notes' },
          { id: 'price', label: 'Price List' },
          { id: 'usage', label: 'Usage & Charges' },
          { id: 'settings', label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upper Section: Revenue Overview Stacked Bar & Revenue by Service Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Revenue Overview Stacked Bar (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900">Revenue Overview</h3>
            <span className="text-[10px] text-slate-400">TZS in Millions</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="paid" stackId="a" fill="#10b981" name="Paid" />
                <Bar dataKey="pending" stackId="a" fill="#3b82f6" name="Pending" />
                <Bar dataKey="overdue" stackId="a" fill="#f59e0b" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-slate-600 border-t border-slate-100">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Paid</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Pending</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Overdue</span>
          </div>
        </div>

        {/* Revenue by Service Donut (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Revenue by Service</h3>
          <div className="flex items-center justify-between">
            <div className="relative flex items-center justify-center h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceShare} dataKey="value" innerRadius={40} outerRadius={60}>
                    {serviceShare.map((e, idx) => (
                      <Cell key={idx} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-black text-slate-900">TZS 18.5M</span>
                <span className="text-[8px] text-slate-400">Total Revenue</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600">
              {serviceShare.map((s) => (
                <div key={s.name} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-bold text-slate-900">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Invoices List Table (7 cols) & Right Invoice Preview / Record Payment (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Invoices Table */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoice number, customer, shipment..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-9 pr-3 text-xs"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Invoice No.</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Amount (TZS)</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInvoices.map((inv, idx) => {
                  const isSelected = selectedInvoice.id === inv.id;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setPaymentAmount(inv.amountTzs);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 truncate max-w-[130px]">
                        {inv.customerName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{inv.type}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {inv.amountTzs.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{inv.dueDate}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : inv.status === 'Pending'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-xs text-slate-500 bg-slate-50/50">
            <span>Showing 1 - {filteredInvoices.length} of 428 invoices</span>
            <div className="flex items-center gap-1">
              <button className="rounded p-1 border border-slate-200"><ChevronLeft className="h-3.5 w-3.5" /></button>
              <button className="rounded px-2.5 py-0.5 bg-blue-600 text-white font-bold">1</button>
              <button className="rounded px-2.5 py-0.5 border border-slate-200">2</button>
              <button className="rounded p-1 border border-slate-200"><ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Right Invoice Preview & Record Payment Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Invoice Document Preview Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900">Invoice Preview</h3>
              <button
                onClick={() => alert(`Downloading PDF for ${selectedInvoice.invoiceNumber}...`)}
                className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Document Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-black text-sm text-slate-900">SWAHIVO</p>
                <p className="text-[10px] text-blue-600 -mt-0.5 font-bold">Logistics OS</p>
                <div className="mt-2 text-[11px] text-slate-600">
                  <p className="text-slate-400 font-medium">Bill To:</p>
                  <p className="font-bold text-slate-900">{selectedInvoice.customerName}</p>
                  <p>{selectedInvoice.customerAddress || 'Plot 56, Kisimani Road, Zanzibar, Tanzania'}</p>
                  <p className="text-slate-400">TIN: 123-456-789</p>
                </div>
              </div>
              <div className="text-right text-[11px]">
                <h4 className="text-base font-black text-slate-900 uppercase">INVOICE</h4>
                <p className="font-mono text-slate-500">{selectedInvoice.invoiceNumber}</p>
                <p className="text-slate-400 mt-1">Issue Date: <strong className="text-slate-700">{selectedInvoice.issueDate}</strong></p>
                <p className="text-slate-400">Due Date: <strong className="text-slate-700">{selectedInvoice.dueDate}</strong></p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>
            </div>

            {/* Line items table */}
            <div className="rounded border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-1.5">Description</th>
                    <th className="p-1.5">Qty</th>
                    <th className="p-1.5 text-right">Amount (TZS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedInvoice.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5">{it.description}</td>
                      <td className="p-1.5">{it.quantity}</td>
                      <td className="p-1.5 text-right font-mono">{it.amountTzs?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-1 text-right text-[11px] pt-1">
              <p className="text-slate-500">Subtotal: <strong className="text-slate-800">TZS {selectedInvoice.subtotalTzs?.toLocaleString()}</strong></p>
              <p className="text-slate-500">VAT (0%): <strong className="text-slate-800">0</strong></p>
              <p className="text-sm font-black text-blue-700">Total (TZS): {selectedInvoice.amountTzs?.toLocaleString()}</p>
            </div>
          </div>

          {/* Payment Information & Record Payment Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
              Payment Information & Settlement
            </h3>

            {/* Payment Methods Info */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
              <div>
                <p className="font-bold text-slate-900">Bank Transfer</p>
                <p className="text-[10px]">CRDB Bank: 0152 3456 7890</p>
                <p className="text-[10px] text-slate-400">Swahivo Logistics Ltd</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">Mobile Money</p>
                <p className="text-[10px]">M-Pesa: 255 712 345 678</p>
                <p className="text-[10px]">Airtel Money: 255 758 123 456</p>
              </div>
            </div>

            {/* Record Payment Form */}
            <form onSubmit={handleRecordPayment} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Amount (TZS)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="mt-0.5 w-full rounded border border-slate-200 p-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-0.5 w-full rounded border border-slate-200 p-1.5 text-xs"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money (M-Pesa)">M-Pesa</option>
                    <option value="Mobile Money (Airtel)">Airtel Money</option>
                    <option value="Cash / Cheque">Cash / Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500">Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. CRDB-TX-882910"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="mt-0.5 w-full rounded border border-slate-200 p-1.5 text-xs"
                />
              </div>

              {paymentSuccess && (
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Payment recorded and invoice marked as Paid!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                Record Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingView;

