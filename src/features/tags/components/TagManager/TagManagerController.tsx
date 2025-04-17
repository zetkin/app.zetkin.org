import { Add } from '@mui/icons-material';
import { Box, Button, Popover } from '@mui/material';
import { FC, useState } from 'react';

import messageIds from '../../l10n/messageIds';
import { Msg } from 'core/i18n';
import TagSelect from 'features/tags/components/TagManager/components/TagSelect';
import TagsList from './components/TagsList';
import { EditTag, NewTag } from './types';
import {
  ZetkinAppliedTag,
  ZetkinTag,
  ZetkinTagGroup,
} from 'utils/types/zetkin';

export interface TagManagerControllerProps {
  assignedTags: ZetkinAppliedTag[];
  availableGroups: ZetkinTagGroup[];
  availableTags: ZetkinTag[];
  disableEditTags?: boolean;
  disabledTags?: ZetkinAppliedTag[];
  groupTags?: boolean;
  ignoreValues?: boolean;
  onAssignTag: (tag: ZetkinAppliedTag) => void;
  onCreateTag: (tag: NewTag) => Promise<ZetkinTag>;
  onDeleteTag: (tagId: number) => void;
  onEditTag: (tag: EditTag) => void;
  onUnassignTag: (tag: ZetkinAppliedTag) => void;
  submitCreateTagLabel?: string;
}

export const TagManagerController: FC<TagManagerControllerProps> = ({
  assignedTags,
  availableGroups,
  availableTags,
  disableEditTags,
  disabledTags,
  groupTags = true,
  ignoreValues = false,
  onAssignTag,
  onCreateTag,
  onDeleteTag,
  onEditTag,
  onUnassignTag,
  submitCreateTagLabel,
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
              const newTag = await onCreateTag(tag);
              if (!newTag.value_type) {
                onAssignTag({ ...newTag, value: null });
              }
              // New tag is accessible in TagSelect
              return newTag;
            }}
            onDeleteTag={onDeleteTag}
            onEditTag={onEditTag}
            onSelect={onAssignTag}
            submitCreateTagLabel={submitCreateTagLabel}
            tags={availableTags}
          />
        </Popover>
      </Box>
    </>
  );
};

export default TagManagerController;
