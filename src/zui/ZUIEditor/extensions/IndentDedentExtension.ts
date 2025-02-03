import {
  extension,
  legacyCommand as command,
  PlainExtension,
  CommandFunction,
} from 'remirror';
import { dedentList, indentList } from 'remirror/extensions';

@extension({ customHandlerKeys: [], defaultOptions: {}, staticKeys: [] })
class IndentDedentExtension extends PlainExtension {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  dedent(): CommandFunction {
    return (props) => {
      const { dispatch, tr } = props;
      if (dedentList(tr)) {
        dispatch?.(tr.scrollIntoView());
        return true;
      }

      return false;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  indent(): CommandFunction {
    return (props) => {
      const { dispatch, tr } = props;

      if (indentList(tr)) {
        dispatch?.(tr.scrollIntoView());
        return true;
      }

      return false;
    };
  }

  get name(): string {
    return 'zindentdedent';
  }
}

export default IndentDedentExtension;
