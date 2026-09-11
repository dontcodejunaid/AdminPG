import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  EyeOff, 
  Slash, 
  Phone, 
  Building2, 
  MessageSquare, 
  AlertTriangle,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const ReportedPage = ({ onEditPg }) => {
  const { showToast, triggerRefresh } = useApp();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.getReports();
      if (res.data) setReports(res.data);
    } catch (err) {
      showToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (report, shouldDeactivate = false) => {
    try {
      await api.resolveReport(report.id, {
        status: shouldDeactivate ? 'Deactivated' : 'Resolved',
        actionTaken: actionNotes || (shouldDeactivate ? 'Deactivated property due to complaint' : 'Resolved by admin'),
        deactivateListing: shouldDeactivate
      });

      showToast(shouldDeactivate ? 'Listing deactivated & complaint resolved' : 'Complaint resolved', 'success');
      setActionModalOpen(false);
      setActionNotes('');
      fetchReports();
      triggerRefresh();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleIgnore = async (report) => {
    try {
      await api.resolveReport(report.id, {
        status: 'Ignored',
        actionTaken: 'Marked as non-actionable / false alarm'
      });
      showToast('Report dismissed as ignored', 'info');
      fetchReports();
      triggerRefresh();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <AlertOctagon className="w-6 h-6 text-rose-600" />
          Reported Listings Moderation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Investigate user complaints (Wrong price, Fake photos, Full/Unavailable, Wrong contact) and protect seeker trust.
        </p>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading complaints...</div>
      ) : reports.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">All Clean!</h3>
          <p className="text-xs text-slate-500">No active complaints or reported listings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(rep => (
            <div
              key={rep.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Reason: {rep.reason}
                    </span>
                    <Badge variant={rep.status}>{rep.status}</Badge>
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                    {rep.pgName}
                  </h3>
                  
                  <p className="text-xs text-slate-500">
                    Reported by: <span className="font-semibold text-slate-700 dark:text-slate-300">{rep.customerName}</span> ({rep.customerPhone || 'No phone'})
                  </p>
                </div>

                <span className="text-[11px] text-slate-400">
                  {new Date(rep.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Complaint Text Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Complaint Details:</span>
                <p className="text-slate-600 dark:text-slate-400 italic">"{rep.complaint}"</p>
              </div>

              {rep.actionTaken && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Action Taken: {rep.actionTaken}
                </div>
              )}

              {/* Action Buttons */}
              {rep.status === 'Pending' && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => handleIgnore(rep)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                  >
                    Ignore / False Alarm
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReport(rep);
                      setActionNotes('');
                      setActionModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                  >
                    Resolve Issue
                  </button>
                  <button
                    onClick={() => handleResolve(rep, true)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Deactivate Listing</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Resolve Complaint */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={`Resolve Complaint: ${selectedReport?.pgName}`}
        subtitle="Log the resolution action taken with the PG owner or listing correction"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Resolution Note *
            </label>
            <textarea
              rows={3}
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="e.g. Spoke with owner, updated room price from ₹6,500 to ₹8,500."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActionModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleResolve(selectedReport, false)}
              className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              Mark Resolved
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
