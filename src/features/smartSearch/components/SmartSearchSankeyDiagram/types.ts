type SegmentStyle = 'fill' | 'stroke';

type EmptySegment = {
  kind: 'empty';
};

type EntrySegment = {
  kind: 'entry';
  style: SegmentStyle;
  width: number;
};

type ExitSegment = {
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

export type SelectionAddSegment = {
  kind: 'add';
  main: SelectionMainElement | null;
  side: SelectionSideElement;
};

export type SelectionSubSegment = {
  kind: 'sub';
  main: SelectionMainElement | null;
  side: SelectionSideElement;
};

export type SankeySegment =
  | EmptySegment
  | EntrySegment
  | ExitSegment
  | SelectionAddSegment
  | SelectionSubSegment;

export type FilterStats = {
  matched: number;
  op: 'add' | 'empty' | 'entry' | 'sub';
  output: number;
};
