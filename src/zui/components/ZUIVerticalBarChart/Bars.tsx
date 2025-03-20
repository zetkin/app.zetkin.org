import { Box, Typography } from '@mui/material';
import React, { FC, useRef, useState } from 'react';
import { useTheme } from '@mui/system';

type BarsProps = {
  data: {
    label: string;
    value: number;
  }[];
  maxValue: number;
  visualizationHeight: number;
};

const Bars: FC<BarsProps> = ({ data, maxValue, visualizationHeight }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barIndex, setBarIndex] = useState<number>(-1);
  const [labelElem, setLabelElem] = useState<HTMLElement>();
  const [valueElem, setValueElem] = useState<HTMLElement>();
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
    barContainer: {
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
    hoveringElem: {
      color: 'data.main',
      paddingBlock: 0.25,
      pointerEvents: 'none',
      position: 'absolute',
      transitionDuration: '.3s',
      transitionProperty: 'opacity',
      whiteSpace: 'nowrap',
      width: 'auto',
    },
    hoveringLabel: {
      top: '100%',
    },
    hoveringValue: {
      top: 0,
      translate: `0 -100%`,
    },
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
  };

  if (barIndex >= 0) {
    const hoveredBar = containerRef.current?.querySelector(
      `li:nth-of-type(${barIndex + 1})`
    ) as HTMLDivElement;
    const containerWidth = containerRef.current?.clientWidth || 0;
    const barOffset = hoveredBar?.offsetLeft || 0;
    const barWidth = hoveredBar?.clientWidth || 0;
    const valueWidth = valueElem?.clientWidth || 0;
    const labelWidth = labelElem?.clientWidth || 0;

    const calculatedValuePosX = barOffset + barWidth / 2 - valueWidth / 2;
    const boundedValuePosX = Math.max(
      0,
      Math.min(calculatedValuePosX, containerWidth - valueWidth)
    );

    const calculatedLabelPosX = barOffset + barWidth / 2 - labelWidth / 2;
    const boundedLabelPosX = Math.max(
      0,
      Math.min(calculatedLabelPosX, containerWidth - labelWidth)
    );

    style.hoveringValue = {
      ...style.hoveringElem,
      ...style.hoveringValue,
      ...{ left: boundedValuePosX, opacity: valueWidth > 0 ? 1 : 0 },
    };
    style.hoveringLabel = {
      ...style.hoveringElem,
      ...style.hoveringLabel,
      ...{ left: boundedLabelPosX, opacity: valueWidth > 0 ? 1 : 0 },
    };
  }

  return (
    <Box
      ref={containerRef}
      className="barsContainer"
      onPointerLeave={() => {
        setBarIndex(-1);
      }}
      sx={style.root}
    >
      <Box className="bars" component="ol" sx={style.bars}>
        {data.map((row, index) => {
          return (
            <Box
              key={index}
              component="li"
              onPointerEnter={() => {
                setBarIndex(index);
              }}
              sx={style.barContainer}
            >
              <Typography
                className="label"
                component="span"
                sx={style.label}
                variant="labelSmMedium"
              >
                {row.label}
              </Typography>
              <Box
                aria-label={row.value.toString()}
                className="bar"
                style={{ height: `${(row.value / maxValue) * 100}%` }}
                sx={[style.bar]}
              />
            </Box>
          );
        })}
      </Box>
      {barIndex >= 0 && (
        <>
          <Typography
            ref={(elem: HTMLDivElement) => setLabelElem(elem)}
            aria-live="polite"
            className="hoveringLabel"
            component="div"
            sx={style.hoveringLabel}
            variant="labelSmMedium"
          >
            {data[barIndex].label}
          </Typography>
          <Typography
            ref={(elem: HTMLDivElement) => setValueElem(elem)}
            aria-live="polite"
            className="hoveringValue"
            component="div"
            sx={style.hoveringValue}
            variant="labelSmMedium"
          >
            {data[barIndex].value}
          </Typography>
        </>
      )}
    </Box>
  );
};
export default Bars;
