type SegmentStyle = 'fill' | 'stroke';

type EmptySegment = {
  kind: 'empty';
};

export type SankeyEntrySegment = {
  kind: 'entry';
  style: SegmentStyle;
  width: number;
};

export type SankeyExitSegment = {
  kind: 'exit';
  style: SegmentStyle;
  width: number;
};

type SelectionSideElement = {
  offset: number;
  style: SegmentStyle;
  width: number;
};

type SelectionMainElement = {
  offset: number;
  style: SegmentStyle;
  width: number;
};

export type SankeyAddSegment = {
  kind: 'add';
  main: SelectionMainElement | null;
  side: SelectionSideElement;
};

export type SankeySubSegment = {
  kind: 'sub';
  main: SelectionMainElement;
  side: SelectionSideElement;
};

export type SankeySegment =
  | EmptySegment
  | SankeyEntrySegment
  | SankeyExitSegment
  | SankeyAddSegment
  | SankeySubSegment;

export type FilterStats = {
  matched: number;
  op: 'add' | 'empty' | 'entry' | 'sub';
  output: number;
};
