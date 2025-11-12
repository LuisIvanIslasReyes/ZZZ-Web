/**
 * Premium Decorations Component
 * Componente reutilizable para decoraciones temáticas
 */

export function CornerDecoration() {
  return (
    <>
      <div className="corner-decoration corner-decoration-top-right"></div>
      <div className="corner-decoration corner-decoration-bottom-left"></div>
    </>
  );
}

export function BackgroundPattern() {
  return <div className="absolute inset-0 bg-pattern pointer-events-none"></div>;
}

export function AnimatedWave() {
  return (
    <div className="absolute inset-0 opacity-30">
      <div
        className="absolute inset-0 animate-wave"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
      ></div>
    </div>
  );
}

export function GradientDivider() {
  return <div className="h-1 w-16 bg-gradient-premium rounded-full"></div>;
}

export function PulsatingGlow() {
  return <div className="absolute inset-0 animate-pulse-glow"></div>;
}
