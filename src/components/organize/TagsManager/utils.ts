import { useContext } from 'react';
import { useRouter } from 'next/router';

import SnackbarContext from 'hooks/SnackbarContext';
import { EditTag, NewTag, TagsGroups } from './types';
import { tagGroupsResource, tagsResource } from 'api/tags';
import { ZetkinTag, ZetkinTagPatchBody, ZetkinTagPostBody } from 'types/zetkin';

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

export const randomColor = (): string => {
  return Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
};

export const hexRegex = new RegExp(/^[0-9a-f]{6}$/i);

/**
 * Returns a function which handles creating new tags and conditionally
 * creating a new group for it.
 */
export const useCreateTag = (): ((tag: NewTag) => Promise<ZetkinTag>) => {
  const { orgId } = useRouter().query;

  const createTagMutation = tagsResource(orgId as string).useCreate();
  const createTagGroupMutation = tagGroupsResource(orgId as string).useCreate();

  const { showSnackbar } = useContext(SnackbarContext);

  const createTag = async (tag: NewTag) => {
    if ('group' in tag) {
      // If creating a new group, has group object
      const newGroup = await createTagGroupMutation.mutateAsync(tag.group, {
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

/**
 * Returns a function which handles editing tags and conditionally
 * creating a new group for it.
 */
export const useEditTag = (): ((tag: EditTag) => Promise<ZetkinTag>) => {
  const { orgId } = useRouter().query;

  const editTagMutation = tagsResource(orgId as string).useEdit();
  const createTagGroupMutation = tagGroupsResource(orgId as string).useCreate();

  const { showSnackbar } = useContext(SnackbarContext);

  const editTag = async (tag: EditTag) => {
    if ('group' in tag) {
      // If creating a new group, has group object
      const newGroup = await createTagGroupMutation.mutateAsync(tag.group, {
        onError: () => showSnackbar('error'),
      });
      const tagWithNewGroup = {
        ...tag,
        group: undefined,
        group_id: newGroup.id,
      };
      return await editTagMutation.mutateAsync(
        tagWithNewGroup as ZetkinTagPatchBody,
        {
          onError: () => showSnackbar('error'),
        }
      );
    } else {
      // Add tag with existing or no group
      return await editTagMutation.mutateAsync(tag, {
        onError: () => showSnackbar('error'),
      });
    }
  };

  return editTag;
};
