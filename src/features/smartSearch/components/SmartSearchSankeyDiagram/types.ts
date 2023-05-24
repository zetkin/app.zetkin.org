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
  style: SegmentStyle;
  width: number;
};

type SelectionMainElement = {
  input: number;
  output: number;
  style: SegmentStyle;
};

export type SankeyAddSegment = {
  kind: 'add';
  main: SelectionMainElement | null;
  side: SelectionSideElement;
};

export type SankeySubSegment = {
  kind: 'sub';
  main: SelectionMainElement | null;
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
