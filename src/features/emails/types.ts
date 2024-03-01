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
