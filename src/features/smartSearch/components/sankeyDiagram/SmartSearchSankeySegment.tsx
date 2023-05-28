import { Box } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import { SankeyRenderer } from './drawing';
import { SankeySegment } from './types';

type SmartSearchSankeySegmentProps = {
  arrowDepth?: number;
  arrowWidth?: number;
  color?: string;
  diagWidth?: number;
  hoverColor?: string;
  margin?: number;
  segment: SankeySegment;
};

const SmartSearchSankeySegment: FC<SmartSearchSankeySegmentProps> = ({
  segment,
  arrowDepth = 10,
  arrowWidth = 20,
  color = '#cccccc',
  diagWidth = 200,
  hoverColor = '#bbbbbb',
  margin = 30,
}) => {
  const animFrameRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const segHeight = 100;

  const render = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const renderer = new SankeyRenderer(context, {
      arrowDepth,
      arrowWidth,
      color,
      diagWidth,
      highlightColor: hoverColor,
      lineWidth: 2,
      margin,
      segHeight,
    });
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
    arrowDepth,
    arrowWidth,
    color,
    diagWidth,
    hoverColor,
    hovered,
    margin,
    segment,
  ]);

  return (
    <Box
      onMouseOut={() => setHovered(false)}
      onMouseOver={() => setHovered(true)}
    >
      <canvas
        ref={canvasRef}
        height={segHeight}
        style={{
          display: 'block',
        }}
        width={diagWidth}
      />
    </Box>
  );
};

export default SmartSearchSankeySegment;
