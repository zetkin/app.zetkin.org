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

import CallAssignmentCallersList from 'features/callAssignments/components/CallAssignmentCallersList';
import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallerConfigDialog from 'features/callAssignments/components/CallerConfigDialog';
import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/callAssignments/l10n/messageIds';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';
import useCallers from 'features/callAssignments/hooks/useCallers';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import zuiMessageIds from 'zui/l10n/messageIds';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;

    return {
      props: {
        assignmentId: callAssId,
        campId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: [
      'misc.breadcrumbs',
      'layout.organize.callAssignment',
      'pages.organizeCallAssignment',
    ],
  }
);

const CallersPage: PageWithLayout = () => {
  const { orgId, callAssId } = useNumericRouteParams();
  const onServer = useServerSide();
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);
  const { data: callAssignment } = useCallAssignment(orgId, callAssId);
  const {
    addCaller,
    filteredCallersFuture,
    isCaller,
    removeCaller,
    searchString,
    selectInputRef,
    selectedCaller,
    setCallerTags,
    setSearchString,
    setSelectedCaller,
  } = useCallers(orgId, callAssId);

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{callAssignment?.title}</title>
      </Head>
      <Box>
        <Paper>
          <Box p={2}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h4">
                <Msg id={messageIds.callers.title} />
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
                placeholder={messages.callers.searchBox()}
                value={searchString}
                variant="outlined"
              />
            </Box>
            <CallAssignmentCallersList
              callers={filteredCallersFuture.data || []}
              onCustomize={(caller) => setSelectedCaller(caller)}
              onRemove={(caller) => removeCaller(caller.id)}
            />
          </Box>
        </Paper>
        <Box marginTop={2}>
          <MUIOnlyPersonSelect
            getOptionDisabled={isCaller}
            getOptionExtraLabel={(person) =>
              isCaller(person) ? messages.callers.add.alreadyAdded() : ''
            }
            inputRef={selectInputRef}
            onChange={(person) => {
              addCaller(person.id);

              // Blur and re-focus input to reset, so that user can type again to
              // add another person, without taking their hands off the keyboard.
              selectInputRef?.current?.blur();
              selectInputRef?.current?.focus();
            }}
            placeholder={messages.callers.add.placeholder()}
            selectedPerson={null}
            submitLabel={zuiMessages.createPerson.submitLabel.add()}
            title={zuiMessages.createPerson.title.caller()}
          />
        </Box>
        <CallerConfigDialog
          caller={selectedCaller}
          onClose={() => setSelectedCaller(null)}
          onSubmit={(prioTags, excludedTags) => {
            if (selectedCaller) {
              setCallerTags(selectedCaller.id, prioTags, excludedTags);
            }
            setSelectedCaller(null);
          }}
          open={!!selectedCaller}
        />
      </Box>
    </>
  );
};

CallersPage.getLayout = function getLayout(page) {
  return <CallAssignmentLayout>{page}</CallAssignmentLayout>;
};

export default CallersPage;
