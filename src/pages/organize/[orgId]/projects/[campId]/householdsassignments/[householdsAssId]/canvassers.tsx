import { Close } from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  Box,
  Fade,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { HOUSEHOLDS2 } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import HouseholdAssignmentLayout from 'features/householdsAssignments/layouts/HouseholdAssignmentLayout';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useHouseholdsAssignees from 'features/householdsAssignments/hooks/useHouseholdAssignees';
import useHouseholdAssignment from 'features/householdsAssignments/hooks/useHouseholdAssignment';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/householdsAssignments/l10n/messageIds';
import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';
import zuiMessageIds from 'zui/l10n/messageIds';
import AssigneeConfigDialog from 'features/householdsAssignments/components/AssigneeConfigDialog';
import HouseholdsAssignmentAssigneesList from 'features/householdsAssignments/components/HouseholdsAssignmentAssigneesList';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [HOUSEHOLDS2],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, householdsAssId } = ctx.params!;

  return {
    props: {
      assignmentId: householdsAssId,
      campId,
      orgId,
    },
  };
}, scaffoldOptions);

const AssigneesPage: PageWithLayout = () => {
  const { orgId, campId, householdsAssId } = useNumericRouteParams();
  const onServer = useServerSide();
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);
  const { data: householdsAssignment } = useHouseholdAssignment(
    campId,
    orgId,
    householdsAssId
  );
  const {
    addAssignee,
    filteredAssigneesFuture,
    isAssignee,
    removeAssignee,
    searchString,
    selectInputRef,
    selectedAssignee,
    setAssigneeTags,
    setSearchString,
    setSelectedAssignee,
  } = useHouseholdsAssignees(campId, orgId, householdsAssId);

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{householdsAssignment?.title}</title>
      </Head>
      <Box>
        <Paper>
          <Box p={2}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h4">
                <Msg id={messageIds.assignees.title} />
              </Typography>
              <TextField
                InputProps={{
                  endAdornment: (
                    <Fade in={searchString.length > 0}>
                      <IconButton onClick={() => setSearchString('')}>
                        <Close />
                      </IconButton>
                    </Fade>
                  ),
                }}
                onChange={(evt) => {
                  setSearchString(evt.target.value);
                }}
                placeholder={messages.assignees.searchBox()}
                value={searchString}
                variant="outlined"
              />
            </Box>
            <HouseholdsAssignmentAssigneesList
              assignees={filteredAssigneesFuture.data || []}
              onCustomize={(assignee) => setSelectedAssignee(assignee)}
              onRemove={(assignee) => removeAssignee(assignee.id)}
            />
          </Box>
        </Paper>
        <Box marginTop={2}>
          <MUIOnlyPersonSelect
            bulkSelection={{
              entityToAddTo: householdsAssignment?.title,
              onSelectMultiple: (ids) => {
                // TODO #2789: Optimize this, e.g. using RPC
                ids.forEach((id) => {
                  if (!isAssignee(id)) {
                    addAssignee(id);
                  }
                });
              },
            }}
            createPersonLabels={{
              submitLabel: zuiMessages.createPerson.submitLabel.add(),
              title: zuiMessages.createPerson.title.canvasser(),
            }}
            getOptionDisabled={(person) => isAssignee(person.id)}
            getOptionExtraLabel={(person) =>
              isAssignee(person.id) ? messages.assignees.add.alreadyAdded() : ''
            }
            inputRef={selectInputRef}
            onChange={(person) => {
              addAssignee(person.id);

              // Blur and re-focus input to reset, so that user can type again to
              // add another person, without taking their hands off the keyboard.
              selectInputRef?.current?.blur();
              selectInputRef?.current?.focus();
            }}
            placeholder={messages.assignees.add.placeholder()}
            selectedPerson={null}
          />
        </Box>
        <AssigneeConfigDialog
          assignee={selectedAssignee}
          onClose={() => setSelectedAssignee(null)}
          onSubmit={(prioTags, excludedTags) => {
            if (selectedAssignee) {
              setAssigneeTags(selectedAssignee.id, prioTags, excludedTags);
            }
            setSelectedAssignee(null);
          }}
          open={!!selectedAssignee}
        />
      </Box>
    </>
  );
};

AssigneesPage.getLayout = function getLayout(page) {
  return <HouseholdAssignmentLayout>{page}</HouseholdAssignmentLayout>;
};

export default AssigneesPage;
