import { FC, ReactNode } from 'react';

import { randomizerFromSeed } from 'utils/colorUtils';

export interface AvatarBackgroundProps {
  children?: ReactNode;
  seed: string;
  size: number;
  variant: 'square' | 'circular';
}

const AvatarBackground: FC<AvatarBackgroundProps> = ({
  seed,
  size,
  children,
  variant,
}) => {
  const seedWithoutSpaces = seed.replaceAll(' ', '');

  const { getColor, seededRand, rand } = randomizerFromSeed(seedWithoutSpaces);

  const uniqueName = (name: string) => {
    return name + seedWithoutSpaces;
  };

  return (
    <svg
      height={size}
      style={{ flexShrink: 0 }}
      version="1.1"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientTransform={'rotate(' + rand() * 360 + ')'}
          id={uniqueName('gradient')}
        >
          <stop offset="5%" stopColor={getColor()} />
          <stop offset="95%" stopColor={getColor()} />
        </linearGradient>

        <filter id={uniqueName('blurMe')}>
          <feGaussianBlur
            edgeMode="wrap"
            in="SourceGraphic"
            stdDeviation="10"
          />
        </filter>

        <clipPath id={uniqueName(size + 'circleClip')}>
          <circle cx={size / 2} cy={size / 2} r={size / 2} />
        </clipPath>
        <clipPath id={uniqueName(size + 'squareClip')}>
          <rect height={size} rx="4" ry="4" width={size} />
        </clipPath>
      </defs>

      <g
        clipPath={
          variant == 'circular'
            ? `url(#${uniqueName(size + 'circleClip')})`
            : `url(#${uniqueName(size + 'squareClip')})`
        }
        id={'content' + seedWithoutSpaces}
      >
        <rect
          fill={`url(#${uniqueName('gradient')})`}
          height={size}
          width={size}
        />
        <g filter={`url(#${uniqueName('blurMe')})`}>
          <rect
            fill={getColor()}
            height={size}
            width={size}
            x={-seededRand(size)}
            y={-seededRand(size) / 2}
          />
          <line
            stroke={getColor()}
            strokeWidth={15}
            x1={size * 1.5}
            x2={size / 2}
            y1={size * 1.5}
            y2={size / 3}
          />
        </g>
        {children}
      </g>
    </svg>
  );
};

export default AvatarBackground;
