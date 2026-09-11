import React, { useState, useMemo } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  X,
  Check,
  Shield,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

export function AuthSwitch({
  initialMode = "login",
  onLogin,
  onSignUp,
  onClose,
  className = ""
}) {
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password requirements calculation
  const reqLength = password.length >= 8;
  const reqNumber = /[0-9]/.test(password);
  const reqLower = /[a-z]/.test(password);
  const reqUpper = /[A-Z]/.test(password);

  const strengthScore = useMemo(() => {
    return [reqLength, reqNumber, reqLower, reqUpper].filter(Boolean).length;
  }, [reqLength, reqNumber, reqLower, reqUpper]);

  const getStrengthText = () => {
    if (!password) return "Enter password";
    if (strengthScore <= 1) return "Weak password";
    if (strengthScore <= 2) return "Fair password";
    if (strengthScore === 3) return "Good password";
    return "Strong password";
  };

  const getStrengthColor = () => {
    if (!password) return "bg-slate-700";
    if (strengthScore <= 1) return "bg-rose-500";
    if (strengthScore <= 2) return "bg-orange-500";
    if (strengthScore === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthTextColor = () => {
    if (!password) return "text-slate-400";
    if (strengthScore <= 2) return "text-rose-400";
    if (strengthScore === 3) return "text-amber-400";
    return "text-emerald-400";
  };

  // Password confirmation states
  const isMatch = password.length > 0 && confirmPassword === password;
  const hasMismatch = confirmPassword.length > 0 && !password.startsWith(confirmPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      if (onLogin) {
        const res = await onLogin(email, password);
        if (!res?.success) setErrorMessage(res?.message || "Login failed");
      }
    } catch (err) {
      setErrorMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (confirmPassword && confirmPassword !== password) {
      setErrorMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      if (onSignUp) {
        const res = await onSignUp(name, email, password);
        if (!res?.success) setErrorMessage(res?.message || "Sign up failed");
      }
    } catch (err) {
      setErrorMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-sliding-modal relative w-full max-w-[360px] md:max-w-[780px] h-[480px] md:h-[500px] max-h-[85vh] bg-[#0f172a]/95 text-white border border-slate-700/80 backdrop-blur-xl rounded-[24px] md:rounded-[28px] overflow-hidden shadow-2xl ${isSignUp ? 'sign-up-mode' : ''} ${className}`}>
      {/* Top Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-50 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Forms Container */}
      <div className="forms-container absolute w-full h-full top-0 left-0">
        <div className="signin-signup absolute w-full h-full top-0 left-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:grid md:grid-cols-2 z-10 pointer-events-none">
          
          {/* Sign Up Form */}
          <form
            onSubmit={handleSignUp}
            className={`sign-up-form absolute md:relative top-0 left-0 w-full h-[74%] md:h-full flex flex-col items-center justify-center px-4 sm:px-10 py-2 md:py-4 overflow-y-auto no-scrollbar text-center transition-all duration-700 ease-in-out pointer-events-auto ${
              isSignUp 
                ? 'opacity-100 translate-y-0 md:translate-x-0 z-20' 
                : 'opacity-0 pointer-events-none -translate-y-48 md:-translate-y-0 md:-translate-x-32 z-10'
            }`}
          >
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">Sign up</h2>
            
            {errorMessage && isSignUp && (
              <div className="mb-1.5 w-full max-w-[290px] rounded-xl bg-rose-950/80 p-1 text-xs text-rose-300 border border-rose-800">
                {errorMessage}
              </div>
            )}

            <div className="w-full max-w-[290px] space-y-1.5 md:space-y-2">
              {/* Full Name Input */}
              <div className="input-field w-full h-9 md:h-10 bg-[#1e293b] rounded-full px-3.5 flex items-center border border-slate-700 focus-within:border-emerald-500 transition-colors">
                <User className="w-3.5 h-3.5 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none font-medium"
                />
              </div>

              {/* Email Input */}
              <div className="input-field w-full h-9 md:h-10 bg-[#1e293b] rounded-full px-3.5 flex items-center border border-slate-700 focus-within:border-emerald-500 transition-colors">
                <Mail className="w-3.5 h-3.5 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none font-medium"
                />
              </div>

              {/* Password Input */}
              <div className="input-field w-full h-9 md:h-10 bg-[#1e293b] rounded-full px-3.5 flex items-center relative border border-slate-700 focus-within:border-emerald-500 transition-colors">
                <Lock className="w-3.5 h-3.5 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none pr-7 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Password Strength Meter & Checklist */}
              <div className="text-left px-1 pt-0.5">
                <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden mb-0.5">
                  <div 
                    className={`h-full ${getStrengthColor()} transition-all duration-300 rounded-full`}
                    style={{ width: password ? `${Math.max((strengthScore / 4) * 100, 15)}%` : '0%' }}
                  />
                </div>
                
                <div className={`text-[10px] font-bold ${getStrengthTextColor()} mb-0.5`}>
                  {getStrengthText()}
                </div>

                <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[9px] md:text-[10px] font-semibold">
                  <div className="flex items-center gap-1">
                    <Check className={`w-2.5 h-2.5 shrink-0 ${reqLength ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className={reqLength ? 'text-emerald-300' : 'text-slate-400'}>8+ chars</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className={`w-2.5 h-2.5 shrink-0 ${reqNumber ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className={reqNumber ? 'text-emerald-300' : 'text-slate-400'}>1+ number</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className={`w-2.5 h-2.5 shrink-0 ${reqLower ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className={reqLower ? 'text-emerald-300' : 'text-slate-400'}>1+ lowercase</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className={`w-2.5 h-2.5 shrink-0 ${reqUpper ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className={reqUpper ? 'text-emerald-300' : 'text-slate-400'}>1+ uppercase</span>
                  </div>
                </div>
              </div>

              {/* Dot Track */}
              <div className="w-full h-7 md:h-8 bg-[#1e293b] rounded-full px-3 flex items-center justify-start gap-1 border border-slate-700 overflow-x-auto">
                {password.length > 0 ? (
                  password.split('').map((char, index) => {
                    const typedChar = confirmPassword[index];
                    const isCharMatch = typedChar !== undefined && typedChar === char;
                    const isCharMismatch = typedChar !== undefined && typedChar !== char;

                    return (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 shrink-0 ${
                          isCharMatch
                            ? 'bg-[#10b981] shadow-sm shadow-[#10b981]/50 scale-110'
                            : isCharMismatch
                            ? 'bg-rose-500 shadow-sm shadow-rose-500/50 scale-110'
                            : 'bg-slate-600'
                        }`}
                      />
                    );
                  })
                ) : (
                  <div className="flex items-center gap-1 opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className={`input-field w-full h-9 md:h-10 rounded-full px-3.5 flex items-center border transition-all ${
                hasMismatch
                  ? 'bg-rose-950/30 border-rose-600'
                  : isMatch
                  ? 'bg-emerald-950/30 border-emerald-500'
                  : 'bg-[#1e293b] border-slate-700 focus-within:border-emerald-500'
              }`}>
                {isMatch ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-2.5 shrink-0" />
                ) : hasMismatch ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 mr-2.5 shrink-0" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-slate-400 mr-2.5 shrink-0" />
                )}
                <input
                  type="password"
                  placeholder="••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none font-mono"
                />
              </div>

              {/* Sign Up Submit Button */}
              <div className="pt-0.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-auth-solid h-9 md:h-10 px-8 md:px-10 bg-[#1b5e50] hover:bg-[#144d41] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md shadow-emerald-950/50 active:scale-95 transition-all cursor-pointer"
                >
                  {loading ? "Loading..." : "SIGN UP"}
                </button>
              </div>
            </div>
          </form>

          {/* Sign In Form */}
          <form
            onSubmit={handleLogin}
            className={`sign-in-form absolute md:relative bottom-0 left-0 w-full h-[68%] md:h-full md:bottom-auto flex flex-col items-center justify-center px-4 sm:px-12 py-2 md:py-6 overflow-y-auto no-scrollbar text-center transition-all duration-700 ease-in-out pointer-events-auto ${
              isSignUp 
                ? 'opacity-0 pointer-events-none translate-y-48 md:translate-y-0 md:translate-x-32 z-10' 
                : 'opacity-100 translate-y-0 md:translate-x-0 z-20'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">Sign in</h2>
            {errorMessage && !isSignUp && (
              <div className="mb-2 w-full max-w-[290px] rounded-xl bg-rose-950/80 p-1.5 text-xs text-rose-300 border border-rose-800">
                {errorMessage}
              </div>
            )}
            <div className="input-field max-w-[290px] w-full h-10 md:h-11 bg-[#1e293b] rounded-full px-4 flex items-center mb-3 border border-slate-700 focus-within:border-emerald-500">
              <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs md:text-sm text-white placeholder-slate-400 outline-none font-medium"
              />
            </div>
            <div className="input-field max-w-[290px] w-full h-10 md:h-11 bg-[#1e293b] rounded-full px-4 flex items-center mb-4 relative border border-slate-700 focus-within:border-emerald-500">
              <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs md:text-sm text-white placeholder-slate-400 outline-none pr-7 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-auth-solid h-10 md:h-11 px-10 bg-[#1b5e50] hover:bg-[#144d41] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md shadow-emerald-950/50 active:scale-95 transition-all cursor-pointer"
            >
              {loading ? "Loading..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>

      {/* Sliding Panels Text Overlay */}
      <div className="panels-container absolute w-full h-full top-0 left-0 pointer-events-none z-20 md:grid md:grid-cols-2">
        {/* Left Panel */}
        <div className={`panel left-panel absolute md:relative top-0 left-0 w-full h-[32%] md:h-full flex flex-col items-center justify-center text-center px-6 md:px-10 z-20 transition-all duration-700 ease-in-out ${
          isSignUp 
            ? 'pointer-events-none -translate-y-48 md:-translate-y-0 md:-translate-x-[800px] opacity-0' 
            : 'pointer-events-auto translate-y-0 md:translate-x-0 opacity-100'
        }`}>
          <div className="content max-w-[260px] text-white">
            <h3 className="text-xl md:text-2xl font-black tracking-tight mb-1 md:mb-2 text-white">New here?</h3>
            <p className="text-xs leading-relaxed text-emerald-100/95 mb-3 md:mb-4 font-medium line-clamp-2 md:line-clamp-none">
              Join us today and discover verified PGs across Kerala. Create your account in seconds!
            </p>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMessage(""); }}
              className="h-8 md:h-9 px-6 border-2 border-white bg-transparent text-white font-bold text-[11px] md:text-xs uppercase tracking-wider rounded-full hover:bg-white hover:text-[#0f342d] transition-all active:scale-95 shadow-md cursor-pointer"
            >
              SIGN UP
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className={`panel right-panel absolute md:relative bottom-0 left-0 w-full h-[26%] md:h-full md:bottom-auto flex flex-col items-center justify-center text-center px-6 md:px-10 z-20 transition-all duration-700 ease-in-out ${
          isSignUp 
            ? 'pointer-events-auto translate-y-0 md:translate-x-0 opacity-100' 
            : 'pointer-events-none translate-y-48 md:translate-y-0 md:translate-x-[800px] opacity-0'
        }`}>
          <div className="content max-w-[260px] text-white">
            <h3 className="text-xl md:text-2xl font-black tracking-tight mb-1 md:mb-2 text-white">One of us?</h3>
            <p className="text-xs leading-relaxed text-emerald-100/95 mb-3 md:mb-4 font-medium line-clamp-2 md:line-clamp-none">
              If you already have an account, just sign in. We've missed you!
            </p>
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMessage(""); }}
              className="h-8 md:h-9 px-6 border-2 border-white bg-transparent text-white font-bold text-[11px] md:text-xs uppercase tracking-wider rounded-full hover:bg-white hover:text-[#0f342d] transition-all active:scale-95 shadow-md cursor-pointer"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthSwitch;
