import { Add } from '@material-ui/icons';
import ArchiveIcon from '@material-ui/icons/Archive';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Button, Popover, TextField, Typography } from '@material-ui/core';

import { journeyInstanceResource } from 'api/journeys';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagSelect from 'components/organize/TagsManager/TagSelect';
import TagsList from 'components/organize/TagsManager/TagsList';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinJourneyInstance } from 'types/zetkin';
import { tagGroupsResource, tagsResource } from 'api/tags';

const CloseJourneyButton: React.FunctionComponent<{
  journeyInstance: ZetkinJourneyInstance;
}> = ({ journeyInstance }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [addTagButton, setAddTagButton] = useState<HTMLElement | null>(null);

  const { orgId } = useRouter().query;

  const { useAssignTag, useUpdate, useUnassignTag } = journeyInstanceResource(
    orgId as string,
    journeyInstance.id.toString()
  );

  const journeyInstanceMutation = useUpdate();
  const assignTagMutation = useAssignTag();
  const unassignTagMutation = useUnassignTag();

  const { data: groups } = tagGroupsResource(orgId as string).useQuery();
  const { data: tags } = tagsResource(orgId as string).useQuery();

  const [closingNote, setClosingNote] = useState('');

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
        variant="contained"
      >
        <Box align-items="center" display="flex" mr={1}>
          <ArchiveIcon />
        </Box>
        Close {journeyInstance.journey.title}
      </Button>
      <ZetkinDialog onClose={() => setShowDialog(false)} open={showDialog}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Typography variant="h6">Outcome</Typography>
          <TextField
            fullWidth
            margin="normal"
            multiline
            onChange={(e) => setClosingNote(e.target.value)}
            placeholder="Describe the outcome of the case"
            rows={3}
            variant="outlined"
          />
          <Box mt={2}>
            <Typography variant="h6">Outcome Tags</Typography>
            <Box mb={3} mt={1}>
              <Typography variant="body2">
                Add any tags that describe the outcome
              </Typography>
            </Box>
            <Box>
              <Box mt={3}>
                <TagsList
                  isGrouped={false}
                  onUnassignTag={(tag) => unassignTagMutation.mutate(tag.id)}
                  tags={journeyInstance.tags}
                />
                <Box mt={2}>
                  <Button
                    color="primary"
                    onClick={(event) => setAddTagButton(event.currentTarget)}
                    startIcon={<Add />}
                  >
                    <FormattedMessage id="misc.tags.tagsManager.addTag" />
                  </Button>
                </Box>
                <Popover
                  anchorEl={addTagButton}
                  onClose={() => setAddTagButton(null)}
                  open={Boolean(addTagButton)}
                >
                  <TagSelect
                    disabledTags={journeyInstance.tags}
                    groups={groups || []}
                    onSelect={(tag) => assignTagMutation.mutate(tag.id)}
                    tags={tags || []}
                  />
                </Popover>
              </Box>
            </Box>
          </Box>
          <SubmitCancelButtons
            onCancel={() => setShowDialog(false)}
            submitText={`Close ${journeyInstance.journey.title}`}
          />
        </form>
      </ZetkinDialog>
    </>
  );
};

export default CloseJourneyButton;
