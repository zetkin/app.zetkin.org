export enum BLOCK_TYPES {
  BUTTON = 'button',
  HEADER = 'header',
  LIBRARY_IMAGE = 'libraryImage',
  PARAGRAPH = 'paragraph',
}

export enum InlineNodeKind {
  BOLD = 'bold',
  ITALIC = 'italic',
  LINE_BREAK = 'lineBreak',
  LINK = 'link',
  STRING = 'string',
  VARIABLE = 'variable',
}

export enum BlockKind {
  BUTTON = 'button',
  HEADER = 'header',
  IMAGE = 'image',
  PARAGRAPH = 'paragraph',
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
  tag: string;
};

export type BoldNode = {
  content: EmailContentInlineNode[];
  kind: InlineNodeKind.BOLD;
};

export type ItalicNode = {
  content: EmailContentInlineNode[];
  kind: InlineNodeKind.ITALIC;
};

export type LineBreakNode = {
  kind: InlineNodeKind.LINE_BREAK;
};

export type EmailContentInlineNode =
  | LineBreakNode
  | ItalicNode
  | BoldNode
  | LinkNode
  | StringNode
  | VariableNode;

export type ButtonBlock = {
  data: {
    href: string;
    tag: string;
    text: string;
  };
  kind: BlockKind.BUTTON;
};

export type HeaderBlock = {
  data: {
    content: EmailContentInlineNode[];
    level: 1 | 2 | 3 | 4;
  };
  kind: BlockKind.HEADER;
};

export type ImageBlock = {
  data: {
    alt: string;
    src: string;
  };
  kind: BlockKind.IMAGE;
};

export type ParagraphBlock = {
  data: {
    content: EmailContentInlineNode[];
  };
  kind: BlockKind.PARAGRAPH;
};

export type EmailContentBlock =
  | ButtonBlock
  | HeaderBlock
  | ImageBlock
  | ParagraphBlock;

export type EmailContent = {
  blocks: EmailContentBlock[];
};
