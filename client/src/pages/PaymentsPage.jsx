import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Download, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const PaymentsPage = () => {
  const { showToast, currentUser, triggerRefresh } = useApp();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Simulate Payment Modal
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    pgName: '',
    amount: 19,
    status: 'Success',
    paymentGateway: 'UPI / Razorpay'
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await api.getPayments(params);
      if (res.data) setPayments(res.data);
    } catch (err) {
      showToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [search, statusFilter]);

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) {
      showToast('Please fill customer details', 'error');
      return;
    }
    try {
      await api.createPayment(formData);
      showToast('Transaction logged successfully!', 'success');
      setIsSimulateModalOpen(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        pgName: '',
        amount: 19,
        status: 'Success',
        paymentGateway: 'UPI / Razorpay'
      });
      fetchPayments();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to record transaction', 'error');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Customer Name', 'Phone', 'PG Name', 'Amount (INR)', 'Status', 'Gateway', 'Date'];
    const rows = payments.map(p => [
      p.transactionId,
      `"${p.customerName}"`,
      p.customerPhone,
      `"${p.pgName}"`,
      p.amount,
      p.status,
      p.paymentGateway,
      new Date(p.date).toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KeralaPG_Payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported transactions to CSV', 'success');
  };

  const totalCollected = payments.filter(p => p.status === 'Success').reduce((sum, p) => sum + (p.amount || 0), 0);
  const successCount = payments.filter(p => p.status === 'Success').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-brand-600" />
            Payments & ₹19 Transaction System (Module 11)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Architecture ready for customer ₹19 owner unlock fees and PG listing subscriptions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          {currentUser.permissions.canManagePayments && (
            <button
              onClick={() => setIsSimulateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Unlocks Revenue</span>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">₹{totalCollected.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">₹19 Micro-Payments collected</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Successful Transactions</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{successCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Direct Owner Unlocks</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Gateway Status</span>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Razorpay / UPI Webhook Ready
          </p>
          <span className="text-[11px] text-slate-400">Database decoupled & scalable</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Tx ID, customer, phone, PG..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none w-full sm:w-48"
        >
          <option value="">All Payment Statuses</option>
          <option value="Success">Success Only</option>
          <option value="Pending">Pending Only</option>
          <option value="Failed">Failed Only</option>
        </select>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading transactions...</div>
      ) : payments.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">No payment records found.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Purpose / PG</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {tx.transactionId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{tx.customerName}</div>
                      <div className="text-[11px] text-slate-500">{tx.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{tx.pgName}</div>
                      <div className="text-[10px] text-slate-400">{tx.purpose}</div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-brand-600 dark:text-brand-400">
                      ₹{tx.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={tx.status}>{tx.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {tx.paymentGateway}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(tx.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Simulate / Record Payment */}
      <Modal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        title="Record Customer Payment (₹19 Plan)"
        subtitle="Simulate or manually record a transaction from UPI or gateway"
      >
        <form onSubmit={handleSimulatePayment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Salih Rahman"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Phone *</label>
              <input
                type="text"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="+91 98470 00000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PG Name</label>
              <input
                type="text"
                value={formData.pgName}
                onChange={(e) => setFormData({ ...formData, pgName: e.target.value })}
                placeholder="e.g. Malabar Luxury PG"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none font-bold text-brand-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              >
                <option value="Success">🟢 Success</option>
                <option value="Pending">🟡 Pending</option>
                <option value="Failed">🔴 Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
              <select
                value={formData.paymentGateway}
                onChange={(e) => setFormData({ ...formData, paymentGateway: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="UPI / Razorpay">UPI / Razorpay</option>
                <option value="UPI / PhonePe">UPI / PhonePe</option>
                <option value="Google Pay">Google Pay</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSimulateModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
