import { CallAssignmentData } from '../apiTypes';
import { RootState } from 'core/store';
import { useApiClient } from 'core/hooks';
import useCallAssignment from './useCallAssignment';
import { useStore } from 'react-redux';
import { callAssignmentUpdate, callAssignmentUpdated } from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';

interface UseCallerInstructionsReturn {
  hasEmptyInstructions: boolean;
  hasUnsavedChanges: boolean;
  instructions: string;
  isSaving: boolean;
  revert: () => void;
  setInstructions: (instructions: string) => void;
  save: () => IFuture<CallAssignmentData>;
}

export default function useCallerInstructions(
  orgId: number,
  assignmentId: number
): UseCallerInstructionsReturn {
  const store = useStore<RootState>();
  const apiClient = useApiClient();
  const key = `callerInstructions-${assignmentId}`;
  const callAssignmentItems =
    store.getState().callAssignments.assignmentList.items;
  const { data } = useCallAssignment(orgId, assignmentId);

  const getInstructions = () => {
    const lsInstructions = localStorage.getItem(key);

    if (lsInstructions === null) {
      if (data) {
        localStorage.setItem(key, data.instructions);
        return data.instructions;
      }
    }
    return lsInstructions || '';
  };

  const revert = () => {
    if (!data) {
      return;
    }

    localStorage.setItem(key, data?.instructions);
  };

  const setInstructions = (instructions: string): void => {
    localStorage.setItem(key, instructions);
  };

  const save = (): IFuture<CallAssignmentData> => {
    const lsInstructions = localStorage.getItem(key) || '';
    const saveFuture = updateCallAssignment({
      instructions: lsInstructions,
    });

    return saveFuture;
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

  const hasEmptyInstrunctions = (): boolean => {
    return data?.instructions === '';
  };

  const hasUnsavedChanges = (): boolean => {
    if (!data) {
      return false;
    }

    const lsInstructions = localStorage.getItem(key)?.trim() || '';
    const dataInstructions = data.instructions.trim();

    return dataInstructions != lsInstructions;
  };

  const isSaving = (): boolean => {
    const item = callAssignmentItems.find((item) => item.id === assignmentId);

    if (!item) {
      return false;
    }

    return item.mutating.includes('instructions');
  };

  return {
    hasEmptyInstructions: hasEmptyInstrunctions(),
    hasUnsavedChanges: hasUnsavedChanges(),
    instructions: getInstructions(),
    isSaving: isSaving(),
    revert,
    save,
    setInstructions,
  };
}
