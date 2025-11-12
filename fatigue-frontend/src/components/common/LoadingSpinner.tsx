/**
 * LoadingSpinner Component
 * Spinner de carga reutilizable
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <span className={`loading loading-spinner ${sizeClasses[size]} text-primary`}></span>
      {text && <p className="text-base-content/60">{text}</p>}
    </div>
  );
}
