/* eslint-disable @typescript-eslint/no-namespace */

import { TagParseRule } from '@remirror/pm/model';
import { TextSelection } from '@remirror/pm/state';
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
          getAttrs: (node) => {
            return {
              ...extra.parse(node),
              href: node.getAttribute('href'),
            };
          },
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

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  insertEmptyLink(): CommandFunction {
    return ({ dispatch, state, tr }) => {
      const mark = this.type.create();
      const node = this.type.schema.text(String.fromCharCode(160), [mark]);
      const pos = state.selection.$head.pos;
      tr = tr.insert(pos, node);
      tr = tr.setSelection(TextSelection.create(tr.doc, pos, pos + 1));
      dispatch?.(tr);

      return true;
    };
  }

  get name() {
    return 'zlink' as const;
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  removeAllLinksInRange(range: FromToProps): CommandFunction {
    return ({ tr, dispatch }) => {
      tr.doc.nodesBetween(range.from, range.to, (node, pos) => {
        if (node.isText) {
          const linkMark = node.marks.find(
            (mark) => mark.type.name == this.type.name
          );
          if (linkMark) {
            tr = tr.removeMark(pos, pos + node.nodeSize, this.type);
          }
        }
      });

      dispatch?.(tr);

      return true;
    };
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  @command()
  removeLink(range: FromToProps): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = range;

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
  removeUnfinishedLinks(): CommandFunction {
    return ({ tr, dispatch }) => {
      tr.doc.descendants((node, pos) => {
        if (node.isText) {
          const linkMark = node.marks.find(
            (mark) => mark.type.name == this.type.name
          );
          if (linkMark) {
            if (!linkMark.attrs.href) {
              tr = tr.removeMark(pos, pos + node.nodeSize, this.type);
              if (node.text == String.fromCharCode(160)) {
                tr = tr.delete(pos, pos + 1);
              }
            }
          }
        }
      });

      dispatch?.(tr);

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
