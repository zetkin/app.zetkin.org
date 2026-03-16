import { NodeSelection } from '@remirror/pm/state';
import { EditorView } from 'remirror';
import { EditorState, ProsemirrorNode, Selection } from '@remirror/pm';

export type SelectionState = {
  isNodeSelection: boolean;
  node: ProsemirrorNode | null;
  selection: Selection;
  state: EditorState;
  view: EditorView;
};

export const recordSelectionState = (view: EditorView): SelectionState => {
  const { state } = view;
  const { selection } = state;

  const isNodeSelection = selection instanceof NodeSelection;
  const node = isNodeSelection ? selection.node : null;

  return {
    isNodeSelection,
    node,
    selection,
    state,
    view,
  };
};

export const recoverSelection = (selectionState: SelectionState) => {
  if (selectionState.isNodeSelection && selectionState.node) {
    const { state: newState } = selectionState.view;

    let foundPos: number | null = null;

    newState.doc.descendants((n, p) => {
      if (n === selectionState.node) {
        foundPos = p;
        return false;
      }
      return true;
    });

    if (foundPos !== null) {
      selectionState.view.dispatch(
        newState.tr.setSelection(NodeSelection.create(newState.doc, foundPos))
      );
    }
  }

  selectionState.view.focus();
};
