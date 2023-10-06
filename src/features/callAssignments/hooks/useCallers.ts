import { BodySchema } from 'pages/api/callAssignments/setCallerTags';
import { CallAssignmentCaller } from '../apiTypes';
import Fuse from 'fuse.js';
import { ZetkinTag } from 'utils/types/zetkin';
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
import {
  IFuture,
  PromiseFuture,
  RemoteListFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseCallersReturn {
  addCaller: (callerId: number) => PromiseFuture<CallAssignmentCaller>;
  data: CallAssignmentCaller[] | null;
  error: unknown | null;
  isLoading: boolean;
  removeCaller: (callerId: number) => void;
  setCallerTags: (
    callerId: number,
    prioTags: ZetkinTag[],
    excludedTags: ZetkinTag[]
  ) => void;
}

export default function useCallers(
  orgId: number,
  assignmentId: number
): UseCallersReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const callAssignments = useAppSelector((state) => state.callAssignments);

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

  const getCallers = (): IFuture<CallAssignmentCaller[]> => {
    const callersList = callAssignments.callersById[assignmentId];

    if (callersList) {
      return new RemoteListFuture(callersList);
    }

    dispatch(callersLoad(assignmentId));
    const promise = fetch(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}/callers`
    )
      .then((res) => res.json())
      .then((data: { data: CallAssignmentCaller[] }) => {
        dispatch(callersLoaded({ callers: data.data, id: assignmentId }));
        return data.data;
      });

    return new PromiseFuture(promise);
  };

  const getFilteredCallers = (
    searchString = ''
  ): IFuture<CallAssignmentCaller[]> => {
    const callers = getCallers();

    if (callers.isLoading) {
      return callers;
    }

    if (callers.data && searchString) {
      const fuse = new Fuse(callers.data, {
        includeScore: true,
        keys: ['first_name', 'last_name'],
        threshold: 0.4,
      });

      const filteredCallers = fuse
        .search(searchString)
        .map((fuseResult) => fuseResult.item);

      return new ResolvedFuture(filteredCallers);
    }

    return new ResolvedFuture(callers.data || []);
  };

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

  const callersFuture = getFilteredCallers();

  return {
    addCaller,
    data: callersFuture.data,
    error: callersFuture.error,
    isLoading: callersFuture.isLoading,
    removeCaller,
    setCallerTags,
  };
}
