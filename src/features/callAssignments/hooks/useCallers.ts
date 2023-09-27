import { CallAssignmentCaller } from '../apiTypes';
import Fuse from 'fuse.js';
import { RootState } from 'core/store';
import { useStore } from 'react-redux';
import { callersLoad, callersLoaded } from '../store';
import {
  IFuture,
  PromiseFuture,
  RemoteListFuture,
  ResolvedFuture,
} from 'core/caching/futures';

interface UseCallersReturn {
  data: CallAssignmentCaller[] | null;
  error: unknown | null;
  isLoading: boolean;
}

export default function useCallers(
  orgId: number,
  assignmentId: number
): UseCallersReturn {
  const store = useStore<RootState>();

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

  return {
    ...getFilteredCallers(),
  };
}
