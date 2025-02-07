import {
  BoldNode,
  ItalicNode,
  LinkNode,
  StringNode,
} from 'features/emails/types';

export enum TextBlockContentType {
  HARD_BREAK = 'hardBreak',
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
