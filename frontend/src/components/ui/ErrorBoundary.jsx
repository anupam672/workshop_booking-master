import React from 'react'
import Button from './Button'

/**
 * Error Boundary Class Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error boundary caught:', error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto px-4 py-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-5">
              {/* Warning Icon */}
              <div className="flex justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" className="text-warning">
                  <polygon
                    points="32,8 56,56 8,56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <line x1="32" y1="24" x2="32" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="32" cy="48" r="2" fill="currentColor" />
                </svg>
              </div>

              {/* Heading */}
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                Something went wrong
              </h1>

              {/* Error Details */}
              <div className="bg-gray-100 rounded-lg p-3 text-left">
                <code className="text-xs text-gray-700 break-words">
                  {this.state.error?.message || 'Unknown error'}
                </code>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" fullWidth onClick={this.resetError}>
                  Try Again
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    window.location.href = '/'
                  }}
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

/**
 * HOC to wrap functional components with ErrorBoundary
 */
export function withErrorBoundary(Component) {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
