import { Box, Button, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { makeStyles } from '@mui/styles';

import { ZetkinCanvassAssignment, ZetkinPlace } from '../types';
import PlaceDialog from './PlaceDialog';
import { CreatePlaceCard } from './CreatePlaceCard';

type Props = {
  assignment: ZetkinCanvassAssignment;
  isCreating: boolean;
  onCreate: (title: string) => void;
  onDeselect: () => void;
  onToggleCreating: (creating: boolean) => void;
  selectedPlace: ZetkinPlace | null;
};

const useStyles = makeStyles((theme) => ({
  actionAreaContainer: {
    bottom: 15,
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
  infoButtons: {
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    width: '90%',
  },
}));

export type PlaceDialogStep =
  | 'place'
  | 'edit'
  | 'household'
  | 'wizard'
  | 'pickHousehold';

const CanvassAssignmentMapOverlays: FC<Props> = ({
  assignment,
  isCreating,
  onCreate,
  onDeselect,
  onToggleCreating,
  selectedPlace,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [dialogStep, setDialogStep] = useState<PlaceDialogStep>('place');
  const classes = useStyles();

  const showViewPlaceButton = !!selectedPlace && !anchorEl;

  return (
    <>
      <Box className={classes.actionAreaContainer}>
        {showViewPlaceButton && (
          <Box className={classes.infoButtons}>
            <Typography sx={{ paddingBottom: 1 }}>
              {selectedPlace.title || 'Untitled place'}
            </Typography>
            <Button
              fullWidth
              onClick={(ev) => {
                setAnchorEl(ev.currentTarget);
                setDialogStep('place');
              }}
              variant="outlined"
            >
              View place
            </Button>
          </Box>
        )}
        {!selectedPlace && !isCreating && (
          <Button onClick={() => onToggleCreating(true)} variant="contained">
            Add new place
          </Button>
        )}
      </Box>
      {selectedPlace && (
        <PlaceDialog
          canvassAssId={assignment.id}
          dialogStep={dialogStep}
          onClose={() => {
            setAnchorEl(null);
            onDeselect();
          }}
          onEdit={() => setDialogStep('edit')}
          onPickHousehold={() => setDialogStep('pickHousehold')}
          onSelectHousehold={() => setDialogStep('household')}
          onUpdateDone={() => setDialogStep('place')}
          onWizard={() => setDialogStep('wizard')}
          open={!!anchorEl}
          orgId={assignment.organization.id}
          place={selectedPlace}
        />
      )}
      {isCreating && (
        <CreatePlaceCard
          onClose={() => {
            onToggleCreating(false);
          }}
          onCreate={(title) => {
            onCreate(title);
          }}
        />
      )}
    </>
  );
};

export default CanvassAssignmentMapOverlays;
