import { lighten } from '@mui/system';
import { FC, useEffect, useRef } from 'react';

import {
  drawFilterInputOutput,
  drawFilterMainStream,
  Measurements,
} from './drawing';

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
  const diagCenter = diagWidth / 2;

  const maxStreamWidth = diagWidth - margin * 2;
  const maxSegOutput = Math.max(...filterStats.map((stats) => stats.output));
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

    filterStats.forEach((stats, index) => {
      const inputCount = index > 0 ? filterStats[index - 1].output : 0;
      const inputWidth = (inputCount / maxSegOutput) * maxStreamWidth;
      const outputWidth = (stats.output / maxSegOutput) * maxStreamWidth;

      const change = stats.output - inputCount;
      const changeWidth = (Math.abs(change) / maxSegOutput) * maxStreamWidth;

      const measurements: Measurements = {
        arrowDepth,
        arrowWidth,
        change,
        changeWidth,
        diagCenter,
        diagWidth,
        inputWidth,
        lineWidth: 2,
        margin,
        offsetY: index * segHeight,
        outputWidth,
        segHeight,
      };

      const gradient =
        index == mouseState.current.hoveredSegment
          ? hoverGradient
          : baseGradient;

      if (inputCount > 0) {
        context.fillStyle = gradient;
        context.beginPath();
        drawFilterMainStream(context, measurements);
        context.fill();
      }

      drawFilterInputOutput(context, gradient, stats.op, measurements);
    });

    // Draw the final arrow
    const lastStats = filterStats[filterStats.length - 1];
    const outputWidth = (lastStats.output / maxSegOutput) * maxStreamWidth;
    context.fillStyle = baseGradient;
    context.beginPath();
    context.moveTo(diagCenter - outputWidth / 2, diagHeight);
    context.lineTo(diagCenter + outputWidth / 2, diagHeight);
    context.lineTo(diagCenter, diagHeight + arrowDepth * 2);
    context.lineTo(diagCenter - outputWidth / 2, diagHeight);
    context.fill();
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
