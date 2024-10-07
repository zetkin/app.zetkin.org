import { MJMLJsonObject } from 'mjml-core';

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
    'border-radius': string;
    'border-right': string;
    'border-top': string;
    color: string;
    'container-background-color': string;
    'font-family': string;
    'font-size': string;
    'font-style': string;
    'font-weight': string;
    height: string;
    'inner-padding': string;
    'letter-spacing': string;
    'line-height': string;
    padding: string;
    'padding-bottom': string;
    'padding-left': string;
    'padding-right': string;
    'padding-top': string;
    'text-align': string;
    'text-decoration': string;
    'text-transform': string;
    'vertical-align': string;
    width: string | null;
  }>;
  image?: Partial<{
    border: string;
    'border-bottom': string;
    'border-left': string;
    'border-radius': string;
    'border-right': string;
    'border-top': string;
    'container-background-color': string;
    padding: string;
    'padding-bottom': string;
    'padding-left': string;
    'padding-right': string;
    'padding-top': string;
  }>;
};

export type EmailTheme = {
  block_attributes?: BlockAttributes;
  css?: string;
  frame_mjml: MJMLJsonObject | null;
  id: number;
};

export type ZetkinEmailRecipient = {
  delivered: string | null;
  email: {
    id: number;
    title: string;
  };
  email_address: null;
  error: null;
  id: number;
  opened: string | null;
  person: {
    first_name: string;
    id: number;
    last_name: string;
  };
  sent: string | null;
  status: 'pending' | 'sent' | 'opened';
};

export type ZetkinEmailLink = {
  email: {
    id: number;
    title: string;
  };
  id: number;
  tag: string;
  url: string;
};

type EmailLinkWithMeta = ZetkinEmailLink & { clicks: number; text: string };

export type EmailInsights = {
  id: number;
  links: EmailLinkWithMeta[];
  opensByDate: {
    accumulatedOpens: number;
    date: string;
  }[];
};

export type ZetkinEmailStats = {
  id: number;
  num_blocked: {
    any: number;
    blacklisted: number;
    no_email: number;
    unsubscribed: number;
  };
  num_clicks: number;
  num_clicks_by_link: Record<number, number | undefined>;
  num_locked_targets: number | null;
  num_opened: number;
  num_sent: number;
  num_target_matches: number;
};
