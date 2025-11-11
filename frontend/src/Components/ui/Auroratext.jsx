import { cn } from '../../utils/cn';

export function AuroraText({ children, className }) {
  return (
    <span
      className={cn(
        // 🩵 Blue Aurora Gradient — clean, uniform, premium
        'relative bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent animate-aurora-glow',
        'drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]',
        className
      )}
    >
      {children}
    </span>
  );
}
