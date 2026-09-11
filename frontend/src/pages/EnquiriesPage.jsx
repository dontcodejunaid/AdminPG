import React, { useState, useEffect } from 'react';
import { 
  MessageSquareText, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  User, 
  Building2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CustomSelect } from '../components/ui/select';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const EnquiriesPage = () => {
  const { showToast, triggerRefresh } = useApp();
  const [enquiries, setEnquiries] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [adminNoteText, setAdminNoteText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pgId: '',
    pgName: '',
    roomType: '2 Sharing',
    budget: '₹8,000',
    moveInDate: '',
    message: '',
    status: 'New',
    adminNotes: ''
  });

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const [enqRes, pgRes] = await Promise.all([
        api.getEnquiries(params),
        api.getProperties()
      ]);
      if (enqRes.data) setEnquiries(enqRes.data);
      if (pgRes.data) setProperties(pgRes.data);
    } catch (err) {
      showToast('Failed to load enquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search, statusFilter]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await api.updateEnquiryStatus(enquiryId, { status: newStatus });
      showToast(`Lead updated to: ${newStatus}`, 'success');
      fetchEnquiries();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      await api.updateEnquiryStatus(selectedEnquiry.id, { adminNotes: adminNoteText });
      showToast('Admin notes saved', 'success');
      setNotesModalOpen(false);
      fetchEnquiries();
    } catch (err) {
      showToast('Failed to save notes', 'error');
    }
  };

  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.pgId) {
      showToast('Please fill required fields', 'error');
      return;
    }
    try {
      const matchedPg = properties.find(p => p.id === formData.pgId);
      const payload = {
        ...formData,
        pgName: matchedPg ? matchedPg.name : 'Selected PG'
      };
      await api.createEnquiry(payload);
      showToast('New lead recorded successfully!', 'success');
      setIsAddModalOpen(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        pgId: '',
        pgName: '',
        roomType: '2 Sharing',
        budget: '',
        moveInDate: '',
        message: '',
        status: 'New',
        adminNotes: ''
      });
      fetchEnquiries();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to record lead', 'error');
    }
  };

  const statuses = ['New', 'Contacted', 'Interested', 'Visited', 'Closed'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <MessageSquareText className="w-6 h-6 text-brand-600" />
            Customer Enquiries & Leads CRM
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track inquiries, callbacks, and visit scheduling. Move leads through the sales pipeline.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Customer Lead</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lead by name, phone, PG..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
          />
        </div>

        {/* Pipeline Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === '' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All ({enquiries.length})
          </button>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading leads...</div>
      ) : enquiries.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">No enquiries found</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Interested PG & Room</th>
                  <th className="py-3 px-4">Budget / Date</th>
                  <th className="py-3 px-4">Lead Status Pipeline</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-brand-600" />
                        {enq.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {enq.customerPhone} {enq.customerEmail ? `• ${enq.customerEmail}` : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {enq.pgName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {enq.roomType || 'Standard'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-600 dark:text-brand-400">
                        {enq.budget || 'Not specified'}
                      </span>
                      {enq.moveInDate && (
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Move: {enq.moveInDate}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <CustomSelect
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                          className="py-1 px-2 font-bold text-xs"
                          options={statuses.map(st => ({ value: st, label: st }))}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setAdminNoteText(enq.adminNotes || '');
                          setNotesModalOpen(true);
                        }}
                        className="text-left group"
                      >
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 max-w-[160px] group-hover:underline">
                          {enq.adminNotes || 'Add admin note'}
                        </p>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${enq.customerPhone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:scale-110 transition-transform"
                          title="WhatsApp Chat"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${enq.customerPhone}`}
                          className="p-1.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 hover:scale-110 transition-transform"
                          title="Direct Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Record New Lead */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record New Customer Lead / Enquiry"
        subtitle="Manually register an enquiry received via phone, walk-in, or WhatsApp"
      >
        <form onSubmit={handleCreateEnquiry} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Rahul Menon"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target PG Property *</label>
            <CustomSelect
              value={formData.pgId}
              onChange={(e) => setFormData({ ...formData, pgId: e.target.value })}
              placeholder="Select Property"
              searchable={true}
              options={properties.map(p => ({
                value: p.id,
                label: `${p.name} (${p.city || 'Kerala'})`
              }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Room Sharing</label>
              <CustomSelect
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                options={[
                  { value: 'Single Sharing', label: 'Single Sharing' },
                  { value: '2 Sharing', label: '2 Sharing' },
                  { value: '3 Sharing', label: '3 Sharing' },
                  { value: '4 Sharing', label: '4 Sharing' }
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Budget (₹)</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. ₹9,000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Expected Move-in</label>
              <input
                type="date"
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Notes / Requirements</label>
            <textarea
              rows={2}
              value={formData.adminNotes}
              onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
              placeholder="Notes from initial conversation..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              Save Lead
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Notes */}
      <Modal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        title={`Admin Notes: ${selectedEnquiry?.customerName || 'Lead'}`}
        subtitle="Keep track of callback commitments, visit feedback, and admission token payments"
      >
        <div className="space-y-4">
          <textarea
            rows={4}
            value={adminNoteText}
            onChange={(e) => setAdminNoteText(e.target.value)}
            placeholder="Type notes here..."
            className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNotesModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveNotes}
              className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              Save Notes
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
