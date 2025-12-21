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

import { VISITS } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import VisitAssignmentLayout from 'features/visitassignments/layouts/VisitAssignmentLayout';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useVisitAssignees from 'features/visitassignments/hooks/useVisitAssignees';
import useVisitAssignment from 'features/visitassignments/hooks/useVisitAssignment';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/visitassignments/l10n/messageIds';
import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';
import zuiMessageIds from 'zui/l10n/messageIds';
import AssigneeConfigDialog from 'features/visitassignments/components/AssigneeConfigDialog';
import VisitAssignmentAssigneesList from 'features/visitassignments/components/VisitAssignmentAssigneesList';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [VISITS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, visitAssId } = ctx.params!;

  return {
    props: {
      assignmentId: visitAssId,
      campId,
      orgId,
    },
  };
}, scaffoldOptions);

const AssigneesPage: PageWithLayout = () => {
  const { orgId, visitAssId } = useNumericRouteParams();
  const onServer = useServerSide();
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);
  const { data: visitAssignment } = useVisitAssignment(orgId, visitAssId);
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
  } = useVisitAssignees(orgId, visitAssId);

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{visitAssignment?.title}</title>
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
            <VisitAssignmentAssigneesList
              assignees={filteredAssigneesFuture.data || []}
              onCustomize={(assignee) => setSelectedAssignee(assignee)}
              onRemove={(assignee) => removeAssignee(assignee.id)}
            />
          </Box>
        </Paper>
        <Box marginTop={2}>
          <MUIOnlyPersonSelect
            bulkSelection={{
              entityToAddTo: visitAssignment?.title || undefined,
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
  return <VisitAssignmentLayout>{page}</VisitAssignmentLayout>;
};

export default AssigneesPage;
