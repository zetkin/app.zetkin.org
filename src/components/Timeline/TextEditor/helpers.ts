import isUrl from 'is-url';
import {
  Descendant,
  Editor,
  Range,
  Element as SlateElement,
  Transforms,
} from 'slate';
import isHotkey, { isKeyHotkey } from 'is-hotkey';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];
const HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+s': 'strikethrough',
};

type LinkElement = { children: Descendant[]; type: 'link'; url: string };

const toggleBlock = (editor: Editor, format: string): void => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { children: [], type: format };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        n[blockType] === format,
    })
  );

  return !!match;
};

const isLinkActive = (editor: Editor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Transforms.insertNodes(editor, link);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

export {
  toggleBlock,
  toggleMark,
  insertLink,
  isBlockActive,
  isLinkActive,
  isMarkActive,
  keyDownHandler,
  LIST_TYPES,
  TEXT_ALIGN_TYPES,
  withInlines,
  unwrapLink,
};
