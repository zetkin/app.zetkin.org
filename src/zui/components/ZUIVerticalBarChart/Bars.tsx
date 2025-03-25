import { Box, Typography } from '@mui/material';
import { FC, useRef, useState } from 'react';

type BarsProps = {
  data: {
    label: string;
    value: number;
  }[];
  maxValue: number;
  visualizationHeight: number;
};

const Bars: FC<BarsProps> = ({ data, maxValue, visualizationHeight }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [barIndex, setBarIndex] = useState<number>(-1);
  const [labelElem, setLabelElem] = useState<HTMLDivElement | null>(null);
  const [valueElem, setValueElem] = useState<HTMLDivElement | null>(null);

  function calcHoverXPos(el: HTMLDivElement | null) {
    if (barIndex >= 0 && containerRef.current && el) {
      const hoveredBar = containerRef.current.querySelector(
        `.barContainer:nth-of-type(${barIndex + 1})`
      ) as HTMLDivElement;
      const containerWidth = containerRef.current.clientWidth;
      const barOffset = hoveredBar.offsetLeft;
      const barWidth = hoveredBar.clientWidth;
      const elWidth = el.clientWidth;

      const calculatedX = barOffset + barWidth / 2 - elWidth / 2;
      const boundedX = Math.max(
        0,
        Math.min(calculatedX, containerWidth - elWidth)
      );
      return boundedX;
    }
    return 0;
  }

  return (
    <Box
      ref={containerRef}
      onPointerLeave={() => {
        setBarIndex(-1);
      }}
      sx={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Box
        component="ol"
        sx={(theme) => ({
          '&:has(.barContainer:hover)': {
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
        })}
      >
        {data.map((row, index) => {
          return (
            <Box
              key={index}
              className="barContainer"
              component="li"
              onPointerEnter={() => {
                setBarIndex(index);
              }}
              sx={(theme) => ({
                '&:hover': {
                  '--barColor': theme.palette.data.main,
                },
                '--barColor': theme.palette.data.mid1,
                '@container (max-width: 4rem)': {
                  '& .label': { opacity: 0 },
                },
                alignItems: 'end',
                containerType: 'inline-size',
                display: 'flex',
                flex: 1,
                height: '100%',
                padding: 0,
                position: 'relative',
              })}
            >
              <Typography
                className="label"
                component="span"
                sx={{
                  '--translateX': '-50%',
                  '--translateY': '0',
                  color: 'text.secondary',
                  left: '50%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  paddingBlock: '0.125rem',
                  paddingInline: '0.25rem',
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
                }}
                variant="labelSmMedium"
              >
                {row.label}
              </Typography>
              <Box
                aria-label={row.value.toString()}
                style={{ height: `${(row.value / maxValue) * 100}%` }}
                sx={{
                  backgroundColor: 'var(--barColor)',
                  borderRadius: '0.25rem',
                  flex: '1 0 auto',
                  marginInline: 'min(0.25rem, 10%)',
                  transition: 'background-color 0.3s',
                  width: 'auto',
                }}
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
            component="div"
            sx={{
              color: 'data.main',
              left: calcHoverXPos(labelElem),
              opacity: labelElem ? 1 : 0,
              paddingBlock: '0.125rem',
              pointerEvents: 'none',
              position: 'absolute',
              top: '100%',
              transitionDuration: '.3s',
              transitionProperty: 'opacity',
              whiteSpace: 'nowrap',
              width: 'auto',
            }}
            variant="labelSmMedium"
          >
            {data[barIndex].label}
          </Typography>
          <Typography
            ref={(elem: HTMLDivElement) => setValueElem(elem)}
            aria-live="polite"
            component="div"
            sx={{
              color: 'data.main',
              left: calcHoverXPos(valueElem),
              opacity: valueElem ? 1 : 0,
              paddingBlock: '0.125rem',
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              transitionDuration: '.3s',
              transitionProperty: 'opacity',
              translate: `0 -100%`,
              whiteSpace: 'nowrap',
              width: 'auto',
            }}
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
