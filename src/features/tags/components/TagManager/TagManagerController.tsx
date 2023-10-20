import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { Box, Button, Popover } from '@mui/material';

import TagSelect from 'features/tags/components/TagManager/components/TagSelect';
import TagsList from './components/TagsList';
import { EditTag, NewTag } from './types';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';

import messageIds from '../../l10n/messageIds';
import { Msg } from 'core/i18n';

export interface TagManagerControllerProps {
  assignedTags: ZetkinTag[];
  availableGroups: ZetkinTagGroup[];
  availableTags: ZetkinTag[];
  disableEditTags?: boolean;
  disabledTags?: ZetkinTag[];
  groupTags?: boolean;
  ignoreValues?: boolean;
  onAssignTag: (tag: ZetkinTag) => void;
  onCreateTag: (tag: NewTag) => Promise<ZetkinTag>;
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
  groupTags = true,
  ignoreValues = false,
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
          <Msg id={messageIds.manager.addTag} />
        </Button>
        <Popover
          anchorEl={addTagButton}
          onClose={() => setAddTagButton(null)}
          open={Boolean(addTagButton)}
          PaperProps={{ style: { minWidth: '300px' } }}
        >
          <TagSelect
            disabledTags={disabledTags || assignedTags}
            disableEditTags={disableEditTags}
            groups={availableGroups}
            ignoreValues={ignoreValues}
            onClose={() => setAddTagButton(null)}
            onCreateTag={async (tag) => {
              console.log('yeah new tag');
              const newTag = await onCreateTag(tag);
              if (!newTag.value_type) {
                // If not a value tag, assign to resource directly
                onAssignTag(newTag);
              }
              // New tag is accessible in TagSelect
              return newTag;
            }}
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
