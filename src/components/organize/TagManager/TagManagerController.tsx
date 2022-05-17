import { Add } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { Box, Button, Popover, Typography } from '@material-ui/core';

import TagSelect from './components/TagSelect';
import TagsList from './components/TagsList';
import { EditTag, NewTag } from './types';
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

export interface TagManagerControllerProps {
  assignedTags: ZetkinTag[];
  availableGroups: ZetkinTagGroup[];
  availableTags: ZetkinTag[];
  groupTags?: boolean;
  onAssignTag: (tag: ZetkinTag) => void;
  onCreateTag: (tag: NewTag) => void;
  onEditTag: (tag: EditTag) => void;
  onUnassignTag: (tag: ZetkinTag) => void;
}

export const TagManagerController: React.FunctionComponent<
  TagManagerControllerProps
> = ({
  assignedTags,
  availableGroups,
  availableTags,
  groupTags = false,
  onAssignTag,
  onCreateTag,
  onEditTag,
  onUnassignTag,
}) => {
  const [addTagButton, setAddTagButton] = useState<HTMLElement | null>(null);

  return (
    <>
      {assignedTags.length > 0 ? (
        <TagsList
          isGrouped={groupTags}
          onUnassignTag={onUnassignTag}
          tags={assignedTags}
        />
      ) : (
        // If no tags
        <Typography>
          <FormattedMessage id="misc.tags.tagsManager.noTags" />
        </Typography>
      )}
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
    </>
  );
};

export default TagManagerController;
