import { FC, useState } from 'react';

import GroupToggle from './components/GroupToggle';
import messageIds from '../../l10n/messageIds';
import useCreateTag from 'features/tags/hooks/useCreateTag';
import useDeleteTag from 'features/tags/hooks/useDeleteTag';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useTagGroups from 'features/tags/hooks/useTagGroups';
import useTagMutations from 'features/tags/hooks/useTagMutations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIFutures from 'zui/ZUIFutures';
import ZUISection from 'zui/ZUISection';
import TagManagerController, {
  TagManagerControllerProps,
} from './TagManagerController';

type TagManagerProps = Omit<
  TagManagerControllerProps,
  | 'availableGroups'
  | 'availableTags'
  | 'onCreateTag'
  | 'onEditTag'
  | 'onDeleteTag'
> & {
  disableValueTags?: boolean;
  onTagEdited?: (tag: ZetkinTag) => void;
};

const TagManager: FC<TagManagerProps> = ({
  disableEditTags,
  disableValueTags,
  onTagEdited,
  onAssignTag,
  onUnassignTag,
  assignedTags,
  disabledTags,
  groupTags,
  ignoreValues,
  submitCreateTagLabel,
}) => {
  const { orgId } = useNumericRouteParams();
  const tagsFuture = useTags(orgId);
  const tagGroupsFuture = useTagGroups(orgId);
  const deleteTag = useDeleteTag(orgId);
  const createTag = useCreateTag(orgId);
  const { updateTag } = useTagMutations(orgId);

  return (
    <ZUIFutures futures={{ tagGroups: tagGroupsFuture, tags: tagsFuture }}>
      {({ data: { tagGroups, tags } }) => {
        const tagsWithoutValueTags = tags.filter(
          (tag) => tag.value_type == null
        );
        return (
          <TagManagerController
            assignedTags={assignedTags}
            availableGroups={tagGroups}
            availableTags={disableValueTags ? tagsWithoutValueTags : tags}
            disabledTags={disabledTags}
            disableEditTags={disableEditTags}
            groupTags={groupTags}
            ignoreValues={ignoreValues}
            onAssignTag={onAssignTag}
            onCreateTag={createTag}
            onDeleteTag={deleteTag}
            onEditTag={async (newValue) => {
              const updated = await updateTag(newValue);
              if (onTagEdited) {
                onTagEdited(updated);
              }
            }}
            onUnassignTag={onUnassignTag}
            submitCreateTagLabel={submitCreateTagLabel}
          />
        );
      }}
    </ZUIFutures>
  );
};

export const TagManagerSection: FC<Omit<TagManagerProps, 'groupTags'>> = ({
  assignedTags,
  onAssignTag,
  onUnassignTag,
  disableEditTags,
  disableValueTags,
  disabledTags,
  ignoreValues,
  onTagEdited,
  submitCreateTagLabel,
}) => {
  const messages = useMessages(messageIds);

  const [isGrouped, setIsGrouped] = useState(true);

  return (
    <ZUISection
      action={
        <GroupToggle
          checked={isGrouped}
          onChange={() => setIsGrouped(!isGrouped)}
        />
      }
      title={messages.manager.title()}
    >
      <TagManager
        assignedTags={assignedTags}
        disabledTags={disabledTags}
        disableEditTags={disableEditTags}
        disableValueTags={disableValueTags}
        groupTags={isGrouped}
        ignoreValues={ignoreValues}
        onAssignTag={onAssignTag}
        onTagEdited={onTagEdited}
        onUnassignTag={onUnassignTag}
        submitCreateTagLabel={submitCreateTagLabel}
      />
    </ZUISection>
  );
};

export default TagManager;
