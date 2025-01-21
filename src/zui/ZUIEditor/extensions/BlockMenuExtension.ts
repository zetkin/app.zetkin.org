import { Suggester } from '@remirror/pm/suggest';
import {
  legacyCommand as command,
  CommandFunction,
  extension,
  Handler,
  PlainExtension,
} from 'remirror';

type BlockMenuOptions = {
  blockFactories: Record<string, CommandFunction>;
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
        isValidPosition: (range) => {
          return range.$from.parentOffset == 0;
        },
        name: 'slash',
        onChange: (details, tr) => {
          const resolved = tr.doc.resolve(details.range.to);
          const exited = !!details.exitReason;
          const inParagraph = resolved.node(1).type.name == 'paragraph';
          this.options.onBlockQuery(
            exited || !inParagraph ? null : details.query.full
          );
        },
      },
    ];
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  insertBlock(type: string): CommandFunction {
    return (props) => {
      const { state, tr } = props;
      const resolved = state.doc.resolve(state.selection.$head.pos);
      tr.deleteRange(resolved.start(), resolved.end());

      const factoryCommand = this.options.blockFactories[type];
      return factoryCommand(props);
    };
  }

  get name(): string {
    return 'zblockmenu';
  }
}

export default BlockMenuExtension;
