import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 24px',
          maxWidth: '800px',
          margin: '40px auto',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1.5px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}>
            <AlertTriangle size={28} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>
            Something went wrong rendering this Studio
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <pre style={{
            background: 'var(--bg-card)',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            textAlign: 'left',
            overflowX: 'auto',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)',
          }}>
            {this.state.error?.stack || String(this.state.error)}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={16} />
            <span>Reload Studio</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
