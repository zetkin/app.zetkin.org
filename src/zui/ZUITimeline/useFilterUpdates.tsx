import { useMemo, useState } from 'react';

import { UPDATE_TYPES, ZetkinUpdate } from 'zui/ZUITimeline/types';

export enum UPDATE_TYPE_FILTER_OPTIONS {
  ALL = 'all',
  NOTES = 'notes',
  FILES = 'files',
  PEOPLE = 'people',
  MILESTONES = 'milestones',
  TAGS = 'tags',
  JOURNEY = 'journey',
}

const filterUpdates = (
  update: ZetkinUpdate,
  updateTypeFilter: UPDATE_TYPE_FILTER_OPTIONS
): boolean => {
  if (updateTypeFilter === 'all') {
    return true;
  } else if (updateTypeFilter === 'notes') {
    return update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE;
  } else if (updateTypeFilter === 'files') {
    return (
      update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE &&
      update.details.note.files.length > 0
    );
  } else if (updateTypeFilter === 'people') {
    return [
      UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE,
      UPDATE_TYPES.JOURNEYINSTANCE_REMOVEASSIGNEE,
      UPDATE_TYPES.JOURNEYINSTANCE_ADDSUBJECT,
      UPDATE_TYPES.JOURNEYINSTANCE_REMOVESUBJECT,
    ].includes(update.type);
  } else if (updateTypeFilter === 'milestones') {
    return update.type === UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE;
  } else if (updateTypeFilter === 'tags') {
    const tagSelectors = [
      UPDATE_TYPES.ANY_ADDTAGS,
      UPDATE_TYPES.ANY_REMOVETAGS,
    ].map((type) => type.slice(2));
    return tagSelectors.some((selector) => update.type.includes(selector));
  } else if (updateTypeFilter === 'journey') {
    return [
      UPDATE_TYPES.JOURNEYINSTANCE_CREATE,
      UPDATE_TYPES.JOURNEYINSTANCE_OPEN,
      UPDATE_TYPES.JOURNEYINSTANCE_CLOSE,
      UPDATE_TYPES.JOURNEYINSTANCE_UPDATE,
      UPDATE_TYPES.JOURNEYINSTANCE_CONVERT,
    ].includes(update.type);
  }
  return false;
};

const useFilterUpdates = (updates: ZetkinUpdate[]) => {
  const [updateTypeFilter, setUpdateTypeFilter] = useState(
    UPDATE_TYPE_FILTER_OPTIONS.ALL
  );

  // Sorts and groups only when the updates are changed
  const groupedUpdates = useMemo(() => {
    const sortedUpdates = updates.sort(
      (u0, u1) =>
        new Date(u1.timestamp).getTime() - new Date(u0.timestamp).getTime()
    );
    // Hashmap where key is UPDATE_TYPE_FILTER_OPTIONS and value is list of all updates of that type
    return Object.values(UPDATE_TYPE_FILTER_OPTIONS).reduce(
      (
        acc: { [K in UPDATE_TYPE_FILTER_OPTIONS]: ZetkinUpdate[] },
        updateType
      ) => {
        const updatesOfType = sortedUpdates.filter((update) =>
          filterUpdates(update, updateType)
        );
        return { ...acc, [updateType]: updatesOfType };
      },
      {} as { [K in UPDATE_TYPE_FILTER_OPTIONS]: ZetkinUpdate[] }
    );
  }, [updates]);

  const filteredUpdates = groupedUpdates[updateTypeFilter];

  return {
    filteredUpdates,
    groupedUpdates,
    setUpdateTypeFilter,
    typeFilterOptions: Object.values(UPDATE_TYPE_FILTER_OPTIONS),
    updateTypeFilter,
  };
};

export default useFilterUpdates;
