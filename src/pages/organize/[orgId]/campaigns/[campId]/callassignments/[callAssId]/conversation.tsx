import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import { PageWithLayout } from 'utils/types';

import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ZUITextEditor from 'zui/ZUITextEditor';

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

interface ConversationPageProps {
  assignmentId: string;
  campId: string;
  orgId: string;
}

const ConversationPage: PageWithLayout<ConversationPageProps> = ({
  assignmentId,
  orgId,
}) => {
  const model = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );
  const future = model.getData();

  const [instructions, setInstructions] = useState(
    future.data?.instructions || ''
  );

  const onChange = (markdown: string) => {
    setInstructions(markdown);
  };

  return (
    <Paper>
      <Box padding={2}>
        <Typography variant="h4">Caller instructions</Typography>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            model.setCallerInstructions(instructions);
          }}
        >
          <Box marginBottom={2} marginTop={4}>
            <ZUITextEditor
              initialValue={future.data?.instructions}
              onChange={onChange}
              placeholder={'Add instructions for your callers'}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button color="primary" type="submit" variant="contained">
              <Msg id="misc.formDialog.submit" />
            </Button>
          </Box>
        </form>
      </Box>
    </Paper>
  );
};

ConversationPage.getLayout = function getLayout(page, props) {
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

export default ConversationPage;
