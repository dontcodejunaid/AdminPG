import React from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { AuthSwitch } from '@/components/ui/auth-switch';

export const LoginPage = () => {
  const { login } = useApp();

  const handleLogin = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        login(res.data, res.token);
        return { success: true };
      }
      return { success: false, message: res.error || 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const handleSignUp = async (name, email, password) => {
    try {
      const res = await api.register({
        name,
        email,
        phone: '',
        password,
        city: 'Kochi'
      });
      if (res.success && res.data) {
        login(res.data, res.token);
        return { success: true };
      }
      return { success: false, message: res.error || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between relative selection:bg-emerald-500 selection:text-white">
      
      {/* Scenic Kerala PG Architecture Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transform scale-[1.02] filter blur-[1.5px]"
        style={{ backgroundImage: 'url("/login_bg.jpg")' }}
      />
      
      {/* Ambient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-900/70 pointer-events-none" />

      {/* Top Header Logo */}
      <header className="relative z-10 px-6 py-2.5 flex items-center justify-between max-w-5xl w-full mx-auto flex-shrink-0">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="KeralaPG Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow-2xl" 
          />
          <div>
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Kerala<span className="text-amber-400 font-black">PG</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Authentication Centerpiece */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 min-h-0">
        <AuthSwitch
          initialMode="login"
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      </main>


      {/* Bottom Page Footer */}
      <footer className="relative z-10 py-2.5 text-center text-xs text-slate-300/80 drop-shadow flex-shrink-0">
        <p>
          By continuing, you agree to our{' '}
          <a href="#" className="hover:text-amber-400 text-white underline">Terms</a>{' '}
          and{' '}
          <a href="#" className="hover:text-amber-400 text-white underline">Privacy Policy</a>.
          <span className="mx-2 opacity-50">•</span>
          © {new Date().getFullYear()} KeralaPG.com • All Rights Reserved
        </p>
      </footer>

    </div>
  );
};

export default LoginPage;
