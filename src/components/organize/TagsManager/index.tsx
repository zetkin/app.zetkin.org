import { Add } from '@material-ui/icons';
import { useState } from 'react';
import { Box, Button, Popover, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import ZetkinSection from 'components/ZetkinSection';

import GroupToggle from './GroupToggle';
import TagSelect from './TagSelect';
import TagsList from './TagsList';
import { EditTag, NewTag } from './types';
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

const TagsManager: React.FunctionComponent<{
  assignedTags: ZetkinTag[];
  availableGroups: ZetkinTagGroup[];
  availableTags: ZetkinTag[];
  onAssignTag: (tag: ZetkinTag) => void;
  onCreateTag: (tag: NewTag) => void;
  onEditTag: (tag: EditTag) => void;
  onUnassignTag: (tag: ZetkinTag) => void;
}> = ({
  assignedTags,
  availableGroups,
  availableTags,
  onAssignTag,
  onCreateTag,
  onEditTag,
  onUnassignTag,
}) => {
  const intl = useIntl();

  const [addTagButton, setAddTagButton] = useState<HTMLElement | null>(null);
  const [isGrouped, setIsGrouped] = useState(false);

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
          <TagSelect
            disabledTags={assignedTags}
            groups={availableGroups}
            onCreateTag={onCreateTag}
            onEditTag={onEditTag}
            onSelect={onAssignTag}
            tags={availableTags}
          />
        </Popover>
      </Box>
    </ZetkinSection>
  );
};

export default TagsManager;
