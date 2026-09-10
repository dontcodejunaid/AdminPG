import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  AlertOctagon, 
  CreditCard, 
  Building2, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const NotificationsPage = () => {
  const { showToast, setUnreadNotifsCount, setActiveTab } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      if (res.data) {
        setNotifications(res.data);
        if (res.unreadCount !== undefined) setUnreadNotifsCount(res.unreadCount);
      }
    } catch (err) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      showToast('All notifications marked as read', 'success');
      setUnreadNotifsCount(0);
      fetchNotifs();
    } catch (err) {
      showToast('Failed to mark read', 'error');
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await api.markNotificationRead(notif.id);
    }
    if (notif.link) {
      const tab = notif.link.replace('/', '');
      setActiveTab(tab);
    }
    fetchNotifs();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'enquiry': return <MessageSquare className="w-4 h-4 text-sky-500" />;
      case 'report': return <AlertOctagon className="w-4 h-4 text-rose-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-brand-600" />
            Notifications & Platform Activity (Module 14)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time feed of new enquiries, reported listings, and ₹19 owner contact unlock events
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-emerald-500" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading activity...</div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">No activity logged yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                !n.read 
                  ? 'bg-brand-50/50 border-brand-200 dark:bg-brand-950/30 dark:border-brand-900/50 shadow-sm' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand-600" />}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(n.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-xs font-bold text-brand-600 dark:text-brand-400">
                <span className="hidden sm:inline">Open</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
