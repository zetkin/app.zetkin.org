import { lighten, Box } from '@mui/system';
import { Typography } from '@mui/material';
import { useState } from 'react';

import theme from 'theme';
import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';

export interface ZUIRatingChartProps {
  question: string;
  svgHeight?: number;
  values: number[];
}

const ZUIRatingChart: React.FC<ZUIRatingChartProps> = ({
  question,
  svgHeight = 50,
  values,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  let ratingTotals = 0;
  let numRatings = 0;
  values.map((val, i) => {
    numRatings += val;
    ratingTotals += val * (i + 1);
  });

  const avg = ratingTotals / numRatings;
  const stackBarHeight = 34;
  const total = 5;

  // Calculate the remaining width
  const remaining = total - avg;

  // Percentage of the average and remaining space
  const avgWidth = avg / total;
  const remainingWidth = remaining / total;

  return (
    <Box>
      <Typography mb={1}>{question}</Typography>
      <ZUIResponsiveContainer ssrWidth={200}>
        {(width: number) => {
          const highestValue = Math.max(...values, 1);
          let path = `M 0 ${svgHeight}`;
          const dots: { x: number; y: number }[] = [];

          path += values
            .map((val, i) => {
              const x = i * (width / (values.length - 1 || 1));
              const y = svgHeight - (val / highestValue) * svgHeight;
              const prevX = (i - 1) * (width / (values.length - 1 || 1));
              const prevY =
                svgHeight - (values[i - 1] / highestValue) * svgHeight;

              dots.push({ x, y });

              if (i === 0) {
                return `L ${x} ${y}`;
              } else {
                return `C ${prevX + width / 12} ${prevY}, ${
                  x - width / 12
                } ${y}, ${x} ${y}`;
              }
            })
            .join(' ');

          path += ` L ${width} ${svgHeight} Z`;

          return (
            <>
              <svg
                height={svgHeight + 5}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ cursor: 'pointer', overflow: 'visible' }}
                version="1.1"
                width={width}
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(0, 5)">
                  <path
                    d={path}
                    fill={lighten(theme.palette.primary.main, 0.6)}
                  />
                  {/* Render the dots */}
                  {isHovered &&
                    dots.map((dot, index) => (
                      <circle
                        key={index}
                        cx={
                          index === 0
                            ? dot.x + 4
                            : index === 4
                            ? dot.x - 4
                            : dot.x
                        }
                        cy={dot.y}
                        fill={theme.palette.primary.main}
                        r={4}
                      />
                    ))}
                </g>
              </svg>

              {/* Progress bar */}
              <Box
                display="flex"
                flexDirection="row"
                height={stackBarHeight}
                mt={0.5}
                overflow="visible"
                paddingBottom={3.25}
              >
                {/* Segment for the average value */}
                <Box
                  bgcolor={
                    isHovered
                      ? lighten(theme.palette.primary.main, 0.6)
                      : theme.palette.primary.main
                  }
                  borderRadius={'200px 0 0 200px'}
                  borderRight={'solid 2px white'}
                  position="relative"
                  width={`${avgWidth * 100}%`}
                >
                  {/* Average number */}
                  {!isHovered && (
                    <Box
                      position="absolute"
                      right={0}
                      sx={{
                        transform: 'translateX(50%)',
                      }}
                      top={8}
                    >
                      <Typography
                        color={theme.palette.primary.main}
                        variant="h6"
                      >
                        {avg.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                  {isHovered && (
                    <Box>
                      {dots.map((dot, index) => {
                        const adjustedX = dot.x - 4; // 4 is the radius

                        const finalX =
                          index === values.length - 1
                            ? adjustedX - 8
                            : index === 0
                            ? adjustedX + 4
                            : adjustedX;

                        return (
                          <Box
                            key={index}
                            style={{
                              color: theme.palette.primary.main,
                              left: `${finalX}px`,
                              position: 'absolute',
                              top: `${10}px`,
                            }}
                          >
                            <Typography key={index} variant="h6">
                              {values[index]}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
                <Box
                  bgcolor={lighten(theme.palette.primary.main, 0.6)}
                  borderRadius={'0 200px 200px 0'}
                  minWidth={stackBarHeight / 2}
                  width={`${remainingWidth * 100}%`}
                />
              </Box>
            </>
          );
        }}
      </ZUIResponsiveContainer>
    </Box>
  );
};

export default ZUIRatingChart;
