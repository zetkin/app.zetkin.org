/* eslint-disable @typescript-eslint/no-namespace */
import {
  ApplySchemaAttributes,
  legacyCommand as command, //Because of NEXTjs, see Remirror docs
  CommandFunction,
  extension,
  ExtensionTag,
  getTextSelection,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  omitExtraAttributes,
  PrimitiveSelection,
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
            style: 'border: 1px solid black; padding: 5px;',
          },
          0,
        ];
      },
    };
  }
  createTags() {
    return [ExtensionTag.Block, ExtensionTag.FormattingNode];
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  insertButton(selection?: PrimitiveSelection): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create(null, this.type.schema.text('Foobar'));
      dispatch?.(tr.replaceRangeWith(from, to, node));
      return true;
    };
  }

  get name() {
    return 'zbutton' as const;
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
