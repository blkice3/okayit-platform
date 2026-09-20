
import Image from 'next/image';

interface OkayitLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function OkayitLogo({ width = 120, height = 120, className = '' }: OkayitLogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ background: 'transparent' }}>
      <Image
        src="/okayit-logo.png"
        alt="OKAYiT Logo"
        width={width}
        height={height}
        priority
        className="object-contain mix-blend-multiply"
        style={{ 
          background: 'transparent',
          mixBlendMode: 'multiply',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
    </div>
  );
}
