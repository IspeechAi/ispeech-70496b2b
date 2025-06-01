
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-blue-900/40 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
                ⚠️ Something went wrong
              </h1>
              <p className="text-gray-300 mb-4">
                The iSpeech application encountered an unexpected error.
              </p>
              {this.state.error && (
                <details className="text-left bg-slate-800/50 p-4 rounded-lg mb-6">
                  <summary className="text-red-400 cursor-pointer mb-2">Error Details</summary>
                  <code className="text-sm text-gray-300 whitespace-pre-wrap">
                    {this.state.error.message}
                  </code>
                </details>
              )}
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={this.handleReload}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                Refresh Page
              </Button>
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
