import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ZetkinAppliedTag,
  ZetkinOrganization,
  ZetkinPerson,
  ZetkinTag,
  ZetkinTagGroup,
} from 'utils/types/zetkin';
import {
  remoteListCreated,
  remoteListLoad,
  remoteListLoaded,
} from 'utils/storeUtils/remoteListUtils';
import {
  RemoteItem,
  remoteItemDeleted,
  remoteItemLoad,
  remoteItemLoaded,
  remoteItemUpdate,
  remoteItemUpdated,
  RemoteList,
} from 'utils/storeUtils';
import { SafeRecord } from 'utils/types';

type OrgId = ZetkinOrganization['id'];
type PersonId = ZetkinPerson['id'];
type TagId = ZetkinTag['id'];
type TagGroupId = ZetkinTagGroup['id'];

export interface TagsStoreSlice {
  tagsById: SafeRecord<TagId, RemoteItem<ZetkinTag>>;
  groupsById: SafeRecord<TagGroupId, RemoteItem<ZetkinTagGroup>>;

  orgTags: SafeRecord<OrgId, RemoteList<ZetkinTag['id']>>;
  personTags: SafeRecord<
    `${OrgId}-${PersonId}`,
    RemoteList<{
      id: TagId;
      value: string | number | null;
    }>
  >;
  tagGroups: SafeRecord<OrgId, RemoteList<TagGroupId>>;
}

const initialState: TagsStoreSlice = {
  groupsById: {},
  orgTags: {},
  personTags: {},
  tagGroups: {},
  tagsById: {},
};

