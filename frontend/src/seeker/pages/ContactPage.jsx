import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Send, CheckCircle2, Sparkles, Navigation, ExternalLink, Bus, Car, Mail, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import PageTransition from '../components/PageTransition';
import { api } from '../../services/api';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [cmsContact, setCmsContact] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getCms()
      .then((res) => {
        if (res && res.data && res.data.contactUs && isMounted) {
          setCmsContact(res.data.contactUs);
        }
      })
      .catch((err) => console.warn('CMS Contact fetch error:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      roomType: '1 BHK',
    },
  });

  const onSubmit = async (data) => {
    const mockRef = 'KERALAPG-' + Math.floor(100000 + Math.random() * 900000);
    setRefCode(mockRef);

    try {
      await api.createEnquiry({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        room_type: data.roomType,
        source: 'Website Contact Page',
        message: `${data.notes ? data.notes + ' | ' : ''}Move-in: ${data.moveInDate || 'Immediate'} | Ref: ${mockRef}`,
        status: 'New',
      });
    } catch (err) {
      console.warn('Backend enquiry save non-blocking error:', err);
    }

    setFormSubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4A64A', '#f59e0b', '#FAF7F0'],
      });
    } catch (e) {}
  };

  const primaryPhone = cmsContact?.phone || '8747049377';
  const whatsappNum = cmsContact?.whatsapp || '8747049377';
  const supportEmail = cmsContact?.email || 'support@keralapg.com';
  const addressText = cmsContact?.officeAddress || 'In front of Meghana Gents & Ladies PG, Sannidhi Layout, 2, Bande Nalla Sandra Rd, near HCL Gate, Bande Nalla Sandra, Bengaluru, Karnataka 560105';
  const hoursText = cmsContact?.operatingHours || 'Open All Days, 7 AM – 11 PM';

  const contactNumbers = [
    { title: 'Primary Helpline', number: primaryPhone, tel: `tel:+91${primaryPhone.replace(/[^0-9]/g, '')}` },
    { title: 'WhatsApp Desk', number: whatsappNum, tel: `https://wa.me/91${whatsappNum.replace(/[^0-9]/g, '')}` },
    { title: 'Support Hotline', number: '9745688880', tel: 'tel:+919745688880' },
    { title: 'Front Desk', number: '099000 82615', tel: 'tel:09900082615' },
  ];

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
            <Phone className="w-4 h-4 text-[#D4A64A]" />
            <span>Direct Support Hotlines & Directions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 font-sora tracking-tight">
            Connect With <span className="text-gradient-gold">KeralaPG Hub</span>
          </h2>
          <p className="opacity-80 text-base sm:text-lg">
            Schedule a property walk-through, enquire about verified room rates, or reserve your daily stay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Address, Phone Numbers, Operating Hours */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Address Card */}
            <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4A64A]/20 border border-[#D4A64A]/40 text-[#D4A64A] flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-sora">KeralaPG Central Campus</h3>
                    <p className="text-xs text-[#D4A64A] font-mono">Near HCL Gate & Electronic City, Bengaluru</p>
                  </div>
                </div>
                {cmsContact && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live
                  </span>
                )}
              </div>
              
              <p className="opacity-90 text-sm leading-relaxed mb-6 font-medium whitespace-pre-line">
                {addressText}
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="https://maps.google.com/?q=Sannidhi+Layout+2+Bande+Nalla+Sandra+Rd+Bengaluru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-[#D4A64A]/15 text-[#D4A64A] hover:bg-[#D4A64A]/25 border border-[#D4A64A]/30 font-bold text-xs transition-all"
                  data-cursor="expand"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://wa.me/91${whatsappNum.replace(/[^0-9]/g, '')}?text=Hello%20KeralaPG%20Team!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold text-xs transition-all"
                  data-cursor="expand"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>

            {/* Transport Guide Card */}
            <div className="rounded-3xl glass-card border border-white/15 p-6 shadow-xl space-y-3">
              <h4 className="text-xs font-mono uppercase text-[#D4A64A] tracking-wider font-bold">
                Transport & Reachability
              </h4>
              <div className="flex items-center gap-3 text-xs opacity-85">
                <Car className="w-4 h-4 text-[#D4A64A] shrink-0" />
                <span><strong>HCL Gate & Tech Parks:</strong> 2 Minutes Walk / 300 Meters</span>
              </div>
              <div className="flex items-center gap-3 text-xs opacity-85">
                <Mail className="w-4 h-4 text-[#D4A64A] shrink-0" />
                <span><strong>Support Email:</strong> {supportEmail}</span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="rounded-3xl glass-card border border-white/15 p-6 shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A64A]/15 border border-[#D4A64A]/30 text-[#D4A64A] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] opacity-60 font-mono uppercase">Desk Operating Hours</span>
                <h4 className="text-lg font-bold font-sora">{hoursText}</h4>
                <p className="text-xs opacity-75">Walk-in campus visits & phone support open daily.</p>
              </div>
            </div>

            {/* Click-to-Call Phone Numbers */}
            <div className="rounded-3xl glass-card border border-white/15 p-6 shadow-xl">
              <h4 className="text-xs font-mono uppercase opacity-60 tracking-wider mb-4">
                Click-to-Call Phone Hotlines
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contactNumbers.map((p, idx) => (
                  <a
                    key={idx}
                    href={`tel:${p.tel}`}
                    className="flex flex-col p-3 rounded-2xl bg-[#FAF7F0]/5 hover:bg-[#D4A64A]/20 border border-white/10 hover:border-[#D4A64A]/40 transition-all group"
                    data-cursor="expand"
                  >
                    <span className="text-[10px] opacity-60 font-mono">{p.title}</span>
                    <span className="text-sm font-bold group-hover:text-[#D4A64A] font-mono flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#D4A64A]" />
                      <span>{p.number}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7 rounded-3xl glass-card border border-[#D4A64A]/30 p-8 shadow-2xl">
            
            {!formSubmitted ? (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-mono uppercase text-[#D4A64A] bg-[#D4A64A]/15 px-2.5 py-1 rounded border border-[#D4A64A]/30">
                    Direct Inquiry Form
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-sora mt-2">
                    Send Us an Instant Inquiry
                  </h3>
                  <p className="text-xs opacity-75 mt-1">
                    Fill out your details below and our campus desk will respond within 15 minutes.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Nair"
                      {...register('fullName', { required: 'Name is required' })}
                      className="w-full px-4 py-3.5 rounded-xl glass-card text-sm focus:outline-none focus:border-[#D4A64A] transition-colors"
                    />
                    {errors.fullName && (
                      <span className="text-xs text-rose-400 mt-1 block">{errors.fullName.message}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit Mobile"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: { value: /^[0-9]{10}$/, message: 'Valid 10-digit number' }
                        })}
                        className="w-full px-4 py-3.5 rounded-xl glass-card text-sm focus:outline-none focus:border-[#D4A64A] transition-colors"
                      />
                      {errors.phone && (
                        <span className="text-xs text-rose-400 mt-1 block">{errors.phone.message}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@email.com"
                        {...register('email')}
                        className="w-full px-4 py-3.5 rounded-xl glass-card text-sm focus:outline-none focus:border-[#D4A64A] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                        Preferred Room Type
                      </label>
                      <select
                        {...register('roomType')}
                        className="w-full px-4 py-3.5 rounded-xl glass-card text-sm focus:outline-none focus:border-[#D4A64A] transition-colors bg-[#0B1220]"
                      >
                        <option value="1 BHK">1 BHK Suite</option>
                        <option value="2 BHK Sharing">2 BHK Sharing</option>
                        <option value="Single Room">Single Room</option>
                        <option value="Daily Stay (₹499/day)">Daily Stay (₹499/day)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                        Preferred Move-in Date
                      </label>
                      <input
                        type="date"
                        {...register('moveInDate')}
                        className="w-full px-4 py-3.5 rounded-xl glass-card text-sm focus:outline-none focus:border-[#D4A64A] transition-colors bg-[#0B1220]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                      Notes / Message
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Mention any specific preferences..."
                      {...register('notes')}
                      className="w-full px-4 py-3 rounded-xl glass-card text-sm focus:outline-none focus:border-[#D4A64A] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] font-bold text-base shadow-xl shadow-[#D4A64A]/30 hover:shadow-[#D4A64A]/50 transition-all"
                    data-cursor="expand"
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit Inquiry</span>
                  </button>

                </form>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#D4A64A]/20 border border-[#D4A64A]/40 text-[#D4A64A] flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-sora mb-2">
                  Inquiry Submitted!
                </h3>
                <p className="opacity-80 text-sm mb-6 max-w-md mx-auto">
                  Thank you for reaching out to Aafa Coliving. Our team will contact you shortly.
                </p>

                <div className="p-4 rounded-2xl glass-card border border-white/10 mb-6 text-left max-w-sm mx-auto">
                  <p className="text-xs opacity-60 font-mono uppercase">Inquiry ID</p>
                  <p className="text-xl font-bold text-[#D4A64A] font-mono tracking-wider">{refCode}</p>
                </div>

                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    reset();
                  }}
                  className="px-6 py-3 rounded-xl glass-card text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  Send Another Inquiry
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Embedded Google Map */}
        <div className="h-[450px] rounded-3xl overflow-hidden glass-card border border-[#FAF7F0]/15 p-2 shadow-2xl">
          <iframe
            title="Aafa Coliving Campus Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.0415712213797!2d77.63515287588383!3d12.789875172535073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6f5415555555%3A0x123456789abcdef!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1.25rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale contrast-125 invert opacity-85 hover:grayscale-0 hover:invert-0 transition-all duration-700"
          />
        </div>

      </div>
    </PageTransition>
  );
}
