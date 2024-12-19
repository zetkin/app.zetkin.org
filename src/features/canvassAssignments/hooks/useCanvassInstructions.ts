import { useState } from 'react';

import { RootState } from 'core/store';
import { useAppSelector } from 'core/hooks';
import useCanvassAssignmentMutations from './useCanvassAssignmentMutations';
import useCanvassAssignment from './useCanvassAssignment';

export default function useCanvassInstructions(
  orgId: number,
  canvassAssId: string
) {
  const { updateCanvassAssignment } = useCanvassAssignmentMutations(
    orgId,
    canvassAssId
  );
  const { data: canvassAssignment } = useCanvassAssignment(orgId, canvassAssId);
  const canvassAssignmentSlice = useAppSelector(
    (state: RootState) => state.canvassAssignments
  );
  const canvassAssignmentItems =
    canvassAssignmentSlice.canvassAssignmentList.items;
  const key = `callerInstructions-${canvassAssId}`;
  //Used to force re-render
  const [pointlessState, setPointlessState] = useState(0);

  const getInstructions = () => {
    const lsInstructions = localStorage.getItem(key);

    if (lsInstructions === null) {
      if (canvassAssignment) {
        localStorage.setItem(key, canvassAssignment.instructions);
        return canvassAssignment.instructions;
      }
    }
    return lsInstructions || '';
  };

  const isSaving = (): boolean => {
    const item = canvassAssignmentItems.find(
      (item) => item.id === canvassAssId
    );

    if (!item) {
      return false;
    }

    return item.mutating.includes('instructions');
  };

  const hasUnsavedChanges = (): boolean => {
    if (!canvassAssignment) {
      return false;
    }

    const lsInstructions = localStorage.getItem(key)?.trim() || '';
    const dataInstructions = canvassAssignment.instructions?.trim();

    return dataInstructions != lsInstructions;
  };

  const hasEmptyInstrunctions = (): boolean => {
    return canvassAssignment?.instructions === '';
  };

  const instructions = getInstructions();
  const saving = isSaving();
  const unsavedChanges = hasUnsavedChanges();

  return {
    hasNewText: unsavedChanges,
    instructions,
    isSaved: !saving && !unsavedChanges && instructions !== '',
    isSaving: saving,
    isUnsaved: !saving && unsavedChanges && !hasEmptyInstrunctions(),
    revert: () => {
      if (!canvassAssignment) {
        return;
      }

      localStorage.setItem(key, canvassAssignment?.instructions);
      //TODO: remove this ugly ass forced re-render by making ZUITextEditor better
      setPointlessState(pointlessState + 1);
    },
    save: () => {
      const lsInstructions = localStorage.getItem(key) || '';
      const saveFuture = updateCanvassAssignment({
        instructions: lsInstructions,
      });

      return saveFuture;
    },
    setInstructions: (instructions: string): void => {
      localStorage.setItem(key, instructions);
      //TODO: remove this ugly ass forced re-render by making ZUITextEditor better
      setPointlessState(pointlessState + 1);
    },
  };
}
