import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import CustomCursor from './components/CustomCursor';
import FloatingBackground from './components/FloatingBackground';
import ScrollProgress from './components/ScrollProgress';
import IntroLoader from './components/IntroLoader';
import EnquiryPopup from './components/EnquiryPopup';
import AIChatbot from './components/AIChatbot';
import RouteScroll from './components/RouteScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import RoomModal from './components/RoomModal';
import { useApp } from '../context/AppContext';

// Lazy-Loaded Seeker Pages
const Home = lazy(() => import('./pages/Home'));
const RoomsPage = lazy(() => import('./pages/RoomsPage'));
const FoodMenuPage = lazy(() => import('./pages/FoodMenuPage'));
const AmenitiesPage = lazy(() => import('./pages/AmenitiesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));
const CityDetailsPage = lazy(() => import('./pages/CityDetailsPage'));
const GuidelinesPage = lazy(() => import('./pages/GuidelinesPage'));
const MoveInPage = lazy(() => import('./pages/MoveInPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const LegalPolicyPage = lazy(() => import('./pages/LegalPolicyPage'));

// Fallback Loader for Route Transitions
function PageFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-20">
      <div className="w-14 h-14 rounded-2xl bg-[#D4A64A]/20 border border-[#D4A64A]/40 text-[#D4A64A] flex items-center justify-center animate-bounce mb-3 shadow-[0_0_25px_rgba(212,166,74,0.4)]">
        <Sparkles className="w-7 h-7" />
      </div>
      <p className="text-xs font-mono uppercase text-[#D4A64A] tracking-wider animate-pulse">
        Loading KeralaPG Luxury Sanctuary...
      </p>
    </div>
  );
}

function AnimatedRoutes({ onOpenBooking, onSelectRoom }) {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'KeralaPG | Find Your Stay — Luxury Coliving Stays',
      '/rooms': 'Rooms & Pricing | 1BHK, 2BHK & Daily Stay ₹499/day — KeralaPG',
      '/food-menu': 'Weekly Homestyle Kerala Food Menu Schedule — KeralaPG',
      '/menu': 'Weekly Homestyle Kerala Food Menu Schedule — KeralaPG',
      '/amenities': 'Zero-Gravity Amenities | Wi-Fi, Generator & Kerala Mess — KeralaPG',
      '/gallery': 'Virtual Campus Photo Gallery | Bedrooms & Lounge — KeralaPG',
      '/reviews': 'Verified Resident Reviews & Ratings — KeralaPG',
      '/about': 'Our Story & Community Culture — KeralaPG',
      '/blog': 'Life at KeralaPG & City Relocation Guides — KeralaPG Blog',
      '/contact': 'Contact Hotlines, Address & Directions — KeralaPG',
      '/locations': 'Kerala & Pan-India Locations Map — KeralaPG',
      '/guidelines': 'House Guidelines & Resident Rules — KeralaPG',
      '/move-in': 'Move-In Process & Required Documents Checklist — KeralaPG',
      '/careers': 'Partner With Us & Property Franchise Portal — KeralaPG',
      '/terms': 'Terms & Conditions — KeralaPG',
      '/terms-and-conditions': 'Terms & Conditions — KeralaPG',
      '/privacy': 'Privacy Policy — KeralaPG',
      '/privacy-policy': 'Privacy Policy — KeralaPG',
    };
    document.title = titles[location.pathname] || 'KeralaPG | Luxury Stays & Coliving';
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageFallback />}>
      <RouteScroll />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home onOpenBooking={onOpenBooking} />} />
        <Route
          path="/rooms"
          element={
            <RoomsPage
              onOpenBooking={onOpenBooking}
              onSelectRoom={onSelectRoom}
            />
          }
        />
        <Route path="/food-menu" element={<FoodMenuPage onOpenBooking={onOpenBooking} />} />
        <Route path="/menu" element={<FoodMenuPage onOpenBooking={onOpenBooking} />} />
        <Route path="/amenities" element={<AmenitiesPage onOpenBooking={onOpenBooking} />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/:citySlug" element={<CityDetailsPage onOpenBooking={onOpenBooking} />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/move-in" element={<MoveInPage onOpenBooking={onOpenBooking} />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/terms" element={<LegalPolicyPage />} />
        <Route path="/terms-and-conditions" element={<LegalPolicyPage />} />
        <Route path="/privacy" element={<LegalPolicyPage />} />
        <Route path="/privacy-policy" element={<LegalPolicyPage />} />
      </Routes>
    </Suspense>
  );
}

export function SeekerApp({ onOpenAuthModal }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRoomTitle, setBookingRoomTitle] = useState('');
  const [isEnquiryPopupOpen, setIsEnquiryPopupOpen] = useState(false);

  const { isAuthenticated, currentUser, logout } = useApp();

  const handleOpenBooking = (roomTitle = '') => {
    setBookingRoomTitle(roomTitle);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setBookingRoomTitle('');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#0B1220] text-[#FAF7F0] selection:bg-[#D4A64A]/30 selection:text-[#FAF7F0] overflow-x-clip">
        {/* Intro Loading Screen */}
        <IntroLoader />

        {/* Top Scroll Progress Line */}
        <ScrollProgress />

        {/* Custom Spring Reactive Cursor & Trail */}
        <CustomCursor />

        {/* Ambient Fluid Background */}
        <FloatingBackground />

        {/* Floating Header Navbar with Auth & Booking triggers */}
        <Navbar 
          onOpenBooking={() => handleOpenBooking()} 
          onOpenAuth={onOpenAuthModal}
        />

        {/* Code-Split Animated Routes */}
        <main className="relative z-10 pt-16">
          <AnimatedRoutes
            onOpenBooking={handleOpenBooking}
            onSelectRoom={(room) => setSelectedRoom(room)}
          />
        </main>

        {/* Modals & Popups */}
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onBookNow={(title) => handleOpenBooking(title)}
        />

        <BookingModal
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          initialRoomTitle={bookingRoomTitle}
        />

        <EnquiryPopup
          isOpen={isEnquiryPopupOpen}
          onClose={() => setIsEnquiryPopupOpen(false)}
        />

        {/* Floating AI Chatbot Concierge */}
        <AIChatbot onOpenBooking={() => handleOpenBooking()} />

        {/* Footer with quick links and Admin Login access */}
        <Footer
          onOpenBooking={() => handleOpenBooking()}
          onOpenAuth={onOpenAuthModal}
        />
      </div>
    </MotionConfig>
  );
}
