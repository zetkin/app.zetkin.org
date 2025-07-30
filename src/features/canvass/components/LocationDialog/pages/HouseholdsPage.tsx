import { FC, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
  useTheme,
} from '@mui/material';
import { Add, Apps, KeyboardArrowRight } from '@mui/icons-material';

import PageBase from './PageBase';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import useLocationMutations from 'features/canvass/hooks/useLocationMutations';
import messageIds from 'features/canvass/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import useHouseholds from 'features/canvass/hooks/useHouseholds';
import { Zetkin2Household } from 'features/canvass/types';
import useVisitReporting from 'features/canvass/hooks/useVisitReporting';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onBack: () => void;
  onBulk: () => void;
  onClose: () => void;
  onCreateHousehold: (householdId: Zetkin2Household) => void;
  onSelectHousehold: (householdId: number) => void;
  onStartHouseholdsVisit: (households: number[]) => void; //change this to households
};

const HouseholdsPage: FC<Props> = ({
  assignment,
  onBack,
  onBulk,
  onClose,
  onCreateHousehold,
  onSelectHousehold,
  onStartHouseholdsVisit,
  location,
}) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const households = useHouseholds(location.organization_id, location.id);
  const [adding, setAdding] = useState(false);
  const [reportMany, setReportMany] = useState(false);
  const [selectedHouseholds, setSelectedHouseholds] = useState<number[]>([]);
  const { addHousehold } = useLocationMutations(
    location.organization_id,
    location.id
  );
  const { lastVisitByHouseholdId } = useVisitReporting(
    location.organization_id,
    assignment.id,
    location.id
  );

  const sortedHouseholds = households.concat().sort((h0, h1) => {
    const floor0 = h0.level ?? Infinity;
    const floor1 = h1.level ?? Infinity;

    if (floor0 == floor1) {
      return h0.title.localeCompare(h1.title);
    }

    return floor0 - floor1;
  });

  return (
    <PageBase
      onBack={onBack}
      onClose={onClose}
      subtitle={location.title}
      title={messages.households.page.header()}
    >
      {reportMany && selectedHouseholds.length > 0 && (
        <Box
          alignItems="center"
          bgcolor={theme.palette.background.paper}
          borderBottom="1px solid"
          borderColor="divider"
          boxShadow={1}
          display="flex"
          justifyContent="space-between"
          p={1}
          position="sticky"
          top={0}
          zIndex={1200}
        >
          <Box alignItems="center" display="flex" gap={0.5}>
            <Checkbox
              checked={selectedHouseholds.length == sortedHouseholds.length}
              indeterminate={
                selectedHouseholds.length > 0 &&
                selectedHouseholds.length < sortedHouseholds.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedHouseholds(sortedHouseholds.map((h) => h.id));
                } else {
                  setSelectedHouseholds([]);
                }
              }}
            />
            <Typography color="primary">
              {selectedHouseholds.length} households
            </Typography>
          </Box>

          <Button
            onClick={() => {
              onStartHouseholdsVisit(selectedHouseholds);
            }}
            variant="outlined"
          >
            <Typography color="primary">Report</Typography>
          </Button>
        </Box>
      )}
      <Box display="flex" flexDirection="column" flexGrow={2}>
        {location.num_known_households == 0 && (
          <Typography color="secondary" sx={{ fontStyle: 'italic' }}>
            <Msg id={messageIds.households.page.empty} />
          </Typography>
        )}
        <List sx={{ overflowY: 'visible' }}>
          {sortedHouseholds.map((household, index) => {
            const prevFloor = sortedHouseholds[index - 1]?.level ?? 0;
            const curFloor = household.level ?? 0;
            const firstOnFloor = index == 0 || curFloor != prevFloor;

            const mostRecentVisit = lastVisitByHouseholdId[household.id];

            return (
              <Box key={household.id}>
                {firstOnFloor && (
                  <ListSubheader>
                    {household.level
                      ? `Floor ${household.level}`
                      : 'Unknown floor'}
                  </ListSubheader>
                )}
                <Divider />
                <ListItem
                  alignItems="center"
                  onClick={() => {
                    onSelectHousehold(household.id);
                  }}
                  sx={{ px: 0 }}
                >
                  <Box alignItems="center" display="flex" flexGrow={1}>
                    <Checkbox
                      checked={selectedHouseholds.includes(household.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportMany(true);

                        const isSelected = selectedHouseholds.includes(
                          household.id
                        );

                        if (isSelected) {
                          setSelectedHouseholds(
                            selectedHouseholds.filter(
                              (id) => id != household.id
                            )
                          );
                        } else {
                          setSelectedHouseholds([
                            ...selectedHouseholds,
                            household.id,
                          ]);
                        }
                      }}
                      size="small"
                    />
                    <ListItemText>{household.title}</ListItemText>
                  </Box>
                  {mostRecentVisit && (
                    <Typography color="secondary">
                      <ZUIRelativeTime datetime={mostRecentVisit.created} />
                    </Typography>
                  )}
                  <KeyboardArrowRight />
                </ListItem>
              </Box>
            );
          })}
        </List>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={1}
          mt={2}
        >
          <Button
            disabled={adding}
            onClick={async () => {
              setAdding(true);

              // Since this button adds households to the unknown floor, we only count those households
              const householdsOnUnknownFloor = sortedHouseholds.filter(
                ({ level }) => level == null
              );
              const title = messages.households.householdDefaultTitle({
                householdNumber: householdsOnUnknownFloor.length + 1,
              });

              const newlyAddedHousehold = await addHousehold({
                level: 0,
                title,
              });
              setAdding(false);
              onCreateHousehold(newlyAddedHousehold);
            }}
            startIcon={
              adding ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                <Add />
              )
            }
            variant="outlined"
          >
            Add new household
          </Button>
          <Button onClick={onBulk} startIcon={<Apps />} variant="text">
            Create many
          </Button>
        </Box>
      </Box>
    </PageBase>
  );
};

export default HouseholdsPage;
