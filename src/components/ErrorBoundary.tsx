import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 min-h-screen">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                    <div className="bg-white p-4 rounded shadow border border-red-200">
                        <h2 className="font-semibold text-red-800">{this.state.error?.toString()}</h2>
                        <details className="mt-4 text-sm text-gray-600 whitespace-pre-wrap">
                            {this.state.errorInfo?.componentStack}
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
