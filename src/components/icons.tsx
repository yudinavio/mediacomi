import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: P) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...rest,
  };
}

export const IconHouse = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v10h13V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconRuler = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 16 16 4l4 4L8 20Z" />
    <path d="M8.5 11.5 10 13M11.5 8.5 13 10M14.5 5.5 16 7" />
  </svg>
);

export const IconLeaf = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 19C5 10 11 5 20 4c0 9-5 15-14 15" />
    <path d="M5 19c3-4 6-7 10-9" />
  </svg>
);

export const IconRoad = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 21 9.5 3M17 21 14.5 3" />
    <path d="M12 6v2.5M12 12v2.5M12 18v2" />
  </svg>
);

export const IconBrick = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3 10h18M3 14.5h18M9 5v5M15 10v4.5M9 14.5V19" />
  </svg>
);

export const IconBolt = (p: P) => (
  <svg {...base(p)}>
    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
  </svg>
);

export const IconDrop = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" />
  </svg>
);

export const IconFlame = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c1 3.5 5 5 5 9.5a5 5 0 0 1-10 0C7 9 9.5 8 10 5.5 10.8 6.6 11.6 7 12 3Z" />
  </svg>
);

export const IconSun = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
  </svg>
);

export const IconTree = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 6.5 11h3L5.5 17H18.5L14.5 11h3L12 3Z" />
    <path d="M12 17v4" />
  </svg>
);

export const IconWater = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 15c2 0 2-1.6 4-1.6S9 15 11 15s2-1.6 4-1.6S17 15 19 15s2-1.6 2-1.6" />
    <path d="M3 19.5c2 0 2-1.6 4-1.6s2 1.6 4 1.6 2-1.6 4-1.6 2 1.6 4 1.6" />
    <path d="M8 9.5 12 4l4 5.5" />
  </svg>
);

export const IconSteam = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 15c-1.2-2 .4-3 0-4.6M12 15c-1.2-2 .4-3 0-4.6M16 15c-1.2-2 .4-3 0-4.6" />
    <rect x="4" y="15" width="16" height="5" rx="1.6" />
  </svg>
);

export const IconSprout = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21v-8" />
    <path d="M12 13c0-3.5-2.5-6-6.5-6C5.5 10.5 8 13 12 13Z" />
    <path d="M12 11.5c0-3 2-5 5.5-5 0 3-2 5-5.5 5Z" />
  </svg>
);

export const IconApple = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 8c-1.2-1.4-4-1.6-5.6.2C4.6 10 5 13.5 7 17c1.2 2.1 2.8 3 5 3s3.8-.9 5-3c2-3.5 2.4-7 .6-8.8C16 6.4 13.2 6.6 12 8Z" />
    <path d="M12 8c0-2 .6-3.6 2.4-4.6" />
  </svg>
);

export const IconChevronLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);

export const IconChevronRight = (p: P) => (
  <svg {...base(p)}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);

export const IconInfo = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.6v.4" />
  </svg>
);

export const IconShare = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 15V3.5M8.5 7 12 3.5 15.5 7" />
    <path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12" />
  </svg>
);

export const IconStar = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
  </svg>
);
