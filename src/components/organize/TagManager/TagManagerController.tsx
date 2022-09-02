import { Add } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { Box, Button, Popover } from '@material-ui/core';

import TagSelect from './components/TagSelect';
import TagsList from './components/TagsList';
import { EditTag, NewTag } from './types';
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';
import { useStore } from 'react-redux';
import TagListModel from 'features/tags/models/TagListModel';
import { Store } from 'core/store';
import useModel from 'core/useModel';
import TagAssignModel from 'features/tags/models/TagAssignModel';

export interface TagManagerControllerProps {
  assignedTags: ZetkinTag[];
  availableGroups: ZetkinTagGroup[];
  availableTags: ZetkinTag[];
  disableEditTags?: boolean;
  disabledTags?: ZetkinTag[];
  groupTags?: boolean;
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
  onAssignTag,
  onCreateTag,
  onEditTag,
  onUnassignTag,
}) => {
  const [addTagButton, setAddTagButton] = useState<HTMLElement | null>(null);
  const listModel = useModel(store => new TagListModel(store, 1));
  const assignModel = useModel(store => new TagAssignModel(store, 1, '/orgs/1/people/1'));

  availableTags = listModel.getAll();
  assignedTags = assignModel.getAssignedTags();

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
          PaperProps={{ style: { minWidth: '300px' } }}
        >
          <TagSelect
            model={assignModel}
            disabledTags={disabledTags || assignedTags}
            disableEditTags={disableEditTags}
            groups={availableGroups}
            onClose={() => setAddTagButton(null)}
            onCreateTag={async (tag) => {
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
