import { Add } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Button, Popover, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import GroupToggle from './GroupToggle';
import TagSelect from './TagSelect';
import TagsList from './TagsList';
import ZetkinQuery from 'components/ZetkinQuery';
import ZetkinSection from 'components/ZetkinSection';
import { EditTag, NewTag } from './types';
import { tagGroupsResource, tagsResource } from 'api/tags';
import { useCreateTag, useEditTag } from './utils';
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

interface TagsManagerProps {
  assignedTags: ZetkinTag[];
  availableGroups: ZetkinTagGroup[];
  availableTags: ZetkinTag[];
  onAssignTag: (tag: ZetkinTag) => void;
  onCreateTag: (tag: NewTag) => void;
  onEditTag: (tag: EditTag) => void;
  onUnassignTag: (tag: ZetkinTag) => void;
}

export const TagsManagerController: React.FunctionComponent<
  TagsManagerProps
> = ({
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

const TagsManager: React.FunctionComponent<
  Omit<
    TagsManagerProps,
    'availableGroups' | 'availableTags' | 'onCreateTag' | 'onEditTag'
  > & { assignedTagsQueryKey?: Array<string> }
> = (props) => {
  const { orgId } = useRouter().query;

  const tagsQuery = tagsResource(orgId as string).useQuery();
  const tagGroupsQuery = tagGroupsResource(orgId as string).useQuery();

  const createTag = useCreateTag();
  const editTag = useEditTag(props.assignedTagsQueryKey);

  return (
    <ZetkinQuery queries={{ tagGroupsQuery, tagsQuery }}>
      {({ queries: { tagGroupsQuery, tagsQuery } }) => (
        <TagsManagerController
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

export default TagsManager;
