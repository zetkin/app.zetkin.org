import { Box } from '@mui/material';
import { range } from 'lodash';
import { FC, useEffect, useState } from 'react';

type Props = {
  height: number | string;
  width: number | string;
};

const COLORS = [
  0xff93e9eb, 0xaa22d3ee, 0xffb3daee, 0xccbed0f9, 0xffd8c4fa, 0x664f46e5,
];

const PATTERNS = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 0, 0, 2],
    [0, 3, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 3],
    [1, 0, 0, 0, 0],
    [1, 0, 2, 0, 0],
    [0, 0, 0, 0, 2],
    [0, 0, 3, 0, 0],
  ],
  [
    [0, 0, 0, 0, 3],
    [0, 3, 0, 2, 2],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
  ],
];

function setPixel(image: ImageData, x: number, y: number, argb: number) {
  const b = argb & 0xff;
  const g = (argb >> 8) & 0xff;
  const r = (argb >> 16) & 0xff;
  const a = (argb >> 24) & 0xff;
  image.data.set([r, g, b, a], (y * image.width + x) * 4);
}

type LayerData = {
  delay: number;
  duration: number;
  imageData: ImageData;
  imageHeight: number;
  imageWidth: number;
};

const ZUIModalBackground: FC<Props> = ({ height, width }) => {
  const [layers, setLayers] = useState<LayerData[]>([]);

  useEffect(() => {
    const newLayers = range(0, 4).map(() => {
      const patternIndex = Math.floor(Math.random() * PATTERNS.length);
      const pattern = PATTERNS[patternIndex];
      const imageHeight = pattern.length;
      const imageWidth = pattern[0].length;
      const randomColors = COLORS.concat().sort(() => Math.random() - 0.5);

      const duration = 23 + Math.random() * 19;
      const delay = Math.random() * 7;

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
        delay,
        duration,
        imageData,
        imageHeight,
        imageWidth,
      };
    });

    setLayers(newLayers);
  }, []);

  return (
    <Box
      sx={{
        '@keyframes bgAnim': {
          '0%': {
            background: 'rgba(0,0,128, 0.1)',
          },
          '020%': {
            background: 'rgba(0,100,0, 0.2)',
          },
          '030%': {
            background: 'rgba(200,0,128, 0.1)',
          },
          '060%': {
            background: 'rgba(120,200,0, 0.15)',
          },
          '070%': {
            background: 'rgba(200,100,20, 0.2)',
          },
          '090%': {
            background: 'rgba(0,0,128, 0.1)',
          },
          '100%': {
            background: 'rgba(0,250,128, 0.2)',
          },
        },
        animationDirection: 'alternate',
        animationDuration: '37s',
        animationIterationCount: 'infinite',
        animationName: 'bgAnim',
        animationTimingFunction: 'ease-in-out',
        height: height,
        overflow: 'hidden',
        position: 'relative',
        width: width,
      }}
    >
      {layers.map((layer, index) => {
        const { imageData, delay, duration, imageWidth, imageHeight } = layer;
        const animName = `canvasAnim${index}`;

        return (
          <Box
            key={index}
            sx={{
              animationDelay: delay + 's',
              animationDirection: 'alternate',
              animationDuration: duration + 's',
              animationFillMode: 'both',
              animationIterationCount: 'infinite',
              animationName: animName,
              bottom: 0,
              left: 0,
              position: 'absolute',
              right: 0,
              rotate: Math.random() < 0.5 ? '0deg' : '180deg',
              top: 0,
              [`@keyframes ${animName}`]: {
                '000%': {
                  filter: 'blur(20px) hue-rotate(0)',
                  opacity: 0,
                },
                '033%': {
                  filter: 'blur(30px) hue-rotate(30deg)',
                  opacity: 0.3,
                },
                '066%': {
                  filter: 'blur(30px) hue-rotate(120deg)',
                  opacity: 0.0,
                },
                '100%': {
                  filter: 'blur(10px) hue-rotate(180deg)',
                  opacity: 0.2,
                },
              },
            }}
          >
            <canvas
              ref={async (canvas) => {
                const ctx = canvas?.getContext('2d');
                if (ctx) {
                  const bitmap = await createImageBitmap(imageData);
                  ctx.drawImage(bitmap, 0, 0);
                }
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

export default ZUIModalBackground;
