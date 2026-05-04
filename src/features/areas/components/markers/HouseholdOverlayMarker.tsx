import { DoorFront, Place } from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import { FC } from 'react';

import oldTheme from 'theme';

type Props = {
  numberOfHouseholds: number;
  numberOfLocations: number;
};

const HouseholdOverlayMarker: FC<Props> = (props: {
  numberOfHouseholds: number;
  numberOfLocations: number;
}) => {
  return (
    <Box
      bgcolor="white"
      borderRadius={1}
      boxShadow="0px 4px 20px 0px rgba(0,0,0,0.15)"
      display="inline-flex"
      flexDirection="column"
      sx={{ translate: '-50% -50%' }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: '2px',
          padding: '2px 4px 2px 2px',
        }}
      >
        <DoorFront
          fontSize="small"
          sx={{ color: oldTheme.palette.grey[400] }}
        />
        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
          {props.numberOfHouseholds}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: '2px',
          padding: '2px 4px 2px 2px',
        }}
      >
        <Place fontSize="small" sx={{ color: oldTheme.palette.grey[400] }} />
        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
          {props.numberOfLocations}
        </Typography>
      </Box>
    </Box>
  );
};

export default HouseholdOverlayMarker;
