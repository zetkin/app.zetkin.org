import { range } from 'lodash';
import { FC, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import PageBase from './PageBase';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import messageIds from 'features/canvass/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import FloorMatrix from '../FloorMatrix';
import { EditedFloor } from '../FloorMatrix/types';
import useLocationMutations from 'features/canvass/hooks/useLocationMutations';
import FloorMatrixToolbar from '../FloorMatrixToolbar';
import useHouseholds from 'features/canvass/hooks/useHouseholds';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onBack: () => void;
  onBulkEdit: (householdIds: number[]) => void;
  onBulkVisit: (households: number[]) => void;
  onClickVisit: (householdId: number) => void;
  onClose: () => void;
  onDetails: (householdId: number) => void;
  onSelectHousehold: (householdId: number) => void;
  onSelectHouseholds: (householdIds: null | number[]) => void;
  selectedHouseholdIds: null | number[];
};

const HouseholdsPage2: FC<Props> = ({
  assignment,
  location,
  onBack,
  onBulkEdit,
  onBulkVisit,
  onClickVisit,
  onClose,
  onDetails,
  onSelectHousehold,
  onSelectHouseholds,
  selectedHouseholdIds,
}) => {
  const messages = useMessages(messageIds);
  const households = useHouseholds(location.organization_id, location.id);
  const { addHouseholds } = useLocationMutations(
    location.organization_id,
    location.id
  );

  const shouldStartInEditMode = households.length == 0;
  const initialDraft = {
    draftHouseholdCount: 1,
    existingHouseholds: [],
    level: 1,
  };

  const [draftFloors, setDraftFloors] = useState<null | EditedFloor[]>(
    shouldStartInEditMode ? [initialDraft] : null
  );

  const hasDrafts = !!draftFloors?.length;
  const hasHouseholds = !!households.length;
  const isEmpty = !hasDrafts && !hasHouseholds;

  return (
    <PageBase
      fullWidth
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
        {households.length == 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              m: 2,
              textAlign: 'center',
            }}
          >
            <Typography color="secondary" sx={{ fontStyle: 'italic' }}>
              <Msg id={messageIds.households.page.empty} />
            </Typography>
            {!draftFloors?.length && (
              <Button
                onClick={() => setDraftFloors([initialDraft])}
                variant="contained"
              >
                Add households
              </Button>
            )}
          </Box>
        )}
        {!isEmpty && (
          <Box
            sx={{
              marginTop: 'auto',
            }}
          >
            <FloorMatrix
              assignment={assignment}
              draftFloors={draftFloors}
              location={location}
              onClickDetails={(householdId) => onDetails(householdId)}
              onClickVisit={onClickVisit}
              onEditChange={(drafts) => {
                setDraftFloors(drafts);
              }}
              onSelectHousehold={onSelectHousehold}
              onUpdateSelection={(selectedIds) =>
                onSelectHouseholds([...new Set(selectedIds)])
              }
              selectedHouseholdIds={selectedHouseholdIds}
            />
          </Box>
        )}
        {!isEmpty && (
          <FloorMatrixToolbar
            draftFloors={draftFloors}
            onBulkEdit={(householdIds) => onBulkEdit(householdIds)}
            onBulkVisit={(householdIds) => onBulkVisit(householdIds)}
            onEditCancelled={() => {
              setDraftFloors(null);
            }}
            onEditSave={async () => {
              const newHouseholds = draftFloors?.flatMap((draft) => {
                const firstNewIndex = draft.existingHouseholds.length;
                const lastNewIndex = firstNewIndex + draft.draftHouseholdCount;
                return range(firstNewIndex, lastNewIndex).map((index) => ({
                  level: draft.level,
                  title: 'Household ' + (index + 1),
                }));
              });

              if (newHouseholds?.length) {
                await addHouseholds(newHouseholds);
              }

              setDraftFloors(null);
            }}
            onEditStart={() => setDraftFloors([])}
            onSelectAll={() =>
              onSelectHouseholds(households.map((household) => household.id))
            }
            onSelectCancelled={() => onSelectHouseholds(null)}
            onSelectNone={() => onSelectHouseholds([])}
            onSelectStart={() => onSelectHouseholds([])}
            selectedHouseholdIds={selectedHouseholdIds}
          />
        )}
      </Box>
    </PageBase>
  );
};

export default HouseholdsPage2;
