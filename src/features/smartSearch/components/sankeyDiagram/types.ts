export enum SEGMENT_STYLE {
  FILL = 'fill',
  STROKE = 'stroke',
}

export enum SEGMENT_KIND {
  EMPTY = 'empty',
  ENTRY = 'entry',
  EXIT = 'exit',
  ADD = 'add',
  SUB = 'sub',
  PSEUDO_ADD = 'pseudoAdd',
  PSEUDO_SUB = 'pseudoSub',
}

type SankeyEmptySegment = {
  kind: SEGMENT_KIND.EMPTY;
};

export type SankeyEntrySegment = {
  kind: SEGMENT_KIND.ENTRY;
  style: SEGMENT_STYLE;
  width: number;
};

export type SankeyExitSegment = {
  kind: SEGMENT_KIND.EXIT;
  style: SEGMENT_STYLE;
  width: number;
};

type SelectionSideElement<StyleType = SEGMENT_STYLE> = {
  style: StyleType;
  width: number;
};

type SelectionMainElement<StyleType = SEGMENT_STYLE> = {
  style: StyleType;
  width: number;
};

export type SankeyAddSegment = {
  kind: SEGMENT_KIND.ADD;
  main: SelectionMainElement<SEGMENT_STYLE.FILL>;
  side: SelectionSideElement<SEGMENT_STYLE.FILL>;
};

export type SankeyPseudoAddSegment = {
  kind: SEGMENT_KIND.PSEUDO_ADD;
  main: SelectionMainElement | null;
  side: SelectionSideElement;
};

export type SankeySubSegment = {
  kind: SEGMENT_KIND.SUB;
  main: SelectionMainElement<SEGMENT_STYLE.FILL>;
  side: SelectionSideElement<SEGMENT_STYLE.FILL>;
};

export type SankeyPseudoSubSegment = {
  kind: SEGMENT_KIND.PSEUDO_SUB;
  main: SelectionMainElement | null;
  side: SelectionSideElement;
};

export type SankeySegment =
  | SankeyEmptySegment
  | SankeyEntrySegment
  | SankeyExitSegment
  | SankeyAddSegment
  | SankeyPseudoAddSegment
  | SankeySubSegment
  | SankeyPseudoSubSegment;

export type SankeyConfig = {
  arrowDepth: number;
  arrowWidth: number;
  color: string;
  diagWidth: number;
  highlightColor: string;
  lineWidth: number;
  margin: number;
};
