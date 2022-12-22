import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import CallerInstructionsModel from 'features/callAssignments/models/CallerInstructionsModel';
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
  const callAssignmentModel = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );
  const callerInstructionsModel = useModel(
    (store) =>
      new CallerInstructionsModel(
        store,
        parseInt(orgId),
        parseInt(assignmentId)
      )
  );

  const caFuture = callAssignmentModel.getData();
  const savedInstructions = caFuture.data?.instructions;
  const localInstructions = callerInstructionsModel.getInstructions();

  const [instructions, setInstructions] = useState(
    localInstructions || savedInstructions || ''
  );

  const [hasChanges, setHasChanges] = useState(
    localInstructions != savedInstructions ? true : false
  );

  const onChange = (markdown: string) => {
    setInstructions(markdown);
    callerInstructionsModel.setInstructions(markdown);
    setHasChanges(instructions != savedInstructions ? true : false);
  };

  //Jag tror att detta, klippt från TimelineAddNote gör nåt som behövs även här
  /**
   * 
   *  // Markdown string is truthy even if the visible text box is empty
  const visibleText = note?.text
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\r?\n|\r/g, '');
   */

  return (
    <Paper>
      <Box padding={2}>
        <Typography variant="h4">Caller instructions</Typography>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            callerInstructionsModel.save();
          }}
        >
          <Box marginBottom={2} marginTop={4}>
            <ZUITextEditor
              initialValue={instructions}
              onChange={onChange}
              placeholder="Add instructions for your callers"
            />
          </Box>
          <Box alignItems="center" display="flex" justifyContent="flex-end">
            <Box marginRight={2}>
              <Typography>Message</Typography>
            </Box>
            <Button
              color="primary"
              disabled={!hasChanges}
              type="submit"
              variant="contained"
            >
              save
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
