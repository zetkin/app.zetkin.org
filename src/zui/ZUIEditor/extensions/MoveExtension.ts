import {
  CommandFunction,
  extension,
  legacyCommand as command,
  PlainExtension,
  ProsemirrorNode,
} from 'remirror';

@extension({ customHandlerKeys: [], defaultOptions: {}, staticKeys: [] })
class MoveExtension extends PlainExtension {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  moveBlock(node: ProsemirrorNode, pos: number): CommandFunction {
    return (props) => {
      const { dispatch, tr } = props;

      dispatch?.(tr.insert(pos, node));

      return true;
    };
  }

  get name(): string {
    return 'zmove';
  }
}

export default MoveExtension;
