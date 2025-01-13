import { useState } from 'react';

import { RootState } from 'core/store';
import { useAppSelector } from 'core/hooks';
import useAreaAssignment from './useAreaAssignment';
import useAreaAssignmentMutations from './useAreaAssignmentMutations';

export default function useAreaAssignmentInstructions(
  orgId: number,
  areaAssId: string
) {
  const { updateAreaAssignment } = useAreaAssignmentMutations(orgId, areaAssId);
  const { data: canvassAssignment } = useAreaAssignment(orgId, areaAssId);
  const areaAssignmentsSlice = useAppSelector(
    (state: RootState) => state.areaAssignments
  );
  const canvassAssignmentItems = areaAssignmentsSlice.areaAssignmentList.items;
  const key = `canvassInstructions-${areaAssId}`;
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
    const item = canvassAssignmentItems.find((item) => item.id === areaAssId);

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
      const saveFuture = updateAreaAssignment({
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
