import ArchiveIcon from '@material-ui/icons/Archive';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { useContext, useState } from 'react';

import { journeyInstanceResource } from 'api/journeys';
import SnackbarContext from 'hooks/SnackbarContext';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagManager from 'components/organize/TagManager';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinJourneyInstance, ZetkinTag } from 'types/zetkin';

const JourneyCloseButton: React.FunctionComponent<{
  journeyInstance: ZetkinJourneyInstance;
}> = ({ journeyInstance }) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;

  const [showDialog, setShowDialog] = useState(false);
  const { useUpdate } = journeyInstanceResource(
    orgId as string,
    journeyInstance.id.toString()
  );
  const journeyInstanceMutation = useUpdate();

  const [closingNote, setClosingNote] = useState('');
  const [internalTags, setInternalTags] = useState<ZetkinTag[]>([]);

  const closeAndClear = () => {
    setShowDialog(false);
    setInternalTags([]);
    setClosingNote('');
  };

  const onSubmit = () => {
    const body = {
      closed: dayjs().toJSON(),
      outcome: closingNote,
    };

    journeyInstanceMutation.mutate(body, {});
  };

  return (
    <>
      <Button
        color="primary"
        onClick={() => setShowDialog(true)}
        startIcon={<ArchiveIcon />}
        variant="contained"
      >
        <FormattedMessage
          id="misc.journeys.closeJourneyInstanceButton.label"
          values={{ singularLabel: journeyInstance.journey.title }}
        />
      </Button>
      <ZetkinDialog onClose={closeAndClear} open={showDialog}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Typography variant="h6">
            <FormattedMessage id="misc.journeys.closeJourneyInstanceButton.dialog.outcomeLabel" />
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            multiline
            onChange={(e) => setClosingNote(e.target.value)}
            placeholder={intl.formatMessage(
              {
                id: 'misc.journeys.closeJourneyInstanceButton.dialog.outcomeFieldPlaceholder',
              },
              { singularLabel: journeyInstance.journey.title }
            )}
            rows={3}
            variant="outlined"
          />
          <Box mt={2}>
            <Typography variant="h6">
              <FormattedMessage id="misc.journeys.closeJourneyInstanceButton.dialog.outcomeTagsLabel" />
            </Typography>
            <Box mb={3} mt={1}>
              <Typography variant="body2">
                <FormattedMessage id="misc.journeys.closeJourneyInstanceButton.dialog.outcomeTagsDescription" />
              </Typography>
            </Box>
            <Box>
              <Box mt={3}>
                <TagManager
                  assignedTags={internalTags}
                  disabledTags={journeyInstance.tags.concat(internalTags)}
                  onAssignTag={(tag) => setInternalTags([...internalTags, tag])}
                  onTagEdited={(tag) => tag}
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
          <SubmitCancelButtons
            onCancel={closeAndClear}
            submitText={intl.formatMessage(
              {
                id: 'misc.journeys.closeJourneyInstanceButton.label',
              },
              { singularLabel: journeyInstance.journey.title }
            )}
          />
        </form>
      </ZetkinDialog>
    </>
  );
};

export default JourneyCloseButton;

export const JourneyInstanceReopenButton: React.FunctionComponent<{
  journeyInstance: ZetkinJourneyInstance;
}> = ({ journeyInstance }) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;
  const { showSnackbar } = useContext(SnackbarContext);

  const { useUpdate } = journeyInstanceResource(
    orgId as string,
    journeyInstance.id.toString()
  );
  const journeyInstanceMutation = useUpdate();

  return (
    <Button
      color="secondary"
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
                    singularLabel: journeyInstance.journey.title,
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
        values={{ singularLabel: journeyInstance.journey.title }}
      />
    </Button>
  );
};
