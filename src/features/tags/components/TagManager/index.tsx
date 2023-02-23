import { useRouter } from 'next/router';
import { useState } from 'react';

import GroupToggle from './components/GroupToggle';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIQuery from 'zui/ZUIQuery';
import ZUISection from 'zui/ZUISection';
import { tagGroupsResource, tagsResource } from 'features/tags/api/tags';
import TagManagerController, {
  TagManagerControllerProps,
} from './TagManagerController';
import { useCreateTag, useEditTag } from './utils';

import messages from '../../messages';
import { useMessages } from 'core/i18n';

type TagManagerProps = Omit<
  TagManagerControllerProps,
  'availableGroups' | 'availableTags' | 'onCreateTag' | 'onEditTag'
> & { disableEditTags?: boolean; onTagEdited?: (tag: ZetkinTag) => void };

const TagManager: React.FunctionComponent<TagManagerProps> = (props) => {
  const { orgId } = useRouter().query;

  const tagsQuery = tagsResource(orgId as string).useQuery();
  const tagGroupsQuery = tagGroupsResource(orgId as string).useQuery();

  const createTag = useCreateTag();
  const editTag = useEditTag(props.onTagEdited);

  return (
    <ZUIQuery queries={{ tagGroupsQuery, tagsQuery }}>
      {({ queries: { tagGroupsQuery, tagsQuery } }) => (
        <TagManagerController
          availableGroups={tagGroupsQuery.data}
          availableTags={tagsQuery.data}
          onCreateTag={createTag}
          onEditTag={editTag}
          {...props}
        />
      )}
    </ZUIQuery>
  );
};

export const TagManagerSection: React.FunctionComponent<
  Omit<TagManagerProps, 'groupTags'>
> = (props) => {
  const msg = useMessages(messages);

  const [isGrouped, setIsGrouped] = useState(true);

  return (
    <ZUISection
      action={
        <GroupToggle
          checked={isGrouped}
          onChange={() => setIsGrouped(!isGrouped)}
        />
      }
      title={msg.manager.title()}
    >
      <TagManager groupTags={isGrouped} {...props} />
    </ZUISection>
  );
};

export default TagManager;
