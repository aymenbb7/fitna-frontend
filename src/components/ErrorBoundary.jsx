import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    const isChunkLoadError = error?.name === 'ChunkLoadError' || 
                             (error?.message && (
                               error.message.includes('Failed to fetch dynamically imported module') || 
                               error.message.includes('Importing a module script failed')
                             ));

    if (isChunkLoadError) {
      const hasReloaded = sessionStorage.getItem('fitna_chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('fitna_chunk_reload', 'true');
        window.location.reload();
      }
    }
  }

  componentDidMount() {
    // Clear the flag when the app loads successfully
    if (!this.state.hasError) {
      sessionStorage.removeItem('fitna_chunk_reload');
    }
  }

  handleRetry = () => {
    sessionStorage.removeItem('fitna_chunk_reload');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0B2B] flex items-center justify-center p-4 font-sans" dir="rtl">
          <div className="bg-[#1A0A4B] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">عذراً، حدث خطأ غير متوقع</h2>
            <p className="text-gray-400 mb-6 text-sm">
              يبدو أن هناك مشكلة في تحميل هذه الصفحة. يرجى إعادة المحاولة.
            </p>
            <button
              onClick={this.handleRetry}
              className="w-full bg-[#F5C518] text-[#0D0B2B] font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>إعادة التحميل</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
