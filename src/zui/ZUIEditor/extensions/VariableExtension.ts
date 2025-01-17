import {
  ApplySchemaAttributes,
  legacyCommand as command,
  CommandFunction,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  omitExtraAttributes,
} from 'remirror';

type VariableName = 'first_name' | 'last_name' | 'full_name';

export default class VariableExtension extends NodeExtension {
  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      atom: true,
      draggable: true,
      group: 'inline',
      inline: true,
      marks: '',
      selectable: true,
      ...override,
      attrs: {
        ...extra.defaults(),
        name: {
          default: 'first_name',
        },
      },
      parseDOM: [
        {
          getAttrs: (element) => {
            return {
              ...extra.parse(element),
              name: element.getAttribute('name'),
            };
          },
          tag: 'span',
        },
      ],
      toDOM: (node) => {
        const attrs = omitExtraAttributes(node.attrs, extra);
        const name = attrs.name as string;
        return [
          'span',
          {
            ...extra.dom(node),
            ...attrs,
            class: 'zvariable',
            type: 'variable',
          },
          name,
        ];
      },
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  insertVariable(name: VariableName, pos?: number): CommandFunction {
    return ({ dispatch, state, tr }) => {
      const node = this.type.create({ name });
      pos ||= state.selection.$head.pos;
      tr.insert(pos, node);
      dispatch?.(tr);
      return true;
    };
  }

  get name() {
    return 'zvariable' as const;
  }
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Remirror {
    interface AllExtensions {
      zvariable: VariableExtension;
    }
  }
}
