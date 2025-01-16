/* eslint-disable @typescript-eslint/no-namespace */

import { TagParseRule } from '@remirror/pm/model';
import {
  ApplySchemaAttributes,
  extension,
  legacyCommand as command,
  MarkExtension,
  MarkExtensionSpec,
  MarkSpecOverride,
  toggleMark,
  PrimitiveSelection,
  CommandFunction,
  getTextSelection,
  FromToProps,
  updateMark,
  ProsemirrorAttributes,
} from 'remirror';

export interface LinkOptions {
  href: string;
}

export type LinkAttributes = ProsemirrorAttributes<{
  /**
   * The link which is a required property for the link mark.
   */
  href: string;
}>;

@extension<LinkOptions>({ defaultOptions: { href: '' } })
class LinkExtension extends MarkExtension<LinkOptions> {
  createMarkSpec(
    extra: ApplySchemaAttributes,
    override: MarkSpecOverride
  ): MarkExtensionSpec {
    return {
      ...override,
      attrs: {
        ...extra.defaults(),
        href: {},
      },
      parseDOM: [
        {
          getAttrs: extra.parse,
          tag: 'a',
        } as TagParseRule,
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        return [
          'a',
          {
            ...extra.dom(node),
            href: node.attrs.href,
          },
          0,
        ];
      },
    };
  }

  get name() {
    return 'zlink' as const;
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  removeLink(selection?: PrimitiveSelection): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);

      if (!tr.doc.rangeHasMark(from, to, this.type)) {
        return false;
      }

      dispatch?.(tr.removeMark(from, to, this.type));

      return true;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  setLink(selection?: PrimitiveSelection): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      dispatch?.(tr.addMark(from, to, this.type.create()));

      return true;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  toggleLink(selection?: PrimitiveSelection): CommandFunction {
    return toggleMark({ selection, type: this.type });
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  updateLink(attrs: LinkAttributes, range: FromToProps): CommandFunction {
    return (props) => {
      const { tr } = props;

      tr.setMeta(this.name, { attrs, command: 'updateLink', range });

      return updateMark({
        attrs,
        range,
        type: this.type,
      })(props);
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  updateLinkText(range: FromToProps, linkText: string): CommandFunction {
    return (props) => {
      const { tr, dispatch } = props;

      tr.insertText(linkText, range.from, range.to);

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    };
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      zlink: LinkExtension;
    }
  }
}

export default LinkExtension;
