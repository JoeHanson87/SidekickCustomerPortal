import Image from 'next/image';

interface SidekickLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function SidekickLogo({
  width = 144,
  height = 144,
  className = 'object-contain',
}: SidekickLogoProps) {
  return (
    <Image
      src="/sidekick-logo.png"
      alt="Sidekick Logo"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}
