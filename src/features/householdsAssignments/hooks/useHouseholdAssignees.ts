import { MutableRefObject, useRef, useState } from 'react';
import Fuse from 'fuse.js';

import { IFuture, PromiseFuture, ResolvedFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinHouseholdsAssignee } from 'features/householdsAssignments/types';
import {
  assigneeAdd,
  assigneeAdded,
  assigneeConfigure,
  assigneeConfigured,
  assigneeRemove,
  assigneeRemoved,
  assigneesLoad,
  assigneesLoaded,
} from 'features/householdsAssignments/store';
import { ZetkinAppliedTag, ZetkinTag } from 'utils/types/zetkin';

interface UseHouseholdAssigneesReturn {
  addAssignee: (assigneeId: number) => PromiseFuture<ZetkinHouseholdsAssignee>;
  filteredAssigneesFuture: IFuture<ZetkinHouseholdsAssignee[]>;
  isAssignee: (personId: number) => boolean;
  removeAssignee: (assigneeId: number) => void;
  searchString: string;
  selectedAssignee: ZetkinHouseholdsAssignee | null;
  selectInputRef: MutableRefObject<HTMLInputElement | undefined>;
  setAssigneeTags: (
    userId: number,
    prioTags: ZetkinTag[],
    excludedTags: ZetkinTag[]
  ) => void;
  setSearchString: (searchString: string) => void;
  setSelectedAssignee: (assignee: ZetkinHouseholdsAssignee | null) => void;
}

export default function useHouseholdsAssignees(
  campId: number,
  orgId: number,
  householdsAssId: number
): UseHouseholdAssigneesReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const householdsAssignments = useAppSelector(
    (state) => state.householdAssignments
  );
  const assigneesList =
    householdsAssignments.assigneesByAssignmentId[householdsAssId];

  const [searchString, setSearchString] = useState('');
  const [selectedAssignee, setSelectedAssignee] =
    useState<ZetkinHouseholdsAssignee | null>(null);
  const selectInputRef = useRef<HTMLInputElement>();

  const addAssignee = (
    assigneeId: number
  ): PromiseFuture<ZetkinHouseholdsAssignee> => {
    dispatch(assigneeAdd([householdsAssId, assigneeId]));
    const promise = apiClient
      .put<ZetkinHouseholdsAssignee>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/assignees/${assigneeId}`
      )
      .then((data) => {
        dispatch(assigneeAdded([householdsAssId, data]));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const allAssigneesFuture = loadListIfNecessary(assigneesList, dispatch, {
    actionOnLoad: () => assigneesLoad(householdsAssId),
    actionOnSuccess: (data) => assigneesLoaded([data, householdsAssId]),
    loader: () =>
      apiClient.get<ZetkinHouseholdsAssignee[]>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/assignees`
      ),
  });

  let filteredAssigneesFuture: IFuture<ZetkinHouseholdsAssignee[]>;
  if (allAssigneesFuture.isLoading) {
    filteredAssigneesFuture = allAssigneesFuture;
  }

  if (allAssigneesFuture.data && searchString) {
    const fuse = new Fuse(allAssigneesFuture.data, {
      includeScore: true,
      keys: ['first_name', 'last_name'],
      threshold: 0.4,
    });

    const filteredAssignees = fuse
      .search(searchString)
      .map((fuseResult) => fuseResult.item);

    filteredAssigneesFuture = new ResolvedFuture(filteredAssignees);
  } else {
    filteredAssigneesFuture = new ResolvedFuture(allAssigneesFuture.data || []);
  }

  const isAssignee = (personId: number) =>
    !!allAssigneesFuture.data?.find((assignee) => assignee.id == personId);

  const removeAssignee = (assigneeId: number) => {
    dispatch(assigneeRemove([householdsAssId, assigneeId]));
    apiClient
      .delete(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/assignees/${assigneeId}`
      )
      .then(() => {
        dispatch(assigneeRemoved([householdsAssId, assigneeId]));
      });
  };

  const setAssigneeTags = (
    assigneeId: number,
    prioritized_tags: ZetkinTag[],
    excluded_tags: ZetkinTag[]
  ) => {
    dispatch(assigneeConfigure([householdsAssId, assigneeId]));
    apiClient
      .patch<ZetkinHouseholdsAssignee>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/assignees/${assigneeId}`,
        {
          excluded_tags: excluded_tags.map((tag) => ({
            ...tag,
            value: assigneeId,
          })),
          prioritized_tags: prioritized_tags.map((tag) => ({
            ...tag,
            value: assigneeId,
          })),
        }
      )
      .then((data: ZetkinHouseholdsAssignee) => {
        dispatch(assigneeConfigured([householdsAssId, data]));
      });
  };

  return {
    addAssignee,
    filteredAssigneesFuture,
    isAssignee,
    removeAssignee,
    searchString,
    selectInputRef,
    selectedAssignee,
    setAssigneeTags,
    setSearchString,
    setSelectedAssignee,
  };
}