const tagsSlice = createSlice({
  initialState: initialState,
  name: 'tags',
  reducers: {
    personTagsLoad: (state, action: PayloadAction<[OrgId, PersonId]>) => {
      const [orgId, personId] = action.payload;
      const key = `${orgId}-${personId}` as const;

      state.personTags[key] = remoteListLoad(state.personTags[key] ?? null);
    },
    personTagsLoaded: (
      state,
      action: PayloadAction<[[OrgId, PersonId], ZetkinAppliedTag[]]>
    ) => {
      const [[orgId, personId], tags] = action.payload;
      const key = `${orgId}-${personId}` as const;

      tags.forEach((tag) => {
        state.tagsById[tag.id] = remoteItemLoaded(tag);
        if (tag.group) {
          state.groupsById[tag.group.id] = remoteItemLoaded(tag.group);
        }
      });

      state.personTags[key] = remoteListLoaded(
        tags.map((tag) => ({
          id: tag.id,
          value: tag.value,
        }))
      );
    },
    tagAssigned: (
      state,
      action: PayloadAction<[[OrgId, PersonId], ZetkinAppliedTag]>
    ) => {
      const [[orgId, personId], appliedTag] = action.payload;
      const key = `${orgId}-${personId}` as const;
      const { value, ...tag } = appliedTag;

      state.tagsById[appliedTag.id] = remoteItemLoaded(tag);

      state.personTags[key] ||= remoteListCreated();
      remoteItemUpdated(state.personTags[key], {
        id: appliedTag.id,
        value: value,
      });
    },
    tagCreate: (state, action: PayloadAction<[OrgId]>) => {
      // TODO: This is inconsistent with other features. The list itself is not truly loading, just some of the contents
      const [orgId] = action.payload;

      state.orgTags[orgId] = remoteListLoad(state.orgTags[orgId]);
    },
    tagCreated: (state, action: PayloadAction<[[OrgId], ZetkinTag]>) => {
      const [[orgId], tag] = action.payload;

      state.tagsById[tag.id] = remoteItemLoaded(tag);

      state.orgTags[orgId] ||= remoteListCreated();
      state.orgTags[orgId].isLoading = false;
      remoteItemUpdated(state.orgTags[orgId], tag.id);
    },
    tagDeleted: (state, action: PayloadAction<[TagId]>) => {
      const [tagId] = action.payload;

      if (state.tagsById[tagId]) {
        state.tagsById[tagId].deleted = true;
      }
    },
    tagGroupCreate: (state, action: PayloadAction<[OrgId]>) => {
      // TODO: This is inconsistent with other features. The list itself is not truly loading, just some of the contents
      const [orgId] = action.payload;

      state.tagGroups[orgId] ||= remoteListCreated();
      state.tagGroups[orgId].isLoading = true;
    },
    tagGroupCreated: (
      state,
      action: PayloadAction<[[OrgId], ZetkinTagGroup]>
    ) => {
      const [[orgId], tagGroup] = action.payload;

      state.groupsById[tagGroup.id] = remoteItemLoaded(tagGroup);

      state.tagGroups[orgId] ||= remoteListCreated();
      remoteItemUpdated(state.tagGroups[orgId], tagGroup.id);
    },
    tagGroupDeleted: (state, action: PayloadAction<[TagGroupId]>) => {
      const [tagGroupId] = action.payload;

      if (state.groupsById[tagGroupId]) {
        state.groupsById[tagGroupId].deleted = true;
      }
    },
    tagGroupUpdate: (
      state,
      action: PayloadAction<[[OrgId, TagGroupId], string[]]>
    ) => {
      const [[orgId, tagGroupId], mutating] = action.payload;

      state.tagGroups[orgId] ||= remoteListCreated();
      remoteItemUpdate(state.tagGroups[orgId], tagGroupId, mutating);
    },
    tagGroupUpdated: (
      state,
      action: PayloadAction<[[OrgId], ZetkinTagGroup]>
    ) => {
      const [[orgId], tagGroup] = action.payload;

      state.groupsById[tagGroup.id] = remoteItemLoaded(tagGroup);

      state.tagGroups[orgId] ||= remoteListCreated();
      remoteItemUpdated(state.tagGroups[orgId], tagGroup.id);
    },
    tagGroupsLoad: (state, action: PayloadAction<[OrgId]>) => {
      const [orgId] = action.payload;

      state.tagGroups[orgId] = remoteListLoad(state.tagGroups[orgId]);
    },
    tagGroupsLoaded: (
      state,
      action: PayloadAction<[[OrgId], ZetkinTagGroup[]]>
    ) => {
      const [[orgId], tagGroups] = action.payload;

      tagGroups.forEach((group) => {
        state.groupsById[group.id] = remoteItemLoaded(group);
      });

      state.tagGroups[orgId] = remoteListLoaded(
        tagGroups.map((group) => group.id)
      );
    },
    tagLoad: (state, action: PayloadAction<[OrgId, TagId]>) => {
      const [orgId, tagId] = action.payload;

      state.orgTags[orgId] ||= remoteListCreated();
      remoteItemLoad(state.orgTags[orgId], tagId);
    },
    tagLoaded: (state, action: PayloadAction<[[OrgId], ZetkinTag]>) => {
      const [[orgId], tag] = action.payload;

      state.tagsById[tag.id] = remoteItemLoaded(tag);

      state.orgTags[orgId] ||= remoteListCreated();
      remoteItemUpdated(state.orgTags[orgId], tag.id);
    },
    tagUnassigned: (state, action: PayloadAction<[OrgId, PersonId, TagId]>) => {
      const [orgId, personId, tagId] = action.payload;
      const key = `${orgId}-${personId}` as const;

      if (!state.personTags[key]) {
        return;
      }

      remoteItemDeleted(state.personTags[key], tagId);
    },
    tagUpdate: (state, action: PayloadAction<[[OrgId, TagId], string[]]>) => {
      const [[orgId, tagId], mutating] = action.payload;

      state.orgTags[orgId] ||= remoteListCreated();
      remoteItemUpdate(state.orgTags[orgId], tagId, mutating);
    },
    tagUpdated: (state, action: PayloadAction<[[OrgId], ZetkinTag]>) => {
      const [[orgId], tag] = action.payload;

      state.tagsById[tag.id] = remoteItemLoaded(tag);

      state.orgTags[orgId] ||= remoteListCreated();
      remoteItemUpdated(state.orgTags[orgId], tag.id);
    },
    tagsLoad: (state, action: PayloadAction<[OrgId]>) => {
      const [orgId] = action.payload;
      state.orgTags[orgId] = remoteListLoad(state.orgTags[orgId]);
    },
    tagsLoaded: (state, action: PayloadAction<[[OrgId], ZetkinTag[]]>) => {
      const [[orgId], tags] = action.payload;

      tags.forEach((tag) => {
        state.tagsById[tag.id] = remoteItemLoaded(tag);
      });

      state.orgTags[orgId] = remoteListLoaded(tags.map((tag) => tag.id));
    },
  },
});

export default tagsSlice;
export const {
  personTagsLoad,
  personTagsLoaded,
  tagAssigned,
  tagCreate,
  tagCreated,
  tagDeleted,
  tagGroupCreate,
  tagGroupCreated,
  tagGroupUpdate,
  tagGroupUpdated,
  tagGroupDeleted,
  tagGroupsLoad,
  tagGroupsLoaded,
  tagLoad,
  tagLoaded,
  tagsLoad,
  tagsLoaded,
  tagUnassigned,
  tagUpdate,
  tagUpdated,
} = tagsSlice.actions;
