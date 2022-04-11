import { Add } from '@material-ui/icons';
import { Box, Button, Popover, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { useContext, useState } from 'react';

import ZetkinSection from 'components/ZetkinSection';

import GroupToggle from './GroupToggle';
import TagSelect from './TagSelect';
import TagsList from './TagsList';
import TagsManagerContext from './TagsManagerContext';

const TagsManager: React.FunctionComponent = () => {
  const intl = useIntl();

  const [addTagButton, setAddTagButton] = useState<HTMLElement | null>(null);
  const [isGrouped, setIsGrouped] = useState(false);

  const { assignedTags, onUnassignTag } = useContext(TagsManagerContext);

  return (
    <ZetkinSection
      action={
        <GroupToggle
          checked={isGrouped}
          onChange={() => setIsGrouped(!isGrouped)}
        />
      }
      title={intl.formatMessage({ id: 'misc.tags.tagsManager.title' })}
    >
      <Box>
        {assignedTags.length > 0 ? (
          <TagsList
            isGrouped={isGrouped}
            onUnassignTag={onUnassignTag}
            tags={assignedTags}
          />
        ) : (
          // If no tags
          <Typography>
            <FormattedMessage id="misc.tags.tagsManager.noTags" />
          </Typography>
        )}
      </Box>
      <Box mt={2}>
        <Button
          color="primary"
          onClick={(event) => setAddTagButton(event.currentTarget)}
          startIcon={<Add />}
        >
          <FormattedMessage id="misc.tags.tagsManager.addTag" />
        </Button>
        <Popover
          anchorEl={addTagButton}
          onClose={() => setAddTagButton(null)}
          open={Boolean(addTagButton)}
        >
          <TagSelect />
        </Popover>
      </Box>
    </ZetkinSection>
  );
};

export default TagsManager;
