import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'  // Make sure this line exists!

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Application error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                        <p className="text-gray-400 mb-4">
                            The application encountered an unexpected error.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-oak-600 hover:bg-oak-700 px-4 py-2 rounded transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
            <Toaster
                position="top-right"
                gutter={8}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#374151',
                        color: '#fff',
                        border: '1px solid #4b5563',
                        borderRadius: '8px',
                    },
                    success: {
                        style: {
                            background: '#065f46',
                            border: '1px solid #059669',
                        },
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#7f1d1d',
                            border: '1px solid #dc2626',
                        },
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                    loading: {
                        style: {
                            background: '#1f2937',
                            border: '1px solid #374151',
                        },
                    },
                }}
            />
        </ErrorBoundary>
    </React.StrictMode>,
)