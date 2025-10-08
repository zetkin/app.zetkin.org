import { FC, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';

import PageBase from './PageBase';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import messageIds from 'features/canvass/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import FloorMatrix from '../FloorMatrix';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onBack: () => void;
  onBulkEdit: (householdIds: number[]) => void;
  onBulkVisit: (households: number[]) => void;
  onClickVisit: (householdId: number) => void;
  onClose: () => void;
  onSelectHousehold: (householdId: number) => void;
};

const HouseholdsPage2: FC<Props> = ({
  assignment,
  onBack,
  onBulkEdit,
  onBulkVisit,
  onClickVisit,
  onClose,
  onSelectHousehold,
  location,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [selectedHouseholdIds, setSelectedHouseholdIds] = useState<
    null | number[]
  >(null);

  return (
    <PageBase
      onBack={onBack}
      onClose={onClose}
      subtitle={location.title}
      title={messages.households.page.header()}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        {location.num_known_households == 0 && (
          <Typography color="secondary" sx={{ fontStyle: 'italic' }}>
            <Msg id={messageIds.households.page.empty} />
          </Typography>
        )}
        <Box
          sx={{
            marginTop: 'auto',
          }}
        >
          <FloorMatrix
            assignment={assignment}
            location={location}
            onClickVisit={onClickVisit}
            onSelectHousehold={onSelectHousehold}
            onUpdateSelection={(selectedIds) =>
              setSelectedHouseholdIds(selectedIds)
            }
            selectedHouseholdIds={selectedHouseholdIds}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            bottom: 0,
            display: 'flex',
            gap: 1,
            p: 2,
            position: 'sticky',
          }}
        >
          <Button
            onClick={() =>
              setSelectedHouseholdIds(selectedHouseholdIds ? null : [])
            }
            variant="outlined"
          >
            Toggle selection
          </Button>
          {!!selectedHouseholdIds?.length && (
            <Button
              onClick={() =>
                !!selectedHouseholdIds && onBulkEdit(selectedHouseholdIds)
              }
              variant="outlined"
            >
              Edit
            </Button>
          )}
          {!!selectedHouseholdIds?.length && (
            <Button
              onClick={() =>
                !!selectedHouseholdIds && onBulkVisit(selectedHouseholdIds)
              }
              variant="outlined"
            >
              Visit
            </Button>
          )}
        </Box>
      </Box>
    </PageBase>
  );
};

export default HouseholdsPage2;
