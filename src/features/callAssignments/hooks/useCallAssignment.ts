import { CallAssignmentData } from '../apiTypes';
import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import { useApiClient, useEnv } from 'core/hooks';

interface UseCallAssignmentReturn {
  data: ZetkinCallAssignment | null;
  setCallerNotesEnabled: (enabled: boolean) => void;
  setTargetDetailsExposed: (targetDetailsExposed: boolean) => void;
}

export default function useCallAssignment(
  orgId: number,
  assignmentId: number
): UseCallAssignmentReturn {
  const env = useEnv();
  const store = env.store;
  const state = store.getState();
  const apiClient = useApiClient();

  const getData = (): IFuture<CallAssignmentData> => {
    const caItem = state.callAssignments.assignmentList.items.find(
      (item) => item.id == assignmentId
    );

    if (!caItem || shouldLoad(caItem)) {
      store.dispatch(callAssignmentLoad(assignmentId));
      const promise = apiClient
        .get<CallAssignmentData>(
          `/api/orgs/${orgId}/call_assignments/${assignmentId}`
        )
        .then((data: CallAssignmentData) => {
          store.dispatch(callAssignmentLoaded(data));
          return data;
        });

      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(caItem);
    }
  };

  const updateCallAssignment = (
    data: Partial<CallAssignmentData>
  ): IFuture<CallAssignmentData> => {
    const mutatingAttributes = Object.keys(data);

    store.dispatch(callAssignmentUpdate([assignmentId, mutatingAttributes]));
    const promise = apiClient
      .patch<CallAssignmentData>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}`,
        data
      )
      .then((data: CallAssignmentData) => {
        store.dispatch(callAssignmentUpdated([data, mutatingAttributes]));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const setCallerNotesEnabled = (enabled: boolean) => {
    updateCallAssignment({
      disable_caller_notes: !enabled,
    });
  };

  const setTargetDetailsExposed = (exposeTargetDetails: boolean) => {
    updateCallAssignment({
      expose_target_details: exposeTargetDetails,
    });
  };

  return {
    ...getData(),
    setCallerNotesEnabled,
    setTargetDetailsExposed,
  };
}
