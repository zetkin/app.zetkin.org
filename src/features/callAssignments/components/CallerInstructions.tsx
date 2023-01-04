import { Link } from '@material-ui/core';
import { Box, Button, Paper, Typography } from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useState } from 'react';

import CallerInstructionsModel from '../models/CallerInstructionsModel';
import useModel from 'core/useModel';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUITextEditor from 'zui/ZUITextEditor';

interface CallerInstructionsProps {
  assignmentId: number;
  orgId: number;
}

const CallerInstructions = ({
  assignmentId,
  orgId,
}: CallerInstructionsProps) => {
  const intl = useIntl();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const model = useModel(
    (store) => new CallerInstructionsModel(store, orgId, assignmentId)
  );

  const onChange = (markdown: string) => {
    model.setInstructions(markdown);
  };

  const [key, setKey] = useState(1);
  return (
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
  );
};

export default CallerInstructions;
