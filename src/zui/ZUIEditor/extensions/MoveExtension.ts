import { TextSelection } from '@remirror/pm/state';
import {
  CommandFunction,
  extension,
  legacyCommand as command,
  PlainExtension,
} from 'remirror';

@extension({ customHandlerKeys: [], defaultOptions: {}, staticKeys: [] })
class MoveExtension extends PlainExtension {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  moveBlockDown(): CommandFunction {
    return (props) => {
      const { dispatch, state, tr } = props;

      const pos = state.selection.$head.pos;
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

      const sizeOfNode = tr.doc.resolve(resolved.start()).node().nodeSize;
      const textSelection = TextSelection.create(
        tr.doc,
        posBeforeSelected + sizeOfNode + resolved.parentOffset
      );
      tr.setSelection(textSelection);

      dispatch?.(tr);

      return true;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  moveBlockUp(): CommandFunction {
    return (props) => {
      const { dispatch, state, tr } = props;

      const pos = state.selection.$head.pos;
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

      return true;
    };
  }

  get name(): string {
    return 'zmove';
  }
}

export default MoveExtension;
