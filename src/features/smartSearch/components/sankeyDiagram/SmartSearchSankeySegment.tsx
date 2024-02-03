import { Box } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import { SankeyRenderer } from './drawing';
import SmartSearchSankeyExitPopper from './SmartSearchSankeyExitPopper';
import SmartSearchSankeyStatsPopper from './SmartSearchSankeyStatsPopper';
import useResizeObserver from 'zui/hooks/useResizeObserver';
import { SankeyConfig, SankeySegment, SEGMENT_KIND } from './types';

type SmartSearchSankeySegmentProps = {
  config: SankeyConfig;
  segment: SankeySegment;
};

const SmartSearchSankeySegment: FC<SmartSearchSankeySegmentProps> = ({
  config,
  segment,
}) => {
  const animFrameRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasHeight, setCanvasHeight] = useState(60);
  const [canvasWidth, setCanvasWidth] = useState(200);
  const [hovered, setHovered] = useState(false);

  const render = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const renderer = new SankeyRenderer(
      context,
      {
        ...config,
        diagWidth: canvasWidth,
      },
      canvasHeight
    );
    renderer.drawSegments([segment], hovered ? 0 : -1);
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      render(context);
    }

    function nextFrame() {
      if (context) {
        render(context);
        animFrameRef.current = requestAnimationFrame(nextFrame);
      }
    }

    animFrameRef.current = requestAnimationFrame(nextFrame);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    canvasRef.current,
    canvasHeight,
    canvasWidth,
    config.arrowDepth,
    config.arrowWidth,
    config.color,
    config.highlightColor,
    hovered,
    config.margin,
    segment,
  ]);

  const rectRef = useResizeObserver((elem) => {
    const rect = elem.getBoundingClientRect();
    setCanvasHeight(rect.height);
    setCanvasWidth(rect.width);
  });

  return (
    <Box
      ref={rectRef}
      onMouseOut={() => setHovered(false)}
      onMouseOver={() => setHovered(true)}
      sx={{
        height: '100%',
        minHeight: 60,
        position: 'relative',
        width: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        height={canvasHeight}
        style={{
          display: 'block',
          // This is absolute, so that it does not affect the size of it's
          // parent element, since that element is used to figure out how
          // big this canvas should be.
          position: 'absolute',
        }}
        width={canvasWidth}
      />
      {'stats' in segment && (
        <SmartSearchSankeyStatsPopper
          anchorEl={canvasRef.current}
          open={hovered}
          stats={segment.stats}
        />
      )}
      {segment.kind == SEGMENT_KIND.EXIT && (
        <SmartSearchSankeyExitPopper
          anchorEl={canvasRef.current}
          open={hovered}
          output={segment.output}
        />
      )}
    </Box>
  );
};

export default SmartSearchSankeySegment;
