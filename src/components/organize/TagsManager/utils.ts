import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import SnackbarContext from 'hooks/SnackbarContext';
import { EditTag, NewTag } from './types';
import { tagGroupsResource, tagsResource } from 'api/tags';
import { ZetkinTag, ZetkinTagPatchBody, ZetkinTagPostBody } from 'types/zetkin';

export const DEFAULT_TAG_COLOR = '#e1e1e1';

interface GroupedTagsHashmap {
  [key: string]: {
    id: number | 'ungrouped';
    tags: ZetkinTag[];
    title: string;
  };
}

export const groupTags = (
  tags: ZetkinTag[],
  localisedUngroupedText: string
): { id: number | 'ungrouped'; tags: ZetkinTag[]; title: string }[] => {
  const groupedTags: GroupedTagsHashmap = tags.reduce(
    (acc: GroupedTagsHashmap, tag) => {
      // Add to ungrouped tags list
      if (!tag.group) {
        return {
          ...acc,
          ungrouped: {
            id: 'ungrouped',
            tags: acc['ungrouped'] ? [...acc['ungrouped'].tags, tag] : [tag],
            title: localisedUngroupedText,
          },
        };
      }
      // Add to tags list for group
      return {
        ...acc,
        [tag.group.id]: {
          id: tag.group.id,
          tags: acc[tag.group.id] ? [...acc[tag.group.id].tags, tag] : [tag],
          title: tag.group.title,
        },
      };
    },
    {}
  );

  // Sort tags within groups
  Object.values(groupedTags).forEach((group) =>
    group.tags.sort((tag0, tag1) => tag0.title.localeCompare(tag1.title))
  );

  const { ungrouped, ...grouped } = groupedTags;

  const sortedGroupedTags = Object.values(grouped).sort((group0, group1) =>
    group0.title.localeCompare(group1.title)
  );

  return [...sortedGroupedTags, ungrouped];
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
export const useEditTag = (
  keyToInvalidate?: string[]
): ((tag: EditTag) => Promise<ZetkinTag>) => {
  const { orgId } = useRouter().query;
  const queryClient = useQueryClient();

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
          ...(keyToInvalidate && {
            onSettled: () => queryClient.invalidateQueries(keyToInvalidate),
          }),
        }
      );
    } else {
      // Add tag with existing or no group
      return await editTagMutation.mutateAsync(tag, {
        onError: () => showSnackbar('error'),
        ...(keyToInvalidate && {
          onSettled: () => queryClient.invalidateQueries(keyToInvalidate),
        }),
      });
    }
  };

  return editTag;
};
