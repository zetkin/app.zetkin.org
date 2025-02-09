import {
  BoldNode,
  ItalicNode,
  LinkNode,
  StringNode,
} from 'features/emails/types';

export enum RemirrorBlockType {
  BUTTON = 'zbutton',
  HEADING = 'heading',
  IMAGE = 'zimage',
  PARAGRAPH = 'paragraph',
}

export enum TextBlockContentType {
  LINE_BREAK = 'hardBreak',
  TEXT = 'text',
  VARIABLE = 'zvariable',
}

export enum MarkType {
  BOLD = 'bold',
  ITALIC = 'italic',
  LINK = 'zlink',
}

export type MarkNode = StringNode | BoldNode | ItalicNode | LinkNode;

export enum EmailVariable {
  FIRST_NAME = 'target.first_name',
  FULL_NAME = 'target.full_name',
  LAST_NAME = 'target.last_name',
}
