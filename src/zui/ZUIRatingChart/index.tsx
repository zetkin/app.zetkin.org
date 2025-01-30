import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FC, useState } from 'react';
import { lighten, Box, useTheme } from '@mui/system';

import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';

export interface ZUIRatingChartProps {
  question: string;
  svgHeight?: number;
  values: number[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .average .averageRating': {
      fill: theme.palette.primary.main,
      transition: 'fill 0.25s',
    },
    '& .average .dot': {
      fill: theme.palette.primary.main,
    },
    '& .data .dot': {
      fill: lighten(theme.palette.primary.main, 0.4),
    },
    '& .dot': {
      transition: 'fill .25s',
    },
    '& .rawNumber, & .indexNumber': {
      fill: 'transparent',
      textAnchor: 'middle',
      transition: 'fill .25s',
    },
    '&:hover .average .averageRating': {
      fill: 'transparent',
    },
    '&:hover .average .dot': {
      fill: lighten(theme.palette.primary.main, 0.4),
    },
    '&:hover .data .dot': {
      fill: theme.palette.primary.main,
    },
    '&:hover .indexNumber': {
      fill: theme.palette.secondary.light,
    },
    '&:hover .rawNumber': {
      fill: theme.palette.primary.main,
    },
  },
}));

const ZUIRatingChart: FC<ZUIRatingChartProps> = ({
  question,
  svgHeight = 50,
  values,
}) => {
  const theme = useTheme();
  const classes = useStyles();

  const [isHovered, setIsHovered] = useState(false);

  let ratingTotals = 0;
  let numRatings = 0;
  if (values.every((val) => val >= 0)) {
    values.forEach((val, i) => {
      numRatings += val;
      ratingTotals += val * (i + 1);
    });
  } else {
    return null;
  }

  const avg = ratingTotals / numRatings;
  const total = 5;
  const avgWidth = avg / total;

  return (
    <Box className={classes.root} p={2}>
      <Typography pb={2}>{question}</Typography>
      <ZUIResponsiveContainer ssrWidth={200}>
        {(width: number) => {
          const baseNumber = 4;
          const highestValue = Math.max(...values, 1);
          let path = `M ${baseNumber} ${svgHeight}`;
          const dots: { x: number; y: number }[] = [];
          const graphWidth = width - baseNumber * 2;

          path += values
            .map((val, i) => {
              const x =
                i * (graphWidth / (values.length - 1 || 1)) + baseNumber;
              const y = svgHeight - (val / highestValue) * svgHeight;
              const prevX =
                (i - 1) * (graphWidth / (values.length - 1 || 1)) + baseNumber;
              const prevY =
                svgHeight - (values[i - 1] / highestValue) * svgHeight;

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

          path += ` L ${graphWidth + baseNumber} ${svgHeight} Z`;

          return (
            <svg
              height={svgHeight + 5}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ cursor: 'pointer', overflow: 'visible' }}
              version="1.1"
              width={width}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="data" transform="translate(0, 5)">
                <path
                  d={path}
                  fill={lighten(theme.palette.primary.main, 0.6)}
                />
                {dots.map((dot, index) => (
                  <>
                    <circle
                      key={index}
                      className="dot"
                      cx={dot.x}
                      cy={dot.y}
                      fill={
                        isHovered
                          ? theme.palette.primary.main
                          : lighten(theme.palette.primary.light, 0.6)
                      }
                      r={4}
                    />

                    <text
                      className={`rawNumber`}
                      fill={theme.palette.primary.main}
                      fontSize="13px"
                      x={dot.x}
                      y={dot.y - 10}
                    >
                      {values[index]}
                    </text>
                  </>
                ))}
              </g>
              <g className="average" transform="translate(0,60)">
                <rect
                  fill={lighten(theme.palette.primary.light, 0.6)}
                  height="8px"
                  rx={4}
                  ry={4}
                  width={width}
                />
                <circle
                  className="dot"
                  cx={avgWidth * width}
                  cy={baseNumber}
                  r={4}
                />
                <text
                  className="averageRating"
                  fill={theme.palette.primary.main}
                  fontSize="13"
                  x={avgWidth * width - 10}
                  y="25"
                >
                  {avg.toFixed(1)}
                </text>
                {dots.map((dot, index) => (
                  <text
                    key={index}
                    className={`indexNumber`}
                    fontSize="13"
                    x={index == 4 ? dot.x : dot.x}
                    y="25"
                  >
                    {index + 1}
                  </text>
                ))}
              </g>
            </svg>
          );
        }}
      </ZUIResponsiveContainer>
    </Box>
  );
};

export default ZUIRatingChart;
