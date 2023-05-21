import { lighten } from '@mui/system';
import { FC, useEffect, useRef } from 'react';

import makeSankeySegments from './makeSankeySegments';
import { SankeyRenderer } from './drawing';

type SmartSearchSankeyDiagramProps = {
  arrowDepth?: number;
  arrowWidth?: number;
  color?: string;
  diagWidth?: number;
  filterStats: {
    matched: number;
    op: 'add' | 'sub';
    output: number;
  }[];
  margin?: number;
};

const SmartSearchSankeyDiagram: FC<SmartSearchSankeyDiagramProps> = ({
  arrowDepth = 10,
  arrowWidth = 20,
  color = '#cccccc',
  diagWidth = 200,
  filterStats,
  margin = 30,
}) => {
  const mouseState = useRef({
    hoveredSegment: -1,
  });
  const animFrameRef = useRef(0);
  const startTimeRef = useRef(new Date());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const segHeight = 100;

  const diagHeight = filterStats.length * segHeight;
  const animDuration = 1000;

  const render = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const now = new Date();
    const time =
      (now.getTime() - startTimeRef.current.getTime()) % animDuration;
    const gradOffset = (time / animDuration) * 0.96;
    const baseGradient = context.createLinearGradient(0, 0, 0, 4 * diagHeight);
    baseGradient.addColorStop(0 + gradOffset, color);
    baseGradient.addColorStop(0.02 + gradOffset, lighten(color, 0.2));
    baseGradient.addColorStop(0.04 + gradOffset, color);

    const hoverColor = '#f00';
    const hoverGradient = context.createLinearGradient(0, 0, 0, 4 * diagHeight);
    hoverGradient.addColorStop(0 + gradOffset, hoverColor);
    hoverGradient.addColorStop(0.02 + gradOffset, lighten(hoverColor, 0.2));
    hoverGradient.addColorStop(0.04 + gradOffset, hoverColor);

    const segments = makeSankeySegments(filterStats);
    const renderer = new SankeyRenderer(context, {
      arrowDepth,
      arrowWidth,
      diagWidth,
      lineWidth: 2,
      margin,
      segHeight,
    });
    segments.forEach((seg, index) => {
      renderer.drawSegment(seg, index * segHeight);
    });
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

    function handleMouseOut() {
      mouseState.current.hoveredSegment = -1;
    }

    function handleMouseMove(ev: MouseEvent) {
      const count = filterStats.length;
      const index = Math.floor((ev.offsetY / diagHeight) * count);
      mouseState.current.hoveredSegment = Math.max(
        0,
        Math.min(index, count - 1)
      );
    }

    animFrameRef.current = requestAnimationFrame(nextFrame);
    canvasRef.current?.addEventListener('mousemove', handleMouseMove);
    canvasRef.current?.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('mouseout', handleMouseOut);
    };
  }, [
    canvasRef.current,
    arrowDepth,
    arrowWidth,
    color,
    diagWidth,
    filterStats,
    margin,
  ]);

  return (
    <canvas
      ref={canvasRef}
      height={diagHeight + arrowDepth * 2}
      width={diagWidth}
    />
  );
};

export default SmartSearchSankeyDiagram;
