import { MutableRefObject, useRef, useState } from 'react';
import Fuse from 'fuse.js';

import { IFuture, PromiseFuture, ResolvedFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinVisitAssignee } from 'features/visitassignments/types';
import {
  assigneeAdd,
  assigneeAdded,
  assigneeConfigure,
  assigneeConfigured,
  assigneeRemove,
  assigneeRemoved,
  assigneesLoad,
  assigneesLoaded,
} from 'features/visitassignments/store';
import { ZetkinTag } from 'utils/types/zetkin';

interface UseVisitAssigneesReturn {
  addAssignee: (assigneeId: number) => PromiseFuture<ZetkinVisitAssignee>;
  filteredAssigneesFuture: IFuture<ZetkinVisitAssignee[]>;
  isAssignee: (personId: number) => boolean;
  removeAssignee: (assigneeId: number) => void;
  searchString: string;
  selectedAssignee: ZetkinVisitAssignee | null;
  selectInputRef: MutableRefObject<HTMLInputElement | undefined>;
  setAssigneeTags: (
    userId: number,
    prioTags: ZetkinTag[],
    excludedTags: ZetkinTag[]
  ) => void;
  setSearchString: (searchString: string) => void;
  setSelectedAssignee: (assignee: ZetkinVisitAssignee | null) => void;
}

export default function useVisitAssignees(
  campId: number,
  orgId: number,
  visitAssId: number
): UseVisitAssigneesReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const visitAssignments = useAppSelector((state) => state.visitAssignments);
  const assigneesList = visitAssignments.assigneesByAssignmentId[visitAssId];

  const [searchString, setSearchString] = useState('');
  const [selectedAssignee, setSelectedAssignee] =
    useState<ZetkinVisitAssignee | null>(null);
  const selectInputRef = useRef<HTMLInputElement>();

  const addAssignee = (
    assigneeId: number
  ): PromiseFuture<ZetkinVisitAssignee> => {
    dispatch(assigneeAdd([visitAssId, assigneeId]));
    const promise = apiClient
      .put<ZetkinVisitAssignee>(
        `/beta/orgs/${orgId}/projects/${campId}/visitassignments/${visitAssId}/assignees/${assigneeId}`
      )
      .then((data) => {
        dispatch(assigneeAdded([visitAssId, data]));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const allAssigneesFuture = loadListIfNecessary(assigneesList, dispatch, {
    actionOnLoad: () => assigneesLoad(visitAssId),
    actionOnSuccess: (data) => assigneesLoaded([data, visitAssId]),
    loader: () =>
      apiClient.get<ZetkinVisitAssignee[]>(
        `/beta/orgs/${orgId}/projects/${campId}/visitassignments/${visitAssId}/assignees`
      ),
  });

  let filteredAssigneesFuture: IFuture<ZetkinVisitAssignee[]>;
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
    dispatch(assigneeRemove([visitAssId, assigneeId]));
    apiClient
      .delete(
        `/beta/orgs/${orgId}/projects/${campId}/visitassignments/${visitAssId}/assignees/${assigneeId}`
      )
      .then(() => {
        dispatch(assigneeRemoved([visitAssId, assigneeId]));
      });
  };

  const setAssigneeTags = (
    assigneeId: number,
    prioritized_tags: ZetkinTag[],
    excluded_tags: ZetkinTag[]
  ) => {
    dispatch(assigneeConfigure([visitAssId, assigneeId]));
    apiClient
      .patch<ZetkinVisitAssignee>(
        `/beta/orgs/${orgId}/projects/${campId}/visitassignments/${visitAssId}/assignees/${assigneeId}`,
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
      .then((data: ZetkinVisitAssignee) => {
        dispatch(assigneeConfigured([visitAssId, data]));
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
