export enum BLOCK_TYPES {
  BUTTON = 'button',
  HEADER = 'header',
  LIBRARY_IMAGE = 'libraryImage',
  PARAGRAPH = 'paragraph',
}

export enum InlineNodeKind {
  BOLD = 'bold',
  ITALIC = 'italic',
  LINK = 'link',
  STRING = 'string',
  VARIABLE = 'variable',
}

export type StringNode = {
  kind: InlineNodeKind.STRING;
  value: string;
};

export type VariableNode = {
  kind: InlineNodeKind.VARIABLE;
  name: string;
};

export type LinkNode = {
  content: EmailContentInlineNode[];
  href: string;
  kind: InlineNodeKind.LINK;
};

export type BoldNode = {
  content: EmailContentInlineNode[];
  kind: InlineNodeKind.BOLD;
};

export type ItalicNode = {
  content: EmailContentInlineNode[];
  kind: InlineNodeKind.ITALIC;
};

export type EmailContentInlineNode =
  | ItalicNode
  | BoldNode
  | LinkNode
  | StringNode
  | VariableNode;
