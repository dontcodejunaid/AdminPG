import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1220] text-[#FAF7F0] flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-[#D4A64A]/30 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#D4A64A]/20 border border-[#D4A64A]/40 text-[#D4A64A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold mb-2 font-sora text-[#FAF7F0]">Something went wrong</h2>
            <p className="text-xs text-[#FAF7F0]/70 mb-4 font-mono">
              {this.state.error?.message || 'Unexpected application render error.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] font-bold text-xs shadow-lg hover:shadow-[#D4A64A]/40 transition-all"
            >
              Reset & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
