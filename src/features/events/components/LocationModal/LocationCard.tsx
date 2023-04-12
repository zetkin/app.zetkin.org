import { Close } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface LocationDetailsCardProps {
  children: JSX.Element;
  onClose: () => void;
  primaryAction: () => void;
  primaryActionTitle: string;
  secondaryAction?: () => void;
  secondaryActionTitle?: string;
  title: string;
}

const LocationCard: FC<LocationDetailsCardProps> = ({
  children,
  onClose,
  primaryAction,
  primaryActionTitle,
  secondaryAction,
  secondaryActionTitle,
  title,
}) => {
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: 'white',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">{title}</Typography>
        <Close
          color="secondary"
          onClick={() => {
            onClose();
          }}
          sx={{
            cursor: 'pointer',
          }}
        />
      </Box>
      {children}
      <Box
        display="flex"
        justifyContent={secondaryAction ? 'space-between' : 'flex-end'}
        paddingTop={2}
      >
        {secondaryAction && (
          <Button onClick={secondaryAction}>{secondaryActionTitle}</Button>
        )}
        <Button onClick={primaryAction} variant="contained">
          {primaryActionTitle}
        </Button>
      </Box>
    </Box>
  );
};

export default LocationCard;
