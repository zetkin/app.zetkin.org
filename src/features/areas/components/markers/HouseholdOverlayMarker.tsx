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
      alignItems="center"
      bgcolor="white"
      borderRadius={1}
      boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
      display="inline-flex"
      flexDirection="column"
      gap="2px"
      padding="2px 6px"
      sx={{ translate: '-50% -50%' }}
    >
      <Typography alignItems="center" display="flex" fontSize="14px">
        <DoorFront
          fontSize="small"
          sx={{ color: oldTheme.palette.grey[400] }}
        />
        {props.numberOfHouseholds}
      </Typography>
      <Divider
        sx={{
          width: '100%',
        }}
      />
      <Typography alignItems="center" display="flex" fontSize="14px">
        <Place fontSize="small" sx={{ color: oldTheme.palette.grey[400] }} />
        {props.numberOfLocations}
      </Typography>
    </Box>
  );
};

export default HouseholdOverlayMarker;
