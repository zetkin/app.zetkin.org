import { FC, useEffect, useRef } from 'react';

import { SankeyRenderer } from './drawing';
import { SankeySegment } from './types';

type SmartSearchSankeyDiagramProps = {
  arrowDepth?: number;
  arrowWidth?: number;
  color?: string;
  diagWidth?: number;
  hoverColor?: string;
  margin?: number;
  segments: SankeySegment[];
};

const SmartSearchSankeyDiagram: FC<SmartSearchSankeyDiagramProps> = ({
  arrowDepth = 10,
  arrowWidth = 20,
  color = '#cccccc',
  diagWidth = 200,
  hoverColor = '#bbbbbb',
  margin = 30,
  segments,
}) => {
  const mouseState = useRef({
    hoveredSegment: -1,
  });
  const animFrameRef = useRef(0);
  const startTimeRef = useRef(new Date());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const segHeight = 100;

  const diagHeight = segments.length * segHeight;
  const animDuration = 1000;

  const render = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const now = new Date();
    const time =
      (now.getTime() - startTimeRef.current.getTime()) % animDuration;

    const renderer = new SankeyRenderer(context, {
      animDuration,
      arrowDepth,
      arrowWidth,
      color,
      diagWidth,
      highlightColor: hoverColor,
      lineWidth: 2,
      margin,
      segHeight,
      time,
    });
    renderer.drawSegments(segments, mouseState.current.hoveredSegment);
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
      const count = segments.length;
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
    hoverColor,
    margin,
    segments,
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
