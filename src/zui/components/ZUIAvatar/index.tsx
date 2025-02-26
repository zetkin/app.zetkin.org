import { create } from 'random-seed';
import { FC } from 'react';

import palette from 'zui/theme/palette';
import typography from 'zui/theme/typography';
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
  let avatarSize = 32;
  let fontSize = 16;
  if (size == 'small') {
    avatarSize = 24;
    fontSize = 12;
  } else if (size == 'large') {
    avatarSize = 48;
    fontSize = 20;
  }

  const seededRand = create(id.toString());
  const rand = () => seededRand(1000) / 1000;
  const initials = firstName.slice(0, 1) + lastName.slice(0, 1);

  const colors = Object.keys(palette.swatches).reduce((acc, swatch) => {
    type Palette = {
      swatches: {
        [key: string]: {
          light: { color: string };
          medium: { color: string };
        };
      };
    };
    if (
      typeof (palette as unknown as Palette).swatches[swatch].light !=
      'undefined'
    ) {
      acc.push((palette as unknown as Palette).swatches[swatch].light.color);
    }
    if (
      typeof (palette as unknown as Palette).swatches[swatch].medium !=
      'undefined'
    ) {
      acc.push((palette as unknown as Palette).swatches[swatch].medium.color);
    }
    return acc;
  }, [] as string[]);
  const getColor = (): string => colors[seededRand(colors.length)];
  // `hsl(${Math.floor(rand() * 360)}, ${Math.floor(
  //   rand() * 20 + 40
  // )}%, ${Math.floor(rand() * 40 + 50)}%)`;

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
          id="gradient"
        >
          <stop offset="5%" stopColor={getColor()} />
          <stop offset="95%" stopColor={getColor()} />
        </linearGradient>

        <filter id="blurMe">
          <feGaussianBlur
            edgeMode="wrap"
            in="SourceGraphic"
            stdDeviation="10"
          />
        </filter>

        <clipPath id={size + 'circleClip'}>
          <circle cx={avatarSize / 2} cy={avatarSize / 2} r={avatarSize / 2} />
        </clipPath>
        <clipPath id={size + 'squareClip'}>
          <rect height={avatarSize} rx="4" ry="4" width={avatarSize} />
        </clipPath>
      </defs>

      <g
        clipPath={
          variant == 'circular'
            ? 'url(#' + size + 'circleClip)'
            : 'url(#' + size + 'squareClip)'
        }
        id="content"
      >
        <rect fill="url(#gradient)" height={avatarSize} width={avatarSize} />
        <g filter="url(#blurMe)">
          <rect
            fill={getColor()}
            height={avatarSize}
            width={avatarSize}
            x={-avatarSize / 2}
            y={-avatarSize / 2}
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
          dominantBaseline="middle"
          fontFamily={typography.bodyMdRegular?.fontFamily}
          fontSize={fontSize}
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
