import { BodySchema } from 'pages/api/callAssignments/setCallerTags';
import { CallAssignmentCaller } from '../apiTypes';
import Fuse from 'fuse.js';
import { RootState } from 'core/store';
import { useApiClient } from 'core/hooks';
import { useStore } from 'react-redux';
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
  const store = useStore<RootState>();

  const addCaller = (callerId: number): PromiseFuture<CallAssignmentCaller> => {
    store.dispatch(callerAdd([assignmentId, callerId]));
    const promise = apiClient
      .put<CallAssignmentCaller>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/callers/${callerId}`
      )
      .then((data) => {
        store.dispatch(callerAdded([assignmentId, data]));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const getCallers = (): IFuture<CallAssignmentCaller[]> => {
    const state = store.getState();
    const callersList = state.callAssignments.callersById[assignmentId];

    if (callersList) {
      return new RemoteListFuture(callersList);
    }

    store.dispatch(callersLoad(assignmentId));
    const promise = fetch(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}/callers`
    )
      .then((res) => res.json())
      .then((data: { data: CallAssignmentCaller[] }) => {
        store.dispatch(callersLoaded({ callers: data.data, id: assignmentId }));
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
    store.dispatch(callerRemove([assignmentId, callerId]));
    apiClient
      .delete(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/callers/${callerId}`
      )
      .then(() => {
        store.dispatch(callerRemoved([assignmentId, callerId]));
      });
  };

  const setCallerTags = (
    callerId: number,
    prioTags: ZetkinTag[],
    excludedTags: ZetkinTag[]
  ) => {
    store.dispatch(callerConfigure([assignmentId, callerId]));
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
        store.dispatch(callerConfigured([assignmentId, data]));
      });
  };

  return {
    addCaller,
    ...getFilteredCallers(),
    removeCaller,
    setCallerTags,
  };
}
