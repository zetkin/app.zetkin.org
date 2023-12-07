import { useState } from 'react';

import GroupToggle from './components/GroupToggle';
import useCreateTag from 'features/tags/hooks/useCreateTag';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useTagGroups from 'features/tags/hooks/useTagGroups';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIFutures from 'zui/ZUIFutures';
import ZUISection from 'zui/ZUISection';
import TagManagerController, {
  TagManagerControllerProps,
} from './TagManagerController';

import messageIds from '../../l10n/messageIds';
import useTagMutations from 'features/tags/hooks/useTagMutations';

type TagManagerProps = Omit<
  TagManagerControllerProps,
  'availableGroups' | 'availableTags' | 'onCreateTag' | 'onEditTag'
> & {
  disableEditTags?: boolean;
  disableValueTags?: boolean;
  onTagEdited?: (tag: ZetkinTag) => void;
};

const TagManager: React.FunctionComponent<TagManagerProps> = (props) => {
  const { orgId } = useNumericRouteParams();
  const tagsFuture = useTags(orgId);
  const { tagGroupsFuture } = useTagGroups(orgId);

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
            availableGroups={tagGroups}
            availableTags={props.disableValueTags ? tagsWithoutValueTags : tags}
            onCreateTag={createTag}
            onEditTag={async (newValue) => {
              const updated = await updateTag(newValue);
              if (props.onTagEdited) {
                props.onTagEdited(updated);
              }
            }}
            {...props}
          />
        );
      }}
    </ZUIFutures>
  );
};

export const TagManagerSection: React.FunctionComponent<
  Omit<TagManagerProps, 'groupTags'>
> = (props) => {
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
      <TagManager groupTags={isGrouped} {...props} />
    </ZUISection>
  );
};

export default TagManager;
