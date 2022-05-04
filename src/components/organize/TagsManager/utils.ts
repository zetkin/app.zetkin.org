import { useContext } from 'react';
import { UseMutationResult } from 'react-query';
import { useRouter } from 'next/router';

import SnackbarContext from 'hooks/SnackbarContext';
import { tagGroupsResource } from 'api/tags';
import { NewTag, NewTagGroup, TagsGroups } from './types';
import { ZetkinTag, ZetkinTagPostBody } from 'types/zetkin';

export const DEFAULT_TAG_COLOR = '#e1e1e1';

export const groupTags = (
  tags: ZetkinTag[],
  localisedUngroupedText: string
): TagsGroups => {
  return tags.reduce((acc: TagsGroups, tag) => {
    // Add to ungrouped tags list
    if (!tag.group) {
      return {
        ...acc,
        ungrouped: {
          tags: acc['ungrouped'] ? [...acc['ungrouped'].tags, tag] : [tag],
          title: localisedUngroupedText,
        },
      };
    }
    // Add to tags list for group
    return {
      ...acc,
      [tag.group.id]: {
        tags: acc[tag.group.id] ? [...acc[tag.group.id].tags, tag] : [tag],
        title: tag.group.title,
      },
    };
  }, {});
};

/**
 * Returns a function for creating a tag using react-query mutations while
 * supporting the ability to create a tag group.
 *
 * Provide a `createTagMutation` because this can be different for universal tags or person tags.
 * The mutation to create a group is always the same, so this is hard coded.
 */
export const useCreateTag = (
  createTagMutation: UseMutationResult<ZetkinTag, unknown, NewTagGroup>
): ((tag: NewTag) => Promise<ZetkinTag>) => {
  const { orgId } = useRouter().query;
  const tagsGroupMutation = tagGroupsResource(orgId as string).useAdd();
  const { showSnackbar } = useContext(SnackbarContext);

  const createTag = async (tag: NewTag) => {
    if ('group' in tag) {
      // If creating a new group, has group object
      const newGroup = await tagsGroupMutation.mutateAsync(tag.group, {
        onError: () => showSnackbar('error'),
      });
      const tagWithNewGroup = {
        ...tag,
        group: undefined,
        group_id: newGroup.id,
      };
      return await createTagMutation.mutateAsync(
        tagWithNewGroup as ZetkinTagPostBody,
        {
          onError: () => showSnackbar('error'),
        }
      );
    } else {
      // Add tag with existing or no group
      return await createTagMutation.mutateAsync(tag, {
        onError: () => showSnackbar('error'),
      });
    }
  };

  return createTag;
};
