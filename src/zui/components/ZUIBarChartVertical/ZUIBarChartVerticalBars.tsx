import { Box, Typography } from '@mui/material';
import React, { FC, useRef, useState } from 'react';
import { useTheme } from '@mui/system';

export interface ZUIBarChartVerticalBarsProps {
  data: {
    label: string;
    value: number;
  }[];
  maxValue: number;
  visualizationHeight: number;
}
export interface hoveredBarStateProps {
  bar: HTMLElement;
  label: string;
  value: number;
}

const ZUIBarChartVerticalBars: FC<ZUIBarChartVerticalBarsProps> = ({
  data,
  maxValue,
  visualizationHeight,
}) => {
  const [hoveredBar, setHoveredBar] = useState<hoveredBarStateProps | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const style = {
    bar: {
      backgroundColor: 'var(--barColor)',
      borderRadius: 1,
      flex: '1 0 auto',
      marginInline: `min(${theme.spacing(0.5)}, 10%)`,
      transition: 'background-color 0.3s',
      width: 'auto',
    },
    bar_container: {
      '&:hover': {
        '--barColor': theme.palette.data.main,
      },
      '--barColor': theme.palette.data.mid1,
      '@container (max-width: 4em)': {
        '& .label': { opacity: 0 },
      },
      alignItems: 'end',
      containerType: 'inline-size',
      display: 'flex',
      flex: 1,
      height: '100%',
      padding: 0,
      position: 'relative',
    },
    bars: {
      '&:has(li:hover)': {
        '.label': {
          opacity: 0,
        },
        'li:not(:hover)': {
          '--barColor': theme.palette.data.final,
        },
      },
      display: 'flex',
      flex: '1',
      height: visualizationHeight,
      justifyContent: 'stretch',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    hoverLabel: {
      color: 'data.main',
      paddingInline: 0,
    },
    hoverLabelInline: { opacity: 0 },
    hoverValue: {
      paddingBlock: 0.25,
      top: 0,
    },
    hoverValueInline: { opacity: 0 },
    label: {
      '--translateX': '-50%',
      '--translateY': '0',
      color: 'text.secondary',
      left: '50%',
      maxWidth: '100%',
      overflow: 'hidden',
      paddingBlock: 0.25,
      paddingInline: 0.5,
      pointerEvents: 'none',
      position: 'absolute',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      top: '100%',
      transitionDuration: '0.3s',
      transitionProperty: 'opacity',
      translate: 'var(--translateX) var(--translateY)',
      whiteSpace: 'nowrap',
      width: 'auto',
    },
    root: {
      position: 'relative',
      width: '100%',
    },
    sr_only: {
      border: 0,
      clipPath: 'inset(50%)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: '1px',
      wordWrap: 'normal !important',
    },
    value: {
      '--translateX': '-50%',
      '--translateY': '-100%',
      color: 'data.main',
      left: '50%',
      opacity: 0,
      pointerEvents: 'none',
      position: 'absolute',
      top: '100%',
      translate: `var(--translateX) var(--translateY)`,
    },
  };

  if (hoveredBar) {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const barOffset = hoveredBar.bar.offsetLeft || 0;
    const barWidth = hoveredBar.bar.clientWidth || 0;
    const valueWidth = valueRef.current?.clientWidth || 0;
    const labelWidth = labelRef.current?.clientWidth || 0;

    const baseStyle = {
      left: barOffset + barWidth / 2,
      opacity: 1,
    };
    const boundedLeft = {
      '--translateX': `0`,
      left: 0,
    };
    const boundedRight = {
      '--translateX': '-100%',
      left: containerWidth,
    };

    let hoveredValue = {
      ...baseStyle,
    };
    let hoveredLabel = {
      ...baseStyle,
    };
    if (valueWidth > barWidth) {
      if (barOffset + barWidth / 2 <= valueWidth / 2) {
        hoveredValue = {
          ...hoveredValue,
          ...boundedLeft,
        };
      } else if (containerWidth <= barOffset + barWidth / 2 + valueWidth / 2) {
        hoveredValue = {
          ...hoveredValue,
          ...boundedRight,
        };
      }
    }
    if (labelWidth > barWidth) {
      if (barOffset + barWidth / 2 <= labelWidth / 2) {
        hoveredLabel = {
          ...hoveredLabel,
          ...boundedLeft,
        };
      } else if (containerWidth <= barOffset + barWidth / 2 + labelWidth / 2) {
        hoveredLabel = {
          ...hoveredLabel,
          ...boundedRight,
        };
      }
    }

    style.hoverValue = {
      ...style.hoverValue,
      ...hoveredValue,
    };
    style.hoverLabel = {
      ...style.hoverLabel,
      ...hoveredLabel,
    };
  }

  return (
    <Box
      ref={containerRef}
      className="barsContainer"
      onPointerLeave={() => {
        setHoveredBar(null);
      }}
      sx={style.root}
    >
      <Box className="bars" component="ol" sx={style.bars}>
        {data.map((row, index) => {
          return (
            <Box
              key={index}
              component="li"
              onPointerEnter={(ev) => {
                setHoveredBar({
                  bar: ev.currentTarget,
                  label: row.label,
                  value: row.value,
                });
              }}
              sx={style.bar_container}
            >
              <Typography
                className="label"
                component="span"
                sx={style.label}
                variant="labelSmMedium"
              >
                {row.label}
              </Typography>
              <Typography
                className="value"
                component="span"
                sx={style.sr_only}
                variant="labelSmMedium"
              >
                {row.value}
              </Typography>
              <Box
                className="bar"
                style={{ height: `${(row.value / maxValue) * 100}%` }}
                sx={[style.bar]}
              />
            </Box>
          );
        })}
      </Box>
      {hoveredBar && (
        <>
          <Typography
            ref={valueRef}
            className="hoverValue"
            component="div"
            sx={[style.value, style.hoverValue]}
            variant="labelSmMedium"
          >
            {hoveredBar?.value}
          </Typography>
          <Typography
            ref={labelRef}
            className="hoverLabel"
            component="div"
            sx={[style.label, style.hoverLabel]}
            variant="labelSmMedium"
          >
            {hoveredBar?.label}
          </Typography>
        </>
      )}
    </Box>
  );
};
export default ZUIBarChartVerticalBars;
