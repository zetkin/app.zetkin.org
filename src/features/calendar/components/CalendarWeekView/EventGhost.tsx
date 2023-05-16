import { forwardRef } from 'react';
import { Box, useTheme } from '@mui/material';

type EventGhostProps = {
  elevated?: boolean;
  height?: number | string;
  opacity?: number;
  y?: number | string;
};

const EventGhost = forwardRef<HTMLDivElement, EventGhostProps>(
  function EventGhost({ elevated, height, opacity = 0.7, y }, ref) {
    const theme = useTheme();
    return (
      <Box
        ref={ref}
        sx={{
          backgroundColor: 'white',
          borderColor: theme.palette.grey['500'],
          borderRadius: '4px',
          borderStyle: 'solid',
          borderWidth: 1,
          boxShadow: elevated ? '4px 4px 10px rgba(0,0,0,0.2)' : undefined,
          height: height,
          left: 0,
          opacity: opacity,
          pointerEvents: 'none',
          position: 'absolute',
          right: 0,
          top: y,
          transition: 'opacity 0.2s',
        }}
      />
    );
  }
);

export default EventGhost;
