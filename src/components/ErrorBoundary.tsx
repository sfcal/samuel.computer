import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error }: { error?: Error }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="btn-primary"
      >
        Reload Page
      </button>
    </div>
  </div>
);