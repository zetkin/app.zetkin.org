import { Box } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import { SankeyRenderer } from './drawing';
import { SankeyConfig, SankeySegment } from './types';

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
  const [hovered, setHovered] = useState(false);

  const render = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const renderer = new SankeyRenderer(context, config);
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
    config.arrowDepth,
    config.arrowWidth,
    config.color,
    config.diagWidth,
    config.highlightColor,
    hovered,
    config.margin,
    segment,
  ]);

  return (
    <Box
      onMouseOut={() => setHovered(false)}
      onMouseOver={() => setHovered(true)}
    >
      <canvas
        ref={canvasRef}
        height={config.segHeight}
        style={{
          display: 'block',
        }}
        width={config.diagWidth}
      />
    </Box>
  );
};

export default SmartSearchSankeySegment;
