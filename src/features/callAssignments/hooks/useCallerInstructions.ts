import { CallAssignmentData } from '../apiTypes';
import { RootState } from 'core/store';
import useCallAssignment from './useCallAssignment';
import { useState } from 'react';
import { callAssignmentUpdate, callAssignmentUpdated } from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseCallerInstructionsReturn {
  hasNewText: boolean;
  instructions: string;
  isSaved: boolean;
  isSaving: boolean;
  isUnsaved: boolean;
  revert: () => void;
  setInstructions: (instructions: string) => void;
  save: () => IFuture<CallAssignmentData>;
}

export default function useCallerInstructions(
  orgId: number,
  assignmentId: number
): UseCallerInstructionsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const key = `callerInstructions-${assignmentId}`;
  const callAssignmentSlice = useAppSelector(
    (state: RootState) => state.callAssignments
  );
  const callAssignmentItems = callAssignmentSlice.assignmentList.items;
  const { data } = useCallAssignment(orgId, assignmentId);

  //Used to force re-render
  const [pointlessState, setPointlessState] = useState(0);

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
    //TODO: remove this ugly ass forced re-render by making ZUITextEditor better
    setPointlessState(pointlessState + 1);
  };

  const setInstructions = (instructions: string): void => {
    localStorage.setItem(key, instructions);
    //TODO: remove this ugly ass forced re-render by making ZUITextEditor better
    setPointlessState(pointlessState + 1);
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

    dispatch(callAssignmentUpdate([assignmentId, mutatingAttributes]));
    const promise = apiClient
      .patch<CallAssignmentData>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}`,
        data
      )
      .then((data: CallAssignmentData) => {
        dispatch(callAssignmentUpdated([data, mutatingAttributes]));
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

  const saving = isSaving();
  const instructions = getInstructions();
  const unsavedChanges = hasUnsavedChanges();

  return {
    hasNewText: unsavedChanges,
    instructions,
    isSaved: !saving && !unsavedChanges && instructions !== '',
    isSaving: saving,
    isUnsaved: !saving && unsavedChanges && !hasEmptyInstrunctions(),
    revert,
    save,
    setInstructions,
  };
}
