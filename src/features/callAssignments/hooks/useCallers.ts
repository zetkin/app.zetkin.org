import Fuse from 'fuse.js';
import { MutableRefObject, useRef, useState } from 'react';

import { BodySchema } from 'pages/api/callAssignments/setCallerTags';
import { CallAssignmentCaller } from '../apiTypes';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import {
  callerAdd,
  callerAdded,
  callerConfigure,
  callerConfigured,
  callerRemove,
  callerRemoved,
  callersLoad,
  callersLoaded,
} from '../store';
import { IFuture, PromiseFuture, ResolvedFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinPerson, ZetkinTag } from 'utils/types/zetkin';

interface UseCallersReturn {
  addCaller: (callerId: number) => PromiseFuture<CallAssignmentCaller>;
  filteredCallersFuture: IFuture<CallAssignmentCaller[]>;
  isCaller: (person: ZetkinPerson) => boolean;
  removeCaller: (callerId: number) => void;
  searchString: string;
  selectedCaller: CallAssignmentCaller | null;
  selectInputRef: MutableRefObject<HTMLInputElement | undefined>;
  setCallerTags: (
    callerId: number,
    prioTags: ZetkinTag[],
    excludedTags: ZetkinTag[]
  ) => void;
  setSearchString: (searchString: string) => void;
  setSelectedCaller: (caller: CallAssignmentCaller | null) => void;
}

export default function useCallers(
  orgId: number,
  assignmentId: number
): UseCallersReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const callAssignments = useAppSelector((state) => state.callAssignments);
  const callersList = callAssignments.callersById[assignmentId];

  const [searchString, setSearchString] = useState('');
  const [selectedCaller, setSelectedCaller] =
    useState<CallAssignmentCaller | null>(null);
  const selectInputRef = useRef<HTMLInputElement>();

  const addCaller = (callerId: number): PromiseFuture<CallAssignmentCaller> => {
    dispatch(callerAdd([assignmentId, callerId]));
    const promise = apiClient
      .put<CallAssignmentCaller>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/callers/${callerId}`
      )
      .then((data) => {
        dispatch(callerAdded([assignmentId, data]));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const allCallersFuture = loadListIfNecessary(callersList, dispatch, {
    actionOnLoad: () => callersLoad(assignmentId),
    actionOnSuccess: (data) => callersLoaded([data, assignmentId]),
    loader: () =>
      apiClient.get<CallAssignmentCaller[]>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/callers`
      ),
  });

  let filteredCallersFuture: IFuture<CallAssignmentCaller[]>;
  if (allCallersFuture.isLoading) {
    filteredCallersFuture = allCallersFuture;
  }

  if (allCallersFuture.data && searchString) {
    const fuse = new Fuse(allCallersFuture.data, {
      includeScore: true,
      keys: ['first_name', 'last_name'],
      threshold: 0.4,
    });

    const filteredCallers = fuse
      .search(searchString)
      .map((fuseResult) => fuseResult.item);

    filteredCallersFuture = new ResolvedFuture(filteredCallers);
  } else {
    filteredCallersFuture = new ResolvedFuture(allCallersFuture.data || []);
  }

  const removeCaller = (callerId: number) => {
    dispatch(callerRemove([assignmentId, callerId]));
    apiClient
      .delete(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/callers/${callerId}`
      )
      .then(() => {
        dispatch(callerRemoved([assignmentId, callerId]));
      });
  };

  const setCallerTags = (
    callerId: number,
    prioTags: ZetkinTag[],
    excludedTags: ZetkinTag[]
  ) => {
    dispatch(callerConfigure([assignmentId, callerId]));
    apiClient
      .post<CallAssignmentCaller, BodySchema>(
        `/api/callAssignments/setCallerTags`,
        {
          assignmentId,
          callerId,
          excludedTags: excludedTags.map((tag) => tag.id),
          orgId,
          prioTags: prioTags.map((tag) => tag.id),
        }
      )
      .then((data: CallAssignmentCaller) => {
        dispatch(callerConfigured([assignmentId, data]));
      });
  };

  const isCaller = (person: ZetkinPerson) =>
    !!filteredCallersFuture.data?.find((caller) => caller.id == person.id);

  return {
    addCaller,
    filteredCallersFuture,
    isCaller,
    removeCaller,
    searchString,
    selectInputRef,
    selectedCaller,
    setCallerTags,
    setSearchString,
    setSelectedCaller,
  };
}
