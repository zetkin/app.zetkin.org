import { GetServerSideProps } from 'next';
import { Link } from '@material-ui/core';
import { Box, Button, Paper, Typography } from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallerInstructionsModel from 'features/callAssignments/models/CallerInstructionsModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
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
  const intl = useIntl();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const model = useModel(
    (store) =>
      new CallerInstructionsModel(
        store,
        parseInt(orgId),
        parseInt(assignmentId)
      )
  );

  const onChange = (markdown: string) => {
    model.setInstructions(markdown);
  };

  const [key, setKey] = useState(1);

  return (
    <Paper>
      <Box padding={2}>
        <Typography variant="h4">
          <Msg id="pages.organizeCallAssignment.conversation.title" />
        </Typography>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            model.save();
          }}
        >
          <Box marginBottom={2} marginTop={4}>
            <ZUITextEditor
              key={key}
              initialValue={model.getInstructions()}
              onChange={onChange}
              placeholder={intl.formatMessage({
                id: 'pages.organizeCallAssignment.conversation.editorPlaceholder',
              })}
            />
          </Box>
          <Box alignItems="center" display="flex" justifyContent="flex-end">
            <Box marginRight={2}>
              {!model.isSaving && !model.hasUnsavedChanges && (
                <Typography>
                  <Msg id="pages.organizeCallAssignment.conversation.savedMessage" />
                </Typography>
              )}
              {!model.isSaving && model.hasUnsavedChanges && (
                <Box display="flex">
                  <Typography>
                    <Msg id="pages.organizeCallAssignment.conversation.unsavedMessage" />
                  </Typography>
                  <Link
                    color="textPrimary"
                    component={Typography}
                    onClick={() => {
                      showConfirmDialog({
                        onSubmit: () => {
                          model.revert();
                          //Force Slate to re-mount
                          setKey((current) => current + 1);
                        },
                        warningText: intl.formatMessage({
                          id: 'pages.organizeCallAssignment.conversation.confirm',
                        }),
                      });
                    }}
                    sx={{
                      cursor: 'pointer',
                      paddingLeft: 0.5,
                    }}
                  >
                    <Msg id="pages.organizeCallAssignment.conversation.revertLink" />
                  </Link>
                </Box>
              )}
            </Box>
            <Button
              color="primary"
              disabled={!model.hasUnsavedChanges}
              type="submit"
              variant="contained"
            >
              {model.isSaving ? (
                <Msg id="pages.organizeCallAssignment.conversation.savingButton" />
              ) : (
                <Msg id="pages.organizeCallAssignment.conversation.saveButton" />
              )}
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
