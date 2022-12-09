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
import { useEffect, useState } from 'react';

import CallAssignmentCallersList from 'features/callAssignments/components/CallAssignmentCallersList';
import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';

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

  useEffect(() => {
    setOnServer(false);
  }, []);

  if (onServer) {
    return null;
  }

  const future = model.getFilteredCallers(searchString);

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
          <CallAssignmentCallersList callers={future.data || []} />
        </Box>
      </Paper>
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
