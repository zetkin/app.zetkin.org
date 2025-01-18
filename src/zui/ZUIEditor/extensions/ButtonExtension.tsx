/* eslint-disable @typescript-eslint/no-namespace */
import { TextSelection } from '@remirror/pm/state';
import {
  ApplySchemaAttributes,
  legacyCommand as command, //Because of NEXTjs, see Remirror docs
  CommandFunction,
  extension,
  ExtensionTag,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  omitExtraAttributes,
} from 'remirror';

type ButtonOptions = {
  href: string;
};

@extension<ButtonOptions>({ defaultOptions: { href: 'kjhkjh' } })
class ButtonExtension extends NodeExtension<ButtonOptions> {
  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      content: 'text*',
      draggable: false,
      group: 'block',
      inline: false,
      selectable: true,
      ...override,
      attrs: {
        ...extra.defaults(),
        href: {
          default: null,
        },
      },
      parseDOM: [
        {
          getAttrs: (element) => {
            return extra.parse(element);
          },
          tag: 'div',
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        const attrs = omitExtraAttributes(node.attrs, extra);
        return [
          'div',
          {
            ...extra.dom(node),
            ...attrs,
            class: 'zui-editor zbutton-container',
          },
          [
            'div',
            {
              class: 'zui-editor zbutton-button',
            },
            0,
          ],
        ];
      },
    };
  }

  createTags() {
    return [ExtensionTag.Block, ExtensionTag.FormattingNode];
  }

  get name() {
    return 'zbutton' as const;
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  setButtonHref(pos: number, href: string): CommandFunction {
    return ({ dispatch, tr }) => {
      const resolved = tr.doc.resolve(pos);
      tr.setNodeAttribute(resolved.before(), 'href', href);
      dispatch?.(tr);
      return true;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  setButtonText(pos: number, text: string): CommandFunction {
    return ({ dispatch, tr }) => {
      const newTextNode = this.type.schema.text(text);
      const resolved = tr.doc.resolve(pos);

      tr.replaceWith(resolved.start(), resolved.end(), newTextNode);

      dispatch?.(tr);
      return true;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  toggleButton(): CommandFunction {
    return (props) => {
      const { dispatch, state, tr } = props;
      const newNode = this.type.create(
        null,
        this.type.schema.text('Foo button')
      );
      if (dispatch) {
        const pos = state.selection.$from.pos;
        const parentOffset = state.doc.resolve(pos).parentOffset;
        const blockLength = 1;

        tr.insert(pos - parentOffset - blockLength, newNode);

        const resolved = tr.doc.resolve(pos);
        tr.setSelection(
          TextSelection.create(tr.doc, resolved.start(), resolved.end())
        );
        dispatch(tr);
      }

      return true;
    };
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      zbutton: ButtonExtension;
    }
  }
}

export default ButtonExtension;
