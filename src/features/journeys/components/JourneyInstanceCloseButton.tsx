import ArchiveIcon from '@mui/icons-material/Archive';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useContext, useState } from 'react';

import { journeyInstanceResource } from 'features/journeys/api/journeys';
import TagManager from 'features/tags/components/TagManager';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import { ZetkinJourneyInstance, ZetkinTag } from 'utils/types/zetkin';

const JourneyInstanceCloseButton: React.FunctionComponent<{
  journeyInstance: ZetkinJourneyInstance;
}> = ({ journeyInstance }) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;

  const { showSnackbar } = useContext(ZUISnackbarContext);
  const [showDialog, setShowDialog] = useState(false);

  const { useClose } = journeyInstanceResource(
    orgId as string,
    journeyInstance.id.toString()
  );
  const closeJourneyInstanceMutation = useClose();

  const [outcomeNote, setOutcomeNote] = useState('');
  const [internalTags, setInternalTags] = useState<ZetkinTag[]>([]);

  const closeAndClear = () => {
    setShowDialog(false);
    setInternalTags([]);
    setOutcomeNote('');
  };

  const onSubmit = () => {
    const body = {
      closed: dayjs().toJSON(),
      outcome: outcomeNote,
      tags: internalTags,
    };

    closeJourneyInstanceMutation.mutate(body, {
      onError: () =>
        showSnackbar(
          'error',
          intl.formatMessage(
            { id: 'misc.journeys.journeyInstanceCloseButton.error' },
            { singularLabel: journeyInstance.journey.singular_label }
          )
        ),
      onSuccess: () => closeAndClear(),
    });
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
        <FormattedMessage
          id="misc.journeys.journeyInstanceCloseButton.label"
          values={{ singularLabel: journeyInstance.journey.singular_label }}
        />
      </Button>
      <ZUIDialog onClose={closeAndClear} open={showDialog}>
        <Box data-testid="JourneyInstanceCloseButton-outcomeDialog">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSubmit();
            }}
          >
            <Typography variant="h6">
              <FormattedMessage id="misc.journeys.journeyInstanceCloseButton.dialog.outcomeLabel" />
            </Typography>
            <TextField
              fullWidth
              inputProps={{
                'data-testid': 'JourneyInstanceCloseButton-outcomeNoteField',
              }}
              margin="normal"
              multiline
              onChange={(e) => setOutcomeNote(e.target.value)}
              placeholder={intl.formatMessage(
                {
                  id: 'misc.journeys.journeyInstanceCloseButton.dialog.outcomeFieldPlaceholder',
                },
                { singularLabel: journeyInstance.journey.singular_label }
              )}
              rows={3}
              variant="outlined"
            />
            <Box mt={2}>
              <Typography variant="h6">
                <FormattedMessage id="misc.journeys.journeyInstanceCloseButton.dialog.outcomeTagsLabel" />
              </Typography>
              <Box mb={3} mt={1}>
                <Typography variant="body2">
                  <FormattedMessage id="misc.journeys.journeyInstanceCloseButton.dialog.outcomeTagsDescription" />
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
              submitDisabled={closeJourneyInstanceMutation.isLoading}
              submitText={intl.formatMessage(
                {
                  id: 'misc.journeys.journeyInstanceCloseButton.label',
                },
                { singularLabel: journeyInstance.journey.singular_label }
              )}
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
  const intl = useIntl();
  const { orgId } = useRouter().query;
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const { useUpdate } = journeyInstanceResource(
    orgId as string,
    journeyInstance.id.toString()
  );
  const journeyInstanceMutation = useUpdate();

  return (
    <Button
      color="secondary"
      data-testid="JourneyInstanceReopenButton"
      onClick={() =>
        journeyInstanceMutation.mutate(
          { closed: null },
          {
            onError: () =>
              showSnackbar(
                'error',
                intl.formatMessage(
                  {
                    id: 'misc.journeys.journeyInstanceReopenButton.error',
                  },
                  {
                    singularLabel: journeyInstance.journey.singular_label,
                  }
                )
              ),
          }
        )
      }
      startIcon={<ArchiveIcon />}
      variant="contained"
    >
      <FormattedMessage
        id="misc.journeys.journeyInstanceReopenButton.label"
        values={{ singularLabel: journeyInstance.journey.singular_label }}
      />
    </Button>
  );
};
