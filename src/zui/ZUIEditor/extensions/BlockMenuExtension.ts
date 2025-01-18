import { Node } from '@remirror/pm/model';
import { TextSelection } from '@remirror/pm/state';
import { Suggester } from '@remirror/pm/suggest';
import {
  legacyCommand as command,
  CommandFunction,
  extension,
  getActiveNode,
  Handler,
  PlainExtension,
} from 'remirror';
import { ParagraphExtension } from 'remirror/extensions';

type BlockMenuOptions = {
  blockFactories: Record<string, () => Node>;
  onBlockQuery?: Handler<(query: string | null) => void>;
};

@extension<BlockMenuOptions>({
  customHandlerKeys: [],
  defaultOptions: { blockFactories: {} },
  handlerKeys: ['onBlockQuery'],
  staticKeys: [],
})
class BlockMenuExtension extends PlainExtension<BlockMenuOptions> {
  createSuggesters(): Suggester[] | Suggester {
    return [
      {
        char: '/',
        isValidPosition: (range) => range.$from.parentOffset == 0,
        name: 'slash',
        onChange: (details) => {
          const exited = !!details.exitReason;
          this.options.onBlockQuery(exited ? null : details.query.full);
        },
      },
    ];
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  insertBlock(type: string): CommandFunction {
    return ({ dispatch, state, tr }) => {
      const oldNode = getActiveNode({
        state,
        type: 'paragraph',
      });
      if (oldNode) {
        const factory = this.options.blockFactories[type];
        if (factory) {
          const newNode = factory();
          if (dispatch && newNode) {
            tr = tr.replaceWith(oldNode.pos, oldNode.end, newNode);
            tr = tr.setSelection(
              TextSelection.create(
                tr.doc,
                oldNode.pos + 1,
                oldNode.pos + newNode.nodeSize - 1
              )
            );
            dispatch(tr);
          }

          return true;
        }
      }
      return false;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  insertEmptyParagraph(pos: number): CommandFunction {
    return ({ dispatch, tr }) => {
      const node = this.store.getExtension(ParagraphExtension).type.create();
      dispatch?.(tr.insert(pos, node));
      return true;
    };
  }

  get name(): string {
    return 'zblockmenu';
  }
}

export default BlockMenuExtension;
