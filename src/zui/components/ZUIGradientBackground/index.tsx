import { FC } from 'react';
import { Box } from '@mui/material';
import { range } from 'lodash';

import { randomizerFromSeed } from 'utils/colorUtils';
import { COLORS, PATTERNS, setPixel } from '../ZUIModal/ModalBackground';

type Props = {
  /**
   * Unique string to base the randomised gradient on
   */
  seed: string;
};

const backgroundColors = [
  'rgba(0,0,128, 0.1)',
  'rgba(0,100,0, 0.2)',
  'rgba(200,0,128, 0.1)',
  'rgba(120,200,0, 0.15)',
  'rgba(200,100,20, 0.2)',
  'rgba(0,0,128, 0.1)',
  'rgba(0,250,128, 0.2)',
];

const opacities = [0.4, 0.5, 0.6, 0.7];
const filters = [
  'blur(20px) hue-rotate(0)',
  'blur(30px) hue-rotate(30deg)',
  'blur(30px) hue-rotate(120deg)',
  'blur(10px) hue-rotate(180deg)',
];

const ZUIGradientBackground: FC<Props> = ({ seed }) => {
  const seedWithoutSpaces = seed.replaceAll(' ', '');
  const { getColor, seededRand, rand } = randomizerFromSeed(
    seedWithoutSpaces,
    backgroundColors
  );

  const layers = range(0, 4).map(() => {
    const patternIndex = Math.floor(rand() * PATTERNS.length);
    const pattern = PATTERNS[patternIndex];
    const imageHeight = pattern.length;
    const imageWidth = pattern[0].length;
    const randomColors = COLORS.concat().sort(() => seededRand(100) - 0.5);

    const imageData = new ImageData(imageWidth, imageHeight);

    pattern.forEach((row, x) => {
      row.forEach((colorIndex, y) => {
        const shouldBeDrawn = colorIndex > 0;
        if (shouldBeDrawn) {
          const color = randomColors[colorIndex];
          setPixel(imageData, x, y, color);
        }
      });
    });

    return {
      imageData,
      imageHeight,
      imageWidth,
    };
  });

  const bgcolor1 = getColor();
  const bgcolor2 = getColor();
  const degreeOfRotation = rand() * 360;
  const startPercent = Math.floor(rand());

  return (
    <Box
      sx={{
        background: `linear-gradient(${degreeOfRotation}deg, ${bgcolor1} ${startPercent}%, ${bgcolor2} 100%)`,
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      {layers.map((layer, index) => {
        const { imageData, imageWidth, imageHeight } = layer;

        const randomFilterIndex = Math.floor(rand() * filters.length);
        const randomOpacityIndex = Math.floor(rand() * opacities.length);

        return (
          <Box
            key={index}
            sx={{
              bottom: 0,
              filter: filters[randomFilterIndex],
              left: 0,
              opacity: opacities[randomOpacityIndex],
              position: 'absolute',
              right: 0,
              rotate: rand() < 0.5 ? '0deg' : '180deg',
              top: 0,
            }}
          >
            <canvas
              ref={(canvas) => {
                void (async () => {
                  const ctx = canvas?.getContext('2d');
                  if (ctx) {
                    const bitmap = await createImageBitmap(imageData);
                    ctx.drawImage(bitmap, 0, 0);
                  }
                })();
              }}
              height={imageHeight}
              style={{
                height: '100%',
                width: '100%',
              }}
              width={imageWidth}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default ZUIGradientBackground;
