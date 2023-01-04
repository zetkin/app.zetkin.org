import { GetServerSideProps } from 'next';
import { Link } from '@material-ui/core';
import { Box, Button, Grid, Paper, Switch, Typography } from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
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

  const callAssignmentModel = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );

  const onChange = (markdown: string) => {
    model.setInstructions(markdown);
  };

  const [key, setKey] = useState(1);

  return (
    <Grid container spacing={2}>
      <Grid item lg={8} md={6} sm={12}>
        <Paper>
          <Box padding={2}>
            <Typography variant="h4">
              <Msg id="pages.organizeCallAssignment.conversation.instructions.title" />
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
                    id: 'pages.organizeCallAssignment.conversation.instructions.editorPlaceholder',
                  })}
                />
              </Box>
              <Box alignItems="center" display="flex" justifyContent="flex-end">
                <Box marginRight={2}>
                  {!model.isSaving && !model.hasUnsavedChanges && (
                    <Typography>
                      <Msg id="pages.organizeCallAssignment.conversation.instructions.savedMessage" />
                    </Typography>
                  )}
                  {!model.isSaving && model.hasUnsavedChanges && (
                    <Typography component="span">
                      <Msg id="pages.organizeCallAssignment.conversation.instructions.unsavedMessage" />{' '}
                      <Link
                        color="textPrimary"
                        component="span"
                        onClick={() => {
                          showConfirmDialog({
                            onSubmit: () => {
                              model.revert();
                              //Force Slate to re-mount
                              setKey((current) => current + 1);
                            },
                            warningText: intl.formatMessage({
                              id: 'pages.organizeCallAssignment.conversation.instructions.unsavedMessage',
                            }),
                          });
                        }}
                        style={{ cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <Msg id="pages.organizeCallAssignment.conversation.instructions.revertLink" />
                      </Link>
                    </Typography>
                  )}
                </Box>
                <Button
                  color="primary"
                  disabled={!model.hasUnsavedChanges}
                  type="submit"
                  variant="contained"
                >
                  {model.isSaving ? (
                    <Msg id="pages.organizeCallAssignment.conversation.instructions.savingButton" />
                  ) : (
                    <Msg id="pages.organizeCallAssignment.conversation.instructions.saveButton" />
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <Paper>
          <Box padding={2}>
            <Typography variant="h4">
              <Msg id="pages.organizeCallAssignment.conversation.settings.title" />
            </Typography>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              marginTop={2}
            >
              <Typography variant="h6">
                <Msg id="pages.organizeCallAssignment.conversation.settings.notes.title" />
              </Typography>
              <Switch
                onChange={(evt) =>
                  callAssignmentModel.setCallerNotes(evt.target.checked)
                }
              />
            </Box>
            <Typography>
              <Msg id="pages.organizeCallAssignment.conversation.settings.notes.message" />
            </Typography>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              marginTop={1}
            >
              <Typography variant="h6">
                <Msg id="pages.organizeCallAssignment.conversation.settings.targetData.title" />
                a
              </Typography>
              <Switch
                onChange={(evt) =>
                  callAssignmentModel.setCallerAccess(evt.target.checked)
                }
              />
            </Box>
            <Typography>
              <Msg id="pages.organizeCallAssignment.conversation.settings.targetData.message" />
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
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
