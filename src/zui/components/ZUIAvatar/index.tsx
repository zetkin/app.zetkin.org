import { create } from 'random-seed';
import { FC, useMemo } from 'react';
import { useTheme } from '@mui/material';

import { funSwatches } from 'zui/theme/palette';
import { ZUISize } from '../types';

interface ZUIAvatarProps {
  /**
   * First name of the person the avatar represents.
   */
  firstName: string;

  /**
   * Id of the person the avatar represents.
   */
  id: number;

  /**
   * Last name of the person the avatar represents.
   */
  lastName: string;

  /**
   * The size of the avatar, defaults to 'medium'.
   */
  size?: ZUISize;

  /**
   * The shape of the avatar, defaults to 'circular'.
   */
  variant?: 'square' | 'circular';
}

const ZUIAvatar: FC<ZUIAvatarProps> = ({
  firstName,
  id,
  lastName,
  size = 'medium',
  variant = 'circular',
}) => {
  const theme = useTheme();

  let avatarSize = 32;
  let fontSize = 16;
  let letterSpacing = 0.11;
  if (size == 'small') {
    avatarSize = 24;
    fontSize = 12;
    letterSpacing = 0.08;
  } else if (size == 'large') {
    avatarSize = 48;
    fontSize = 20;
    letterSpacing = 0.14;
  }

  const seededRand = create(id.toString());
  const rand = () => seededRand(1000000) / 1000000;
  const initials = firstName.slice(0, 1) + lastName.slice(0, 1);

  const colors = useMemo(() => {
    return Object.keys(funSwatches).reduce((acc, swatch) => {
      acc.push(funSwatches[swatch].light.color);
      acc.push(funSwatches[swatch].medium.color);

      return acc;
    }, [] as string[]);
  }, [funSwatches]);

  const getColor = (): string => {
    const index = seededRand(colors.length);
    const color = colors[index];
    return color;
  };

  const uniqueName = (name: string) => {
    return name + id;
  };

  return (
    <svg
      height={avatarSize}
      version="1.1"
      width={avatarSize}
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
          <circle cx={avatarSize / 2} cy={avatarSize / 2} r={avatarSize / 2} />
        </clipPath>
        <clipPath id={uniqueName(size + 'squareClip')}>
          <rect height={avatarSize} rx="4" ry="4" width={avatarSize} />
        </clipPath>
      </defs>

      <g
        clipPath={
          variant == 'circular'
            ? `url(#${uniqueName(size + 'circleClip')})`
            : `url(#${uniqueName(size + 'squareClip')})`
        }
        id={'content' + id}
      >
        <rect
          fill={`url(#${uniqueName('gradient')})`}
          height={avatarSize}
          width={avatarSize}
        />
        <g filter={`url(#${uniqueName('blurMe')})`}>
          <rect
            fill={getColor()}
            height={avatarSize}
            width={avatarSize}
            x={-seededRand(avatarSize)}
            y={-seededRand(avatarSize) / 2}
          />
          <line
            stroke={getColor()}
            strokeWidth={15}
            x1={avatarSize * 1.5}
            x2={avatarSize / 2}
            y1={avatarSize * 1.5}
            y2={avatarSize / 3}
          />
        </g>

        <text
          dominantBaseline="central"
          fontFamily={theme.typography.fontFamily}
          fontSize={fontSize}
          fontWeight={600}
          letterSpacing={letterSpacing}
          textAnchor="middle"
          x={avatarSize / 2}
          y={avatarSize / 2}
        >
          {initials.toUpperCase()}
        </text>
      </g>
    </svg>
  );
};

export default ZUIAvatar;
