import { range } from 'lodash';
import { FC, useState } from 'react';
import { Box, Typography } from '@mui/material';

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
  const messages = useMessages(messageIds);
  const households = useHouseholds(location.organization_id, location.id);
  const { addHouseholds } = useLocationMutations(
    location.organization_id,
    location.id
  );
  const [draftFloors, setDraftFloors] = useState<null | EditedFloor[]>(null);
  const [selectedHouseholdIds, setSelectedHouseholdIds] = useState<
    null | number[]
  >(null);

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
            draftFloors={draftFloors}
            location={location}
            onClickVisit={onClickVisit}
            onEditChange={(drafts) => {
              setDraftFloors(drafts);
            }}
            onSelectHousehold={onSelectHousehold}
            onUpdateSelection={(selectedIds) =>
              setSelectedHouseholdIds(selectedIds)
            }
            selectedHouseholdIds={selectedHouseholdIds}
          />
        </Box>
        <FloorMatrixToolbar
          draftFloors={draftFloors}
          onBulkEdit={(householdIds) => onBulkEdit(householdIds)}
          onBulkVisit={(householdIds) => onBulkVisit(householdIds)}
          onEditCancelled={() => setDraftFloors(null)}
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
            setSelectedHouseholdIds(households.map((household) => household.id))
          }
          onSelectCancelled={() => setSelectedHouseholdIds(null)}
          onSelectNone={() => setSelectedHouseholdIds([])}
          onSelectStart={() => setSelectedHouseholdIds([])}
          selectedHouseholdIds={selectedHouseholdIds}
        />
      </Box>
    </PageBase>
  );
};

export default HouseholdsPage2;
