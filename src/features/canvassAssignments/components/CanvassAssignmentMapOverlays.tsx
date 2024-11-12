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

const CanvassAssignmentMapOverlays: FC<Props> = ({
  assignment,
  isCreating,
  onCreate,
  onToggleCreating,
  selectedPlace,
}) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const showViewPlaceButton = !!selectedPlace && !expanded;

  let drawerTop = '100dvh';
  if (selectedPlace) {
    if (expanded) {
      drawerTop = '6rem';
    } else {
      drawerTop = 'calc(100dvh - 5rem)';
    }
  } else if (isCreating) {
    drawerTop = 'calc(100dvh - 9rem)';
  }

  useEffect(() => {
    if (!selectedPlace && expanded) {
      setExpanded(false);
    }
  }, [selectedPlace]);

  const numVisitedHouseholds =
    selectedPlace?.households.filter((household) =>
      household.visits.some((visit) => visit.canvassAssId == assignment.id)
    ).length ?? 0;

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
          position: 'fixed',
          right: 0,
          top: drawerTop,
          transition: 'top 0.2s',
          zIndex: 10001,
        })}
      >
        {showViewPlaceButton && (
          <Box onClick={() => setExpanded(true)} p={2}>
            <PageBaseHeader
              iconButtons={
                <IconButton onClick={() => setExpanded(true)}>
                  <KeyboardArrowUp />
                </IconButton>
              }
              subtitle={`${numVisitedHouseholds} / ${selectedPlace.households.length} households visited`}
              title={selectedPlace.title || 'Untitled place'}
            />
          </Box>
        )}
        {selectedPlace && expanded && (
          <PlaceDialog
            assignment={assignment}
            onClose={() => {
              setExpanded(false);
            }}
            orgId={assignment.organization.id}
            place={selectedPlace}
          />
        )}
        {isCreating && (
          <Box p={2}>
            <CreatePlaceCard
              onClose={() => {
                onToggleCreating(false);
              }}
              onCreate={(title) => {
                onCreate(title);
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default CanvassAssignmentMapOverlays;
