import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Phone, 
  ShieldCheck, 
  BookOpen, 
  Save, 
  Plus, 
  Trash2,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const PagesCmsPage = () => {
  const { showToast, currentUser } = useApp();
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('aboutUs'); // 'aboutUs' | 'contactUs' | 'faq' | 'terms' | 'privacy'

  // Section States
  const [aboutUs, setAboutUs] = useState({ title: '', subtitle: '', content: '' });
  const [contactUs, setContactUs] = useState({ phone: '', whatsapp: '', email: '', officeAddress: '', operatingHours: '', supportNote: '' });
  const [faqs, setFaqs] = useState([]);
  const [terms, setTerms] = useState({ content: '' });
  const [privacy, setPrivacy] = useState({ content: '' });

  const fetchCms = async () => {
    try {
      setLoading(true);
      const res = await api.getCms();
      if (res.data) {
        setCms(res.data);
        if (res.data.aboutUs) setAboutUs(res.data.aboutUs);
        if (res.data.contactUs) setContactUs(res.data.contactUs);
        if (res.data.faq) setFaqs(res.data.faq);
        if (res.data.termsAndConditions) setTerms(res.data.termsAndConditions);
        if (res.data.privacyPolicy) setPrivacy(res.data.privacyPolicy);
      }
    } catch (err) {
      showToast('Failed to load CMS content', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCms();
  }, []);

  const handleSave = async (section, data) => {
    if (!currentUser.permissions.canManageCMS) {
      showToast('Permission Denied: Staff cannot edit CMS content', 'error');
      return;
    }
    try {
      await api.updateCms(section, data);
      showToast(`Saved ${section} successfully!`, 'success');
      fetchCms();
    } catch (err) {
      showToast('Save failed', 'error');
    }
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setFaqs(prev => [...prev, { id: `faq_${Date.now()}`, question: 'New Question', answer: 'Answer text...' }]);
  };

  const handleRemoveFaq = (id) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const handleFaqChange = (id, field, val) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-brand-600" />
          Pages & Content Management
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Edit platform content, FAQs, support contacts, About Us, and legal policies without developer help.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'aboutUs', label: 'About Us', icon: BookOpen },
          { id: 'contactUs', label: 'Contact Us & Support', icon: Phone },
          { id: 'faq', label: `FAQs (${faqs.length})`, icon: HelpCircle },
          { id: 'terms', label: 'Terms & Conditions', icon: ShieldCheck },
          { id: 'privacy', label: 'Privacy Policy', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Form Container */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* SECTION 1: ABOUT US */}
        {activeSection === 'aboutUs' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit About Us Page</h3>
              <button
                onClick={() => handleSave('aboutUs', aboutUs)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Headline Title</label>
              <input
                type="text"
                value={aboutUs.title}
                onChange={(e) => setAboutUs({ ...aboutUs, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle / Mission Statement</label>
              <input
                type="text"
                value={aboutUs.subtitle}
                onChange={(e) => setAboutUs({ ...aboutUs, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Story / Overview</label>
              <textarea
                rows={6}
                value={aboutUs.content}
                onChange={(e) => setAboutUs({ ...aboutUs, content: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* SECTION 2: CONTACT US */}
        {activeSection === 'contactUs' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Helpline & Contact Information</h3>
              <button
                onClick={() => handleSave('contactUs', contactUs)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Support Phone</label>
                <input
                  type="text"
                  value={contactUs.phone}
                  onChange={(e) => setContactUs({ ...contactUs, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Official WhatsApp Helpline</label>
                <input
                  type="text"
                  value={contactUs.whatsapp}
                  onChange={(e) => setContactUs({ ...contactUs, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Support Email</label>
                <input
                  type="text"
                  value={contactUs.email}
                  onChange={(e) => setContactUs({ ...contactUs, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={contactUs.operatingHours}
                  onChange={(e) => setContactUs({ ...contactUs, operatingHours: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Physical Office Address</label>
              <textarea
                rows={2}
                value={contactUs.officeAddress}
                onChange={(e) => setContactUs({ ...contactUs, officeAddress: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* SECTION 3: FAQs */}
        {activeSection === 'faq' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Frequently Asked Questions ({faqs.length})</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddFaq}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
                <button
                  onClick={() => handleSave('faq', faqs)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save FAQs</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={faq.id || idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">FAQ #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveFaq(faq.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                    placeholder="Question..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />

                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                    placeholder="Answer explanation..."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: TERMS & CONDITIONS */}
        {activeSection === 'terms' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Terms & Conditions</h3>
              <button
                onClick={() => handleSave('termsAndConditions', terms)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Terms</span>
              </button>
            </div>
            <textarea
              rows={12}
              value={terms.content}
              onChange={(e) => setTerms({ ...terms, content: e.target.value })}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none leading-relaxed font-mono"
            />
          </div>
        )}

        {/* SECTION 5: PRIVACY POLICY */}
        {activeSection === 'privacy' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Privacy Policy</h3>
              <button
                onClick={() => handleSave('privacyPolicy', privacy)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Privacy Policy</span>
              </button>
            </div>
            <textarea
              rows={12}
              value={privacy.content}
              onChange={(e) => setPrivacy({ ...privacy, content: e.target.value })}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none leading-relaxed font-mono"
            />
          </div>
        )}

      </div>

    </div>
  );
};
