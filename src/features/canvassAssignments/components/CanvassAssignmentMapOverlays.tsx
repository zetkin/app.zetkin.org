import { Box, Button, IconButton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { KeyboardArrowUp } from '@mui/icons-material';

import { ZetkinCanvassAssignment, ZetkinPlace } from '../types';
import PlaceDialog from './PlaceDialog';
import { CreatePlaceCard } from './CreatePlaceCard';
import PageBaseHeader from './PlaceDialog/pages/PageBaseHeader';

type Props = {
  assignment: ZetkinCanvassAssignment;
  isCreating: boolean;
  onCreate: (title: string) => void;
  onToggleCreating: (creating: boolean) => void;
  selectedPlace: ZetkinPlace | null;
};

const useStyles = makeStyles(() => ({
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
}));

export type PlaceDialogStep = 'place' | 'edit' | 'household' | 'wizard';

const CanvassAssignmentMapOverlays: FC<Props> = ({
  assignment,
  isCreating,
  onCreate,
  onToggleCreating,
  selectedPlace,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [dialogStep, setDialogStep] = useState<PlaceDialogStep>('place');
  const classes = useStyles();

  const showViewPlaceButton = !!selectedPlace && !expanded;

  let drawerTop = '100vh';
  if (selectedPlace) {
    if (expanded) {
      drawerTop = '20vh';
    } else {
      drawerTop = 'calc(100vh - 5rem)';
    }
  }

  useEffect(() => {
    if (!selectedPlace && expanded) {
      setExpanded(false);
    }
  }, [selectedPlace]);

  return (
    <>
      {!selectedPlace && !isCreating && (
        <Box className={classes.actionAreaContainer}>
          <Button onClick={() => onToggleCreating(true)} variant="contained">
            Add new place
          </Button>
        </Box>
      )}
      <Box
        sx={(theme) => ({
          bgcolor: 'white',
          bottom: 0,
          boxShadow: theme.shadows[20],
          left: 0,
          padding: 2,
          position: 'fixed',
          right: 0,
          top: drawerTop,
          transition: 'top 0.2s',
          zIndex: 10001,
        })}
      >
        {showViewPlaceButton && (
          <Box onClick={() => setExpanded(true)}>
            <PageBaseHeader
              iconButtons={
                <IconButton onClick={() => setExpanded(true)}>
                  <KeyboardArrowUp />
                </IconButton>
              }
              title={selectedPlace.title || 'Untitled place'}
            />
          </Box>
        )}
        {selectedPlace && expanded && (
          <PlaceDialog
            canvassAssId={assignment.id}
            dialogStep={dialogStep}
            onClose={() => {
              setExpanded(false);
            }}
            onEdit={() => setDialogStep('edit')}
            onSelectHousehold={() => setDialogStep('household')}
            onUpdateDone={() => setDialogStep('place')}
            onWizard={() => setDialogStep('wizard')}
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
      </Box>
    </>
  );
};

export default CanvassAssignmentMapOverlays;
