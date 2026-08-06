export function DynamicBackground() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: -1, 
      overflow: 'hidden',
      backgroundColor: '#f8f9fa' // Fallback
    }}>
      
      {/* High-Resolution Static AI Background Image or Custom Image */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'var(--custom-dashboard-bg, url(/bg-ai.png))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} 
      />

      {/* Global Glass Overlay - Ensures foreground text/UI readability without blurring the background image */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 1, 
          background: 'rgba(255, 255, 255, 0.25)', 
          pointerEvents: 'none' 
        }} 
      />

      {/* Subtle Grid overlay for an Enterprise SaaS feel */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        backgroundImage: `linear-gradient(rgba(79, 70, 229, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 70, 229, 0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.8,
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
