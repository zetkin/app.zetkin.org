import { Box } from '@mui/material';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import EventGhost from './EventGhost';

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
  const ghostRef = useRef<HTMLDivElement>(null);
  const onCreateRef = useRef(onCreate);
  const onDragStartRef = useRef(onDragStart);

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
      <EventGhost ref={ghostRef} elevated opacity={dragging ? 0.7 : 0} />
    </Box>
  );
};

function snapToGrid(ratio: number, gridSteps: number = 24 * 6) {
  return Math.round(ratio * gridSteps) / gridSteps;
}

export default EventDayLane;
