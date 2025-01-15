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
  onCreate?: Handler<(pos: number) => void>;
  onPick?: Handler<(pos: number) => void>;
};

@extension({
  customHandlerKeys: [],
  defaultOptions: {},
  handlerKeys: ['onCreate', 'onPick'],
  staticKeys: [],
})
export default class ImageExtension extends NodeExtension<ImageOptions> {
  createAndPick() {
    const pos = this.store.getState().selection.$from.pos;
    const parentOffset = this.store.getState().doc.resolve(pos).parentOffset;
    const blockLength = 1;

    const node = this.type.create();
    this.options.onCreate(pos - parentOffset - blockLength);

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
            return {
              ...extra.parse(element),
              src: element.getAttribute('src'),
            };
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
  pickImage(pos: number): CommandFunction {
    return () => {
      this.options.onPick(pos);
      return true;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  setImageFile(file: ZetkinFile | null, pos: number): CommandFunction {
    return (props) => {
      props.dispatch?.(
        props.tr.setNodeAttribute(pos, 'src', file?.url ?? null)
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
