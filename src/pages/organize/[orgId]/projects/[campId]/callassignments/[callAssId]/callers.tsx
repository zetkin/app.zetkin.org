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
import { useEffect, useRef, useState } from 'react';

import { CallAssignmentCaller } from 'features/callAssignments/apiTypes';
import CallAssignmentCallersList from 'features/callAssignments/components/CallAssignmentCallersList';
import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallerConfigDialog from 'features/callAssignments/components/CallerConfigDialog';
import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { ZetkinPerson } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/callAssignments/l10n/messageIds';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';
import useCallers from 'features/callAssignments/hooks/useCallers';

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

interface CallersPageProps {
  assignmentId: string;
  campId: string;
  orgId: string;
}

const CallersPage: PageWithLayout<CallersPageProps> = ({
  orgId,
  assignmentId,
}) => {
  const [onServer, setOnServer] = useState(true);
  const [searchString, setSearchString] = useState('');
  const isSearching = searchString.length > 0;
  const messages = useMessages(messageIds);
  const selectInputRef = useRef<HTMLInputElement>();
  const [selectedCaller, setSelectedCaller] =
    useState<CallAssignmentCaller | null>(null);
  const { title } = useCallAssignment(parseInt(orgId), parseInt(assignmentId));
  const {
    addCaller,
    data: callers,
    removeCaller,
    setCallerTags,
  } = useCallers(parseInt(orgId), parseInt(assignmentId));

  useEffect(() => {
    setOnServer(false);
  }, []);

  if (onServer) {
    return null;
  }

  const isCaller = (person: ZetkinPerson) =>
    !!callers?.find((caller) => caller.id == person.id);

  return (
    <>
      <Head>
        <title>{title}</title>
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
                    <Fade in={isSearching}>
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
              callers={callers || []}
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

CallersPage.getLayout = function getLayout(page, props) {
  return (
    <CallAssignmentLayout
      assignmentId={props.assignmentId}
      campaignId={props.campId}
      orgId={props.orgId}
    >
      {page}
    </CallAssignmentLayout>
  );
};

export default CallersPage;
