import { ZetkinEmail } from 'utils/types/zetkin';

export enum BLOCK_TYPES {
  BUTTON = 'button',
  HEADER = 'header',
  LIBRARY_IMAGE = 'libraryImage',
  PARAGRAPH = 'paragraph',
}

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

export type FrameBase = {
  blockAttributes: BlockAttributes;
  css: string;
  id: number;
};

export type HtmlFrame = FrameBase & { frameHtml: string };
export type EmailWithHtmlFrame = ZetkinEmail & { frame: HtmlFrame };
