export enum RemirrorBlockType {
  BULLET_LIST = 'bulletList',
  LIST_ITEM = 'listItem',
  BUTTON = 'zbutton',
  HEADING = 'heading',
  IMAGE = 'zimage',
  ORDERED_LIST = 'orderedList',
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
  STRIKE = 'strike',
}

export enum EmailVariable {
  FIRST_NAME = 'target.first_name',
  FULL_NAME = 'target.full_name',
  LAST_NAME = 'target.last_name',
}
