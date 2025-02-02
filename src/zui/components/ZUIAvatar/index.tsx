import { create } from 'random-seed';
import { FC } from 'react';

import palette from 'zui/theme/palette';
import typography from 'zui/theme/typography';

interface ZUIAvatarProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'rounded' | 'circular';
  id: number;
  text?: string;
}

const ZUIAvatar: FC<ZUIAvatarProps> = ({
  size = 'medium',
  variant = 'circular',
  text = '',
  id,
}) => {
  const s = size == 'small' ? 24 : size == 'medium' ? 32 : 48;
  const fontSize = size == 'small' ? 12 : size == 'medium' ? 16 : 20;

  const idStr = '' + id;

  const seededRand = create(idStr);
  const rand = () => seededRand(1000) / 1000;
  let shortText = '';
  const textParts = text.split(' ');
  if (textParts.length >= 2 && textParts[1].length != 0) {
    shortText = textParts[0][0] + textParts[1][0];
  } else {
    shortText = textParts[0].slice(0, 2);
  }

  shortText = shortText.toUpperCase();

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
    <svg height={s} version="1.1" width={s} xmlns="http://www.w3.org/2000/svg">
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
          <circle cx={s / 2} cy={s / 2} r={s / 2} />
        </clipPath>
        <clipPath id={size + 'roundedClip'}>
          <rect height={s}rx="4" ry="4" width={s}  />
        </clipPath>
      </defs>

      <g
        clipPath={
          variant == 'circular'
            ? 'url(#' + size + 'circleClip)'
            : 'url(#' + size + 'roundedClip)'
        }
        id="content"
      >
        <rect fill="url(#gradient)" height={s} width={s} />
        <g filter="url(#blurMe)">
          <rect fill={getColor()} height={s} width={s} x={-s / 2} y={-s / 2} />
          <line
            stroke={getColor()}
            strokeWidth={15}
            x1={s * 1.5}
            x2={s / 2}
            y1={s * 1.5}
            y2={s / 3}
          />
        </g>

        <text
          dominantBaseline="middle"
          fontFamily={typography.bodyMdRegular?.fontFamily}
          fontSize={fontSize}
          textAnchor="middle"
          x={s / 2}
          y={s / 2}
        >
          {shortText}
        </text>
      </g>
    </svg>
  );
};

export default ZUIAvatar;
