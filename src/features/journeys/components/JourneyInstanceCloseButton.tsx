import ArchiveIcon from '@mui/icons-material/Archive';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import TagManager from 'features/tags/components/TagManager';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinAppliedTag, ZetkinJourneyInstance } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import useJourneyInstanceMutations from '../hooks/useJourneyInstanceMutations';
import { useNumericRouteParams } from 'core/hooks';

const JourneyInstanceCloseButton: React.FunctionComponent<{
  journeyInstance: ZetkinJourneyInstance;
}> = ({ journeyInstance }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { closeJourneyInstance } = useJourneyInstanceMutations(
    orgId,
    journeyInstance.id
  );

  const [outcomeNote, setOutcomeNote] = useState('');
  const [internalTags, setInternalTags] = useState<ZetkinAppliedTag[]>([]);

  const closeAndClear = () => {
    setShowDialog(false);
    setInternalTags([]);
    setOutcomeNote('');
  };

  return (
    <>
      <Button
        color="primary"
        data-testid="JourneyInstanceCloseButton"
        onClick={() => setShowDialog(true)}
        startIcon={<ArchiveIcon />}
        variant="contained"
      >
        <Msg
          id={messageIds.instance.closeButton.label}
          values={{ singularLabel: journeyInstance.journey.singular_label }}
        />
      </Button>
      <ZUIDialog onClose={closeAndClear} open={showDialog}>
        <Box data-testid="JourneyInstanceCloseButton-outcomeDialog">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLoading(true);
              await closeJourneyInstance({
                closed: dayjs().toJSON(),
                outcome: outcomeNote,
                tags: internalTags,
              });
              setIsLoading(false);
              closeAndClear();
            }}
          >
            <Typography variant="h6">
              <Msg id={messageIds.instance.closeButton.dialog.outcomeLabel} />
            </Typography>
            <TextField
              fullWidth
              inputProps={{
                'data-testid': 'JourneyInstanceCloseButton-outcomeNoteField',
              }}
              margin="normal"
              multiline
              onChange={(e) => setOutcomeNote(e.target.value)}
              placeholder={messages.instance.closeButton.dialog.outcomeFieldPlaceholder(
                { singularLabel: journeyInstance.journey.singular_label }
              )}
              rows={3}
              variant="outlined"
            />
            <Box mt={2}>
              <Typography variant="h6">
                <Msg
                  id={messageIds.instance.closeButton.dialog.outcomeTagsLabel}
                />
              </Typography>
              <Box mb={3} mt={1}>
                <Typography variant="body2">
                  <Msg
                    id={
                      messageIds.instance.closeButton.dialog
                        .outcomeTagsDescription
                    }
                  />
                </Typography>
              </Box>
              <Box>
                <Box mt={3}>
                  <TagManager
                    assignedTags={internalTags}
                    disabledTags={journeyInstance.tags.concat(internalTags)}
                    disableEditTags
                    onAssignTag={(tag) =>
                      setInternalTags([...internalTags, tag])
                    }
                    onUnassignTag={(tag) =>
                      setInternalTags(
                        internalTags.filter(
                          (existingTag) => tag.id !== existingTag.id
                        )
                      )
                    }
                  />
                </Box>
              </Box>
            </Box>
            <ZUISubmitCancelButtons
              onCancel={closeAndClear}
              submitDisabled={isLoading}
              submitText={messages.instance.closeButton.label({
                singularLabel: journeyInstance.journey.singular_label,
              })}
            />
          </form>
        </Box>
      </ZUIDialog>
    </>
  );
};

export default JourneyInstanceCloseButton;

export const JourneyInstanceReopenButton: React.FunctionComponent<{
  journeyInstance: ZetkinJourneyInstance;
}> = ({ journeyInstance }) => {
  const { orgId } = useNumericRouteParams();
  const { updateJourneyInstance } = useJourneyInstanceMutations(
    orgId,
    journeyInstance.id
  );

  return (
    <Button
      color="secondary"
      data-testid="JourneyInstanceReopenButton"
      onClick={() => updateJourneyInstance({ closed: null })}
      startIcon={<ArchiveIcon />}
      variant="contained"
    >
      <Msg
        id={messageIds.instance.reopenButton.label}
        values={{ singularLabel: journeyInstance.journey.singular_label }}
      />
    </Button>
  );
};
