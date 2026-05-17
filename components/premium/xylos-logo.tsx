"use client";

interface XylosLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function XylosLogo({ size = 40, className = "", animated = true }: XylosLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible" }}
    >
      {animated && (
        <style>{`
          @keyframes drawStroke {
            0% {
              stroke-dashoffset: 260;
              opacity: 0;
            }
            30% {
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
          @keyframes popCircle {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 0.6;
            }
          }
          .animate-path-0 {
            stroke-dasharray: 260;
            stroke-dashoffset: 260;
            animation: drawStroke 0.8s ease-in-out forwards;
            animation-delay: 0s;
          }
          .animate-path-1 {
            stroke-dasharray: 260;
            stroke-dashoffset: 260;
            animation: drawStroke 0.8s ease-in-out forwards;
            animation-delay: 0.15s;
          }
          .animate-pop {
            animation: popCircle 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>
      )}
      <g transform="translate(256,256)">
        {/* Left arm of X */}
        <path
          d="M-90,-90 L-20,0 L-90,90"
          stroke="currentColor"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={animated ? "animate-path-0" : ""}
        />

        {/* Right arm of X */}
        <path
          d="M90,-90 L20,0 L90,90"
          stroke="currentColor"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={animated ? "animate-path-1" : ""}
        />

        {/* Center node — static, no pulse */}
        <circle
          cx="0" cy="0" r="16"
          fill="currentColor"
          opacity="0.9"
        />

        {/* Corner neural dots */}
        {[
          [-90, -90],
          [90, -90],
          [-90, 90],
          [90, 90],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="8"
            fill="currentColor"
            style={animated ? {
              transformOrigin: `${cx}px ${cy}px`,
              animationDelay: `${0.5 + i * 0.1}s`,
            } : {
              opacity: 0.6
            }}
            className={animated ? "animate-pop" : ""}
          />
        ))}
      </g>
    </svg>
  );
}
