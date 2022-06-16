/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMemo, useState } from 'react';

import { UPDATE_TYPES, ZetkinUpdate } from 'types/updates';

export type UpdateFilterOptions =
  | 'all'
  | 'notes'
  | 'files'
  | 'milestones'
  | 'tags';

const useFilterUpdates = (updates: ZetkinUpdate[]) => {
  const [updateTypeFilter, setUpdateTypeFilter] =
    useState<UpdateFilterOptions>('all');

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
