import { Typography } from '@mui/material';
import { FC } from 'react';
import { lighten, Box } from '@mui/system';

import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';
import theme from '../../theme';

export interface ZUIRatingChartProps {
  data: number[];
  description?: string | null;
  title?: string;
  visualizationHeight?: number;
}

const ZUIRatingChart: FC<ZUIRatingChartProps> = ({
  description,
  title,
  visualizationHeight = 50,
  data,
}) => {
  let ratingTotals = 0;
  let numRatings = 0;
  if (data.every((val) => val >= 0)) {
    data.forEach((val, i) => {
      numRatings += val;
      ratingTotals += val * (i + 1);
    });
  } else {
    return null;
  }

  const avg = ratingTotals / numRatings;
  const maxRating = 5;
  const avgPos = (avg - 1) / (maxRating - 1);

  return (
    <Box
      p={2}
      sx={{
        '& .average .averageRating': {
          fill: 'var(--dataMain)',
          fontSize: 13,
          transition: 'opacity 0.25s',
        },
        '& .average .averageRatingBg': {
          fill: '#FFFFFF',
          filter: 'blur(5px)',
          height: '32px',
          width: '50px',
        },
        '& .chart': {
          fill: 'var(--dataFaded)',
        },
        '& .data .dot': {
          opacity: 0,
        },
        '& .dot': {
          fill: 'var(--dataMain)',
          transitionAttribute: 'fill, opacity',
          transitionDuration: '.25s',
        },
        '& .indexNumber': {
          fill: theme.palette.secondary.light,
          fontSize: 13,
          textAnchor: 'middle',
        },
        '& .ratingCount': {
          fill: 'var(--dataMain)',
          fontSize: 13,
          opacity: 0,
          textAnchor: 'middle',
          transition: 'opacity .25s',
        },
        '& .track': {
          fill: 'var(--dataFocus)',
          transition: 'fill .25s',
        },
        '& svg': {
          '--dataFaded': lighten(theme.palette.primary.main, 0.83),
          '--dataFocus': lighten(theme.palette.primary.main, 0.63),
          '--dataMain': theme.palette.primary.main,
          cursor: 'pointer',
          overflow: 'visible',
        },
        '&:hover .average .averageRating': {
          opacity: 0,
        },
        '&:hover .average .dot': {
          fill: 'var(--dataFocus)',
        },
        '&:hover .chart': {
          fill: 'var(--dataFocus)',
        },
        '&:hover .data .dot': {
          opacity: 1,
        },
        '&:hover .ratingCount': {
          opacity: 1,
        },
        '&:hover .track': {
          fill: 'var(--dataFaded)',
        },
      }}
    >
      {title && <Typography pb={1}>{title}</Typography>}
      {description && (
        <Typography color="secondary" pb={2}>
          {description}
        </Typography>
      )}
      <ZUIResponsiveContainer ssrWidth={200}>
        {(width: number) => {
          const baseNumber = 4;
          const highestValue = Math.max(...data, 1);
          const path = [`M ${baseNumber} ${visualizationHeight}`];
          const dots: { x: number; y: number }[] = [];
          const graphWidth = width - baseNumber * 2;
          const widthPerSegment = graphWidth / (data.length - 1 || 1);

          data.forEach((val, i) => {
            const x = i * widthPerSegment + baseNumber;
            const y =
              visualizationHeight - (val / highestValue) * visualizationHeight;
            const prevX = (i - 1) * widthPerSegment + baseNumber;
            const prevY =
              visualizationHeight -
              (data[i - 1] / highestValue) * visualizationHeight;

            dots.push({ x, y });

            if (i === 0) {
              path.push(`L ${x} ${y}`);
            } else {
              path.push(
                `C ${prevX + graphWidth / 12} ${prevY}, ${
                  x - graphWidth / 12
                } ${y}, ${x} ${y}`
              );
            }
          });

          path.push(`L ${graphWidth + baseNumber} ${visualizationHeight} Z`);

          const finalPath = path.join(' ');

          return (
            <svg
              height={visualizationHeight + 5}
              version="1.1"
              width={width}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="data" transform="translate(0, 5)">
                <path className="chart" d={finalPath} />
                {dots.map((dot, index) => (
                  <>
                    <circle
                      key={index}
                      className="dot"
                      cx={dot.x}
                      cy={dot.y}
                      r={4}
                    />

                    <text className="ratingCount" x={dot.x} y={dot.y - 10}>
                      {data[index]}
                    </text>
                  </>
                ))}
              </g>
              <g
                className="average"
                transform={`translate(0, ${visualizationHeight + 10})`}
              >
                {dots.map((dot, index) => (
                  <text
                    key={index}
                    className="indexNumber"
                    x={index == 4 ? dot.x : dot.x}
                    y="25"
                  >
                    {index + 1}
                  </text>
                ))}
                <rect
                  className="averageRating averageRatingBg"
                  x={avgPos * width - 25}
                  y="4"
                />
                <text className="averageRating" x={avgPos * width - 10} y="25">
                  {avg.toFixed(1)}
                </text>
                <rect
                  className="track"
                  height="8px"
                  rx={4}
                  ry={4}
                  width={width}
                />
                <circle
                  className="dot"
                  cx={avgPos * width}
                  cy={baseNumber}
                  r={4}
                />
              </g>
            </svg>
          );
        }}
      </ZUIResponsiveContainer>
    </Box>
  );
};

export default ZUIRatingChart;
