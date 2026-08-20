interface XylosLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function XylosLogo({ size = 40, className = "", animated = false }: XylosLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <g transform="translate(256,256)">
        <path
          d="M-90,-90 L-20,0 L-90,90"
          stroke="currentColor"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M90,-90 L20,0 L90,90"
          stroke="currentColor"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="0" cy="0" r="16" fill="currentColor" opacity="0.9" />
      </g>
    </svg>
  );
}
