// packages/ui/src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

// Our props include two react components that we need to investigate
// their purpose
interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

// First time using a class I believe
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        // No idea what this does
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="error-boundary">
                    <h2>Oops, something went wrong</h2>
                    <p>We are sorry, but an error occurred while rendering this component, it reads as follows:</p>
                    <p className="error-message">{this.state.error?.message}</p>
                    <button
                        className="reset-button"
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;