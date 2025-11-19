/**
 * Error Boundary Component
 * Componente para capturar errores de React y mostrar UI amigable
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-error/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="card-title text-error">¡Oops! Algo salió mal</h2>
                  <p className="text-base-content/60">
                    Ha ocurrido un error inesperado en la aplicación
                  </p>
                </div>
              </div>

              {/* Error Details */}
              <div className="divider"></div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Mensaje de Error:</h3>
                  <div className="bg-error/10 p-4 rounded-lg">
                    <p className="text-error font-mono text-sm">
                      {this.state.error?.message || 'Error desconocido'}
                    </p>
                  </div>
                </div>

                {this.state.error?.stack && (
                  <details className="collapse collapse-arrow bg-base-200">
                    <summary className="collapse-title font-semibold">
                      Detalles técnicos (Stack Trace)
                    </summary>
                    <div className="collapse-content">
                      <pre className="text-xs overflow-x-auto bg-base-300 p-4 rounded-lg mt-2">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}

                {this.state.errorInfo && (
                  <details className="collapse collapse-arrow bg-base-200">
                    <summary className="collapse-title font-semibold">
                      Información del componente
                    </summary>
                    <div className="collapse-content">
                      <pre className="text-xs overflow-x-auto bg-base-300 p-4 rounded-lg mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}
              </div>

              {/* Actions */}
              <div className="divider"></div>
              
              <div className="card-actions justify-end gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => window.history.back()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Volver
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Ir al inicio
                </button>
                <button
                  className="btn btn-accent"
                  onClick={this.handleReset}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
