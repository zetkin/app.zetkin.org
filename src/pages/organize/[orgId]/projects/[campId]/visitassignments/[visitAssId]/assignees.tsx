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
import AssigneeConfigDialog from 'features/visitassignments/components/AssigneeConfigDialog';
import VisitAssignmentAssigneesList from 'features/visitassignments/components/VisitAssignmentAssigneesList';
import UserAutocomplete from 'features/user/components/UserAutocomplete';

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
  const { data: visitAssignment } = useVisitAssignment(orgId, visitAssId);
  const {
    addAssignee,
    filteredAssigneesFuture,
    removeAssignee,
    searchString,
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
            <Box marginTop={2}>
              <UserAutocomplete
                onSelect={(user) => {
                  if (user) {
                    addAssignee(user.id);
                  }
                }}
                orgId={orgId}
                placeholder={messages.map.areaInfo.assignees.add()}
              />
            </Box>
          </Box>
        </Paper>
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
