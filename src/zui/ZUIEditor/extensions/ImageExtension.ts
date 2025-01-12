import {
  ApplySchemaAttributes,
  legacyCommand as command,
  CommandFunction,
  extension,
  Handler,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  omitExtraAttributes,
} from 'remirror';

import { ZetkinFile } from 'utils/types/zetkin';

type ImageOptions = {
  onCreate?: Handler<() => void>;
};

@extension({
  customHandlerKeys: [],
  defaultOptions: {},
  handlerKeys: ['onCreate'],
  staticKeys: [],
})
export default class ImageExtension extends NodeExtension<ImageOptions> {
  createAndPick() {
    const node = this.type.create();
    this.options.onCreate();
    return node;
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      draggable: false,
      group: 'block',
      inline: false,
      selectable: true,
      ...override,
      attrs: {
        ...extra.defaults(),
        src: { default: null },
      },
      parseDOM: [
        {
          getAttrs: (element) => {
            return extra.parse(element);
          },
          tag: 'img',
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        const attrs = omitExtraAttributes(node.attrs, extra);
        return [
          'img',
          {
            ...extra.dom(node),
            ...attrs,
            class: 'zimage-image',
          },
        ];
      },
    };
  }

  get name() {
    return 'zimage' as const;
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  setImageFile(file: ZetkinFile | null): CommandFunction {
    return (props) => {
      props.dispatch?.(
        props.tr.setNodeAttribute(
          props.state.selection.$from.pos,
          'src',
          file?.url ?? null
        )
      );
      return true;
    };
  }
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Remirror {
    interface AllExtensions {
      zimage: ImageExtension;
    }
  }
}
