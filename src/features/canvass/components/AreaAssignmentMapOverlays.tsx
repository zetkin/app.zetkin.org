import { Box, Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';

import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import LocationDialog from './LocationDialog';
import { CreateLocationCard } from './CreateLocationCard';
import ContractedHeader from './LocationDialog/ContractedHeader';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  assignment: ZetkinAreaAssignment;
  isCreating: boolean;
  onCreate: (title: string) => void;
  onToggleCreating: (creating: boolean) => void;
  selectedLocation: ZetkinLocation | null;
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

const AreaAssignmentMapOverlays: FC<Props> = ({
  assignment,
  isCreating,
  onCreate,
  onToggleCreating,
  selectedLocation,
}) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const showViewLocationButton = !!selectedLocation && !expanded;

  let drawerTop = '100dvh';
  if (selectedLocation) {
    if (expanded) {
      drawerTop = '6rem';
    } else {
      drawerTop = 'calc(100dvh - 5rem)';
    }
  } else if (isCreating) {
    drawerTop = 'calc(100dvh - 9rem)';
  }

  useEffect(() => {
    if (!selectedLocation && expanded) {
      setExpanded(false);
    }
  }, [selectedLocation]);

  return (
    <>
      {!selectedLocation && !isCreating && (
        <Box className={classes.actionAreaContainer}>
          <Button onClick={() => onToggleCreating(true)} variant="contained">
            <Msg id={messageIds.map.addLocation.add} />
          </Button>
        </Box>
      )}
      <Box
        sx={(theme) => ({
          bgcolor: 'white',
          bottom: 0,
          boxShadow: theme.shadows[20],
          left: 0,
          position: 'absolute',
          right: 0,
          top: drawerTop,
          transition: 'top 0.2s',
          zIndex: 10001,
        })}
      >
        {showViewLocationButton && (
          <Box onClick={() => setExpanded(true)} p={2}>
            <ContractedHeader
              assignment={assignment}
              location={selectedLocation}
            />
          </Box>
        )}
        {selectedLocation && expanded && (
          <LocationDialog
            assignment={assignment}
            location={selectedLocation}
            onClose={() => {
              setExpanded(false);
            }}
            orgId={assignment.organization.id}
          />
        )}
        {isCreating && (
          <Box p={2}>
            <CreateLocationCard
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

export default AreaAssignmentMapOverlays;
