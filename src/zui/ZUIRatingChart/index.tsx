import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FC } from 'react';
import { lighten, Box } from '@mui/system';

import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';

export interface ZUIRatingChartProps {
  data: number[];
  description?: string | null;
  title?: string;
  visualizationHeight?: number;
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      '--dataMain': theme.palette.primary.main,
      '--dataFocus': lighten(theme.palette.primary.main, 0.63),
      '--dataFaded': lighten(theme.palette.primary.main, 0.83),
      '& svg': {
        cursor: 'pointer',
        overflow: 'visible',
      },
      '& .chart': {
        fill: 'var(--dataFaded)',
      },
      '&:hover .chart': {
        fill: 'var(--dataFocus)',
      },
      '& .dot': {
        fill: 'var(--dataMain)',
        transitionAttribute: 'fill, opacity',
        transitionDuration: '.25s',
      },
      '& .data .dot': {
        opacity: 0,
      },
      '&:hover .data .dot': {
        opacity: 1,
      },
      '& .ratingCount': {
        fill: 'var(--dataMain)',
        fontSize: 13,
        opacity: 0,
        textAnchor: 'middle',
        transition: 'opacity .25s',
      },
      '&:hover .ratingCount': {
        opacity: 1,
      },
      '& .indexNumber': {
        fill: theme.palette.secondary.light,
        fontSize: 13,
        textAnchor: 'middle',
      },
      '& .track': {
        fill: 'var(--dataFocus)',
        transition: 'fill .25s',
      },
      '&:hover .track': {
        fill: 'var(--dataFaded)',
      },
      '&:hover .average .dot': {
        fill: 'var(--dataFocus)',
      },
      '& .average .averageRating': {
        fill: 'var(--dataMain)',
        fontSize: 13,
        transition: 'opacity 0.25s',
      },
      '& .average .averageRatingBg': {
        width: 50,
        height: 32,
        fill: '#FFFFFF',
        filter: 'blur(5px)',
      },
      '&:hover .average .averageRating': {
        opacity: 0,
      },
    },
  };
});

const ZUIRatingChart: FC<ZUIRatingChartProps> = ({
  description,
  title,
  visualizationHeight = 50,
  data,
}) => {
  const classes = useStyles();

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
    <Box className={classes.root} p={2}>
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
          let path = `M ${baseNumber} ${visualizationHeight}`;
          const dots: { x: number; y: number }[] = [];
          const graphWidth = width - baseNumber * 2;

          path += data
            .map((val, i) => {
              const x = i * (graphWidth / (data.length - 1 || 1)) + baseNumber;
              const y =
                visualizationHeight -
                (val / highestValue) * visualizationHeight;
              const prevX =
                (i - 1) * (graphWidth / (data.length - 1 || 1)) + baseNumber;
              const prevY =
                visualizationHeight -
                (data[i - 1] / highestValue) * visualizationHeight;

              dots.push({ x, y });

              if (i === 0) {
                return `L ${x} ${y}`;
              } else {
                return `C ${prevX + graphWidth / 12} ${prevY}, ${
                  x - graphWidth / 12
                } ${y}, ${x} ${y}`;
              }
            })
            .join(' ');

          path += ` L ${graphWidth + baseNumber} ${visualizationHeight} Z`;

          return (
            <svg
              height={visualizationHeight + 5}
              version="1.1"
              width={width}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="data" transform="translate(0, 5)">
                <path className="chart" d={path} />
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
                ></rect>
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
