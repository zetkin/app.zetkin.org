import { Add } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { Box, Button, Popover } from '@material-ui/core';

import TagSelect from './components/TagSelect';
import TagsList from './components/TagsList';
import { EditTag, NewTag } from './types';
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

export interface TagManagerControllerProps {
  assignedTags: ZetkinTag[];
  availableGroups: ZetkinTagGroup[];
  availableTags: ZetkinTag[];
  disableEditTags?: boolean;
  disabledTags?: ZetkinTag[];
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
  disableEditTags,
  disabledTags,
  groupTags = false,
  onAssignTag,
  onCreateTag,
  onEditTag,
  onUnassignTag,
}) => {
  const [addTagButton, setAddTagButton] = useState<HTMLElement | null>(null);

  return (
    <>
      <TagsList
        isGrouped={groupTags}
        onUnassignTag={onUnassignTag}
        tags={assignedTags}
      />
      <Box mt={assignedTags.length > 0 ? 2 : 0}>
        <Button
          color="primary"
          onClick={(event) => setAddTagButton(event.currentTarget)}
          startIcon={<Add />}
        >
          <FormattedMessage id="misc.tags.tagManager.addTag" />
        </Button>
        <Popover
          anchorEl={addTagButton}
          onClose={() => setAddTagButton(null)}
          open={Boolean(addTagButton)}
        >
          <TagSelect
            disabledTags={disabledTags || assignedTags}
            disableEditTags={disableEditTags}
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
