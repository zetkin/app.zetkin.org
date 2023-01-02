import { Close } from '@material-ui/icons';
import { GetServerSideProps } from 'next';
import {
  Box,
  Fade,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useRef, useState } from 'react';

import { CallAssignmentCaller } from 'features/callAssignments/apiTypes';
import CallAssignmentCallersList from 'features/callAssignments/components/CallAssignmentCallersList';
import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import CallerConfigDialog from 'features/callAssignments/components/CallerConfigDialog';
import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import { ZetkinPerson } from 'utils/types/zetkin';

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
  const model = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );
  const intl = useIntl();
  const selectInputRef = useRef<HTMLInputElement>();
  const [selectedCaller, setSelectedCaller] =
    useState<CallAssignmentCaller | null>(null);

  useEffect(() => {
    setOnServer(false);
  }, []);

  if (onServer) {
    return null;
  }

  const future = model.getFilteredCallers(searchString);

  const isCaller = (person: ZetkinPerson) =>
    !!model.getFilteredCallers().data?.find((caller) => caller.id == person.id);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h4">
              <Msg id="pages.organizeCallAssignment.callers.title" />
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
              placeholder={intl.formatMessage({
                id: 'pages.organizeCallAssignment.callers.searchBox',
              })}
              value={searchString}
              variant="outlined"
            />
          </Box>
          <CallAssignmentCallersList
            callers={future.data || []}
            onCustomize={(caller) => setSelectedCaller(caller)}
            onRemove={(caller) => model.removeCaller(caller.id)}
          />
        </Box>
      </Paper>
      <Box marginTop={2}>
        <MUIOnlyPersonSelect
          getOptionDisabled={isCaller}
          getOptionExtraLabel={(person) =>
            isCaller(person)
              ? intl.formatMessage({
                  id: 'pages.organizeCallAssignment.callers.add.alreadyAdded',
                })
              : ''
          }
          inputRef={selectInputRef}
          onChange={(person) => {
            model.addCaller(person);

            // Blur and re-focus input to reset, so that user can type again to
            // add another person, without taking their hands off the keyboard.
            selectInputRef?.current?.blur();
            selectInputRef?.current?.focus();
          }}
          placeholder={intl.formatMessage({
            id: 'pages.organizeCallAssignment.callers.add.placeholder',
          })}
          selectedPerson={null}
        />
      </Box>
      <CallerConfigDialog
        caller={selectedCaller}
        onClose={() => setSelectedCaller(null)}
        onSubmit={(prioTags, excludedTags) => {
          if (selectedCaller) {
            model.setCallerTags(selectedCaller.id, prioTags, excludedTags);
          }
          setSelectedCaller(null);
        }}
        open={!!selectedCaller}
      />
    </Box>
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
