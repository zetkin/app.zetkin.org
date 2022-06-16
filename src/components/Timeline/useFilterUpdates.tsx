/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMemo, useState } from 'react';

import { UPDATE_TYPES, ZetkinUpdate } from 'types/updates';

export enum UPDATE_TYPE_FILTER_OPTIONS {
  All = 'all',
  NOTES = 'notes',
  FILES = 'files',
  PEOPLE = 'people',
  MILESTONES = 'milestones',
  TAGS = 'tags',
}

const useFilterUpdates = (updates: ZetkinUpdate[]) => {
  const [updateTypeFilter, setUpdateTypeFilter] = useState(
    UPDATE_TYPE_FILTER_OPTIONS.All
  );

  const sortedUpdates = useMemo(
    () =>
      updates.sort(
        (u0, u1) =>
          new Date(u1.timestamp).getTime() - new Date(u0.timestamp).getTime()
      ),
    [updates]
  );

  const filteredUpdates = sortedUpdates.filter((update) => {
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
    }
  });

  return {
    filteredUpdates,
    setUpdateTypeFilter,
    updateTypeFilter,
  };
};

export default useFilterUpdates;
