import { NodeSelection, TextSelection } from '@remirror/pm/state';
import {
  CommandFunction,
  CommandFunctionProps,
  extension,
  isNodeSelection,
  legacyCommand as command,
  PlainExtension,
  ProsemirrorNode,
} from 'remirror';

@extension({ customHandlerKeys: [], defaultOptions: {}, staticKeys: [] })
class MoveExtension extends PlainExtension {
  move(props: CommandFunctionProps, down?: boolean) {
    const { dispatch, state, tr } = props;
    const { selection, doc } = state;

    let node: ProsemirrorNode | null = null;
    let from: number;
    let to: number;

    if (isNodeSelection(selection)) {
      node = selection.node;
      from = selection.$anchor.before(1);
      to = selection.$head.after(1);
    } else {
      const $pos = tr.doc.resolve(selection.$head.pos);
      node = $pos.node(1);
      from = $pos.before(1);
      to = $pos.after(1);
    }

    if ((down && to >= doc.content.size) || (!down && from <= 0)) {
      return false;
    }

    let relativeAnchor: number | null = null;
    let relativeHead: number | null = null;
    let isTextSelection = false;

    if (!isNodeSelection(selection)) {
      isTextSelection = true;

      relativeAnchor = selection.anchor - from;
      relativeHead = selection.head - from;
    }

    tr.delete(from, to);

    const $target = doc.resolve(down ? to + 1 : from - 1);
    const targetPos = down ? $target.after(1) : $target.before(1);
    const insertPos = tr.mapping.map(targetPos);

    tr.insert(insertPos, node);

    if (isTextSelection && relativeAnchor !== null && relativeHead !== null) {
      const anchor = insertPos + relativeAnchor;
      const head = insertPos + relativeHead;

      tr.setSelection(TextSelection.create(tr.doc, anchor, head));
    } else {
      tr.setSelection(NodeSelection.create(tr.doc, insertPos));
    }

    dispatch?.(tr);
    return true;
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  moveBlockDown(): CommandFunction {
    return (props) => {
      try {
        return this.move(props, true);
      } catch (e) {
        return false;
      }
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  moveBlockUp(): CommandFunction {
    return (props) => {
      try {
        return this.move(props, false);
      } catch (e) {
        return false;
      }
    };
  }

  get name(): string {
    return 'zmove';
  }
}

export default MoveExtension;
