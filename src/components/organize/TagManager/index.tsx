import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useState } from 'react';

import GroupToggle from './components/GroupToggle';
import ZetkinQuery from 'components/ZetkinQuery';
import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTag } from 'types/zetkin';
import { tagGroupsResource, tagsResource } from 'api/tags';
import TagManagerController, {
  TagManagerControllerProps,
} from './TagManagerController';
import { useCreateTag, useEditTag } from './utils';

type TagManageProps = Omit<
  TagManagerControllerProps,
  'availableGroups' | 'availableTags' | 'onCreateTag' | 'onEditTag'
> & { onTagEdited: (tag: ZetkinTag) => void };

const TagManager: React.FunctionComponent<TagManageProps> = (props) => {
  const { orgId } = useRouter().query;

  const tagsQuery = tagsResource(orgId as string).useQuery();
  const tagGroupsQuery = tagGroupsResource(orgId as string).useQuery();

  const createTag = useCreateTag();
  const editTag = useEditTag(props.onTagEdited);

  return (
    <ZetkinQuery queries={{ tagGroupsQuery, tagsQuery }}>
      {({ queries: { tagGroupsQuery, tagsQuery } }) => (
        <TagManagerController
          availableGroups={tagGroupsQuery.data}
          availableTags={tagsQuery.data}
          onCreateTag={async (tagToCreate) => {
            const newTag = await createTag(tagToCreate);
            props.onAssignTag(newTag);
          }}
          onEditTag={editTag}
          {...props}
        />
      )}
    </ZetkinQuery>
  );
};

export const TagManagerSection: React.FunctionComponent<
  Omit<TagManageProps, 'groupTags'>
> = (props) => {
  const intl = useIntl();

  const [isGrouped, setIsGrouped] = useState(false);

  return (
    <ZetkinSection
      action={
        <GroupToggle
          checked={isGrouped}
          onChange={() => setIsGrouped(!isGrouped)}
        />
      }
      title={intl.formatMessage({ id: 'misc.tags.tagManager.title' })}
    >
      <TagManager groupTags={isGrouped} {...props} />{' '}
    </ZetkinSection>
  );
};

export default TagManager;
