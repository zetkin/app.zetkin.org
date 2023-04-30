import { Box, useTheme } from '@mui/material';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';

type EventDayLaneProps = {
  children?: ReactNode;
  onCreate: (startTime: [number, number], endTime: [number, number]) => void;
  onDragStart?: () => void;
};

const EventDayLane: FC<EventDayLaneProps> = ({
  children,
  onCreate,
  onDragStart,
}) => {
  const [dragging, setDragging] = useState(false);
  const laneRef = useRef<HTMLDivElement>();
  const ghostRef = useRef<HTMLDivElement>();
  const onCreateRef = useRef(onCreate);
  const onDragStartRef = useRef(onDragStart);
  const theme = useTheme();

  useEffect(() => {
    onCreateRef.current = onCreate;
  }, [onCreate]);

  useEffect(() => {
    let startRatio = 0;
    let height = 0;

    function handleMouseDown(ev: MouseEvent) {
      const div = ev.currentTarget as HTMLDivElement;
      const rect = div.getBoundingClientRect();
      startRatio = snapToGrid((ev.clientY - rect.top) / rect.height);

      if (onDragStartRef.current) {
        onDragStartRef.current();
      }

      setDragging(true);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(ev: MouseEvent) {
      const div = laneRef.current;
      if (div) {
        const rect = div.getBoundingClientRect();
        const dragRatio = (ev.clientY - rect.top) / rect.height;
        height = snapToGrid(dragRatio - startRatio);

        if (ghostRef.current) {
          ghostRef.current.style.top = startRatio * 100 + '%';
          ghostRef.current.style.height = height * 100 + '%';
        }
      }
    }

    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setDragging(false);

      if (height > 0) {
        const startMinutes = Math.round(startRatio * (24 * 60));
        const endMinutes = startMinutes + Math.round(height * 24 * 60);

        onCreateRef.current(
          [Math.floor(startMinutes / 60), startMinutes % 60],
          [Math.floor(endMinutes / 60), endMinutes % 60]
        );
      }
    }

    laneRef.current?.addEventListener('mousedown', handleMouseDown);

    return () => {
      laneRef.current?.removeEventListener('mousedown', handleMouseDown);
    };
  }, [laneRef.current]);

  return (
    <Box ref={laneRef} height="100%" sx={{ position: 'relative' }} width="100%">
      {children}
      <Box
        ref={ghostRef}
        sx={{
          backgroundColor: 'white',
          borderColor: theme.palette.grey['500'],
          borderRadius: '0.5em',
          borderStyle: 'solid',
          borderWidth: 2,
          boxShadow: '4px 4px 10px rgba(0,0,0,0.2)',
          left: 0,
          opacity: dragging ? 0.7 : 0,
          pointerEvents: 'none',
          position: 'absolute',
          right: 0,
          transition: 'opacity 0.2s',
        }}
      />
    </Box>
  );
};

function snapToGrid(ratio: number, gridSteps: number = 24 * 6) {
  return Math.round(ratio * gridSteps) / gridSteps;
}

export default EventDayLane;
