import { Node } from '@remirror/pm/model';
import { Suggester } from '@remirror/pm/suggest';
import {
  legacyCommand as command,
  CommandFunction,
  extension,
  getActiveNode,
  Handler,
  PlainExtension,
} from 'remirror';

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
          if (newNode) {
            const start = oldNode.start;
            dispatch?.(tr.delete(start, oldNode.end).insert(start, newNode));
          }

          return true;
        }
      }
      return false;
    };
  }

  get name(): string {
    return 'zblockmenu';
  }
}

export default BlockMenuExtension;
