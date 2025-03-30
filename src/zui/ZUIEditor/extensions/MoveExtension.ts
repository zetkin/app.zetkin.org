import { TextSelection } from '@remirror/pm/state';
import {
  CommandFunction,
  extension,
  legacyCommand as command,
  PlainExtension,
  isNodeSelection,
} from 'remirror';

@extension({ customHandlerKeys: [], defaultOptions: {}, staticKeys: [] })
class MoveExtension extends PlainExtension {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  moveBlockDown(): CommandFunction {
    return (props) => {
      const { dispatch, state, tr } = props;

      const selection = state.selection;

      if (isNodeSelection(selection)) {
        const node = selection.node;

        if (node == tr.doc.lastChild) {
          return false;
        }

        const posBeforeSelected = selection.$anchor.before(1);
        const posAfterSelected = selection.$head.after(1);

        const resolvedNextNode = tr.doc.resolve(posAfterSelected + 1);
        const posAfterNextNode = resolvedNextNode.after(1);

        tr.insert(posAfterNextNode, node);
        tr.delete(posBeforeSelected, posAfterSelected);

        dispatch?.(tr);

        return true;
      } else {
        const pos = selection.$head.pos;
        const resolved = tr.doc.resolve(pos);
        const node = resolved.node(1);

        if (node == tr.doc.lastChild) {
          return false;
        }

        const posBeforeSelected = resolved.before(1);
        const posAfterSelected = resolved.after(1);

        const resolvedNextNode = tr.doc.resolve(posAfterSelected + 1);
        const posAfterNextNode = resolvedNextNode.after(1);

        tr.insert(posAfterNextNode, node);
        tr.delete(posBeforeSelected, posAfterSelected);

        const nextNode = resolvedNextNode.node();

        let nextNodeSize = 0;
        if (nextNode?.type.name == 'doc') {
          nextNodeSize = 2;
        } else {
          nextNodeSize = nextNode?.nodeSize;
        }

        const textSelection = TextSelection.create(
          tr.doc,
          resolved.before(1) + nextNodeSize + resolved.parentOffset
        );
        tr.setSelection(textSelection);
        tr.scrollIntoView();

        dispatch?.(tr);

        return true;
      }
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  moveBlockUp(): CommandFunction {
    return (props) => {
      const { dispatch, state, tr } = props;

      const selection = state.selection;
      if (isNodeSelection(selection)) {
        const node = selection.node;

        if (node == tr.doc.firstChild) {
          return false;
        }

        const posBeforeSelected = selection.$anchor.before(1);
        const posAfterSelected = selection.$head.after(1);

        const resolvedEndOfPreviousNode = tr.doc.resolve(posBeforeSelected - 1);
        const posBeforeNodeBefore = resolvedEndOfPreviousNode.before(1);

        tr.delete(posBeforeSelected, posAfterSelected);
        tr.insert(posBeforeNodeBefore, node);

        dispatch?.(tr);

        return true;
      } else {
        const pos = selection.$head.pos;
        const resolved = tr.doc.resolve(pos);
        const node = resolved.node(1);

        if (node == tr.doc.firstChild) {
          return false;
        }

        const posBeforeSelected = resolved.before(1);
        const posAfterSelected = resolved.after(1);

        const resolvedEndOfPreviousNode = tr.doc.resolve(posBeforeSelected - 1);
        const posBeforeNodeBefore = resolvedEndOfPreviousNode.before(1);

        tr.delete(posBeforeSelected, posAfterSelected);
        tr.insert(posBeforeNodeBefore, node);

        const textSelection = TextSelection.create(
          tr.doc,
          posBeforeNodeBefore + resolved.parentOffset
        );
        tr.setSelection(textSelection);

        dispatch?.(tr);
        tr.scrollIntoView();

        return true;
      }
    };
  }

  get name(): string {
    return 'zmove';
  }
}

export default MoveExtension;
