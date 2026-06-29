import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
          <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg, #f87171, #ef4444)",
                boxShadow: "0 0 30px rgba(248,113,113,0.3)",
              }}
            >
              <AlertTriangle size={24} className="text-white" />
            </div>
            <h2 className="text-[18px] font-black mb-2">Something went wrong</h2>
            <p className="text-[13px] text-white/50 mb-6 leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mx-auto text-[13px]"
            >
              <RefreshCw size={14} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
