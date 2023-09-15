/* eslint-disable @typescript-eslint/ban-ts-comment */
import isUrl from 'is-url';
import {
  Ancestor,
  Descendant,
  Editor,
  NodeEntry,
  Range,
  Element as SlateElement,
  Text,
  Transforms,
} from 'slate';
import { BlockType, LeafType, NodeTypes, serialize } from 'remark-slate';
import isHotkey, { isKeyHotkey } from 'is-hotkey';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+shift+x': 'strikeThrough',
};

/* TODO: Resolve typescript errors */

type LinkElement = { children: Descendant[]; type: 'link'; url: string };

const toggleBlock = (editor: Editor, format: string): void => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    // @ts-ignore
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { children: [], type: format };

    // @ts-ignore
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: Editor,
  format: string,
  blockType = 'type'
): boolean => {
  const { selection } = editor;
  if (!selection) {
    return false;
  }

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        n[blockType] === format,
    })
  );

  return !!match;
};

const isLinkActive = (editor: Editor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      // @ts-ignore
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
  return !!link;
};

const isMarkActive = (editor: Editor, format: string): boolean => {
  const marks = Editor.marks(editor) as { [key: string]: unknown };
  return marks ? marks[format] === true : false;
};

const unwrapLink = (editor: Editor): void => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      // @ts-ignore
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};

const wrapLink = (editor: Editor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;

  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: LinkElement = {
    children: isCollapsed ? [{ text: url }] : [],
    type: 'link',
    url,
  };

  if (isCollapsed) {
    // @ts-ignore
    Transforms.insertNodes(editor, link);
  } else {
    // @ts-ignore
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const withInlines = (editor: Editor): Editor => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    ['link'].includes(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertLink = (editor: Editor, url: string): void => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const keyDownHandler = (editor: Editor, event: React.KeyboardEvent): void => {
  const { selection } = editor;

  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey];
      toggleMark(editor, mark);
    }
  }

  // Insert new line according to convention
  if (isHotkey('shift+enter', event)) {
    event.preventDefault();
    Editor.insertText(editor, '\n');
  }

  // Default left/right behavior is unit:'character'.
  // This fails to distinguish between two cursor positions, such as
  // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
  // Here we modify the behavior to unit:'offset'.
  // This lets the user step into and out of the inline without stepping over characters.
  // You may wish to customize this further to only use unit:'offset' in specific cases.
  if (selection && Range.isCollapsed(selection)) {
    const { nativeEvent } = event;
    if (isKeyHotkey('left', nativeEvent)) {
      event.preventDefault();
      Transforms.move(editor, { reverse: true, unit: 'offset' });
      return;
    }
    if (isKeyHotkey('right', nativeEvent)) {
      event.preventDefault();
      Transforms.move(editor, { unit: 'offset' });
      return;
    }
  }
};

type SlateElementInReality = {
  strikeThrough?: boolean;
  url?: string;
} & SlateElement;
/**
 * Recursively transforms slate elements to the shape expected by remarked-slate
 * which for some reason has slightly different property names.
 */
const convertSlateToRemarked = (
  slateElements: Array<SlateElementInReality | Text>
): Array<BlockType | LeafType> => {
  const convertedChildren = slateElements.map((element) => {
    return {
      ...element,
      ...('children' in element &&
        element.children && {
          children: convertSlateToRemarked(element.children),
        }),
      ...('url' in element && element.url && { link: element.url }),
      ...('strikeThrough' in element &&
        element.strikeThrough && { strikeThrough: element.strikeThrough }),
    };
  });
  return convertedChildren;
};

const shouldBeRemoved = (node: NodeEntry<Ancestor>): boolean => {
  if (node && node[0].hasOwnProperty('children')) {
    if (
      'children' in node[0].children[0] &&
      node[0].children[0].hasOwnProperty('children')
    ) {
      if (
        node[0].children[0].children[0] &&
        node[0].children[0].children[0].text === ''
      ) {
        return true;
      }
    }
  }
  return false;
};

const slateToMarkdown = (slateArray: Descendant[]): string => {
  const nodeTypes = {
    block_quote: 'block-quote',
    heading: {
      1: 'heading-one',
      2: 'heading-two',
    },
    listItem: 'list-item',
    ol_list: 'numbered-list',
    ul_list: 'bulleted-list',
  };

  const processed = convertSlateToRemarked(slateArray);

  return processed
    .filter(
      // Exclude empty lines
      (element) =>
        !(
          'type' in element &&
          element.type === 'paragraph' &&
          element.children?.length === 1 &&
          'text' in element.children[0] &&
          element.children[0].text.length === 0
        )
    )
    .map((element) => {
      return serialize(element as unknown as BlockType, {
        ignoreParagraphNewline: true,
        nodeTypes: nodeTypes as NodeTypes,
      });
    })
    .join('\n');
};

export {
  toggleBlock,
  toggleMark,
  insertLink,
  isBlockActive,
  isLinkActive,
  isMarkActive,
  keyDownHandler,
  LIST_TYPES,
  shouldBeRemoved,
  slateToMarkdown,
  withInlines,
  unwrapLink,
};
