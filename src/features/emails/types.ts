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
    fileId: number;
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

export enum BlockProblem {
  INVALID_BUTTON_URL = 'invalidButtonURL',
  DEFAULT_BUTTON_TEXT = 'defaultButtonText',
  INVALID_LINK_URL = 'invalidLinkURL',
}

export enum DeliveryProblem {
  EMPTY = 'empty',
  CONTENT_ERROR = 'contentError',
  NO_SUBJECT = 'noSubject',
  NOT_TARGETED = 'notTargeted',
  TARGETS_NOT_LOCKED = 'targetsNotLocked',
}

export type BlockAttributes = {
  button?: Partial<{
    'background-color': string;
    border: string;
    'border-bottom': string;
    'border-left': string;
    'border-radius': number;
    'border-right': string;
    'border-top': string;
    color: string;
    'container-background-color': string;
    'font-family': string;
    'font-size': number;
    'font-style': string;
    'font-weight': string;
    height: number;
    'inner-padding': number;
    'letter-spacing': string;
    'line-height': string;
    padding: number;
    'padding-bottom': number;
    'padding-left': number;
    'padding-right': number;
    'padding-top': number;
    'text-align': string;
    'text-decoration': string;
    'text-transform': string;
    'vertical-align': string;
    width: number | null;
  }>;
  image?: Partial<{
    border: string;
    'border-bottom': string;
    'border-left': string;
    'border-radius': number;
    'border-right': string;
    'border-top': string;
    'container-background-color': string;
    padding: number;
    'padding-bottom': number;
    'padding-left': number;
    'padding-right': number;
    'padding-top': number;
  }>;
};

export type EmailFrame = {
  block_attributes?: BlockAttributes;
  css?: string;
  id: number;
};
