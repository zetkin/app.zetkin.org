export type FlatRecord = {
  id: number;
  [key: string]: unknown | unknown[];
  parentId: number | null;
};
type TreeRecord = FlatRecord & { descendants: TreeRecord[] };

export const nestByParentId = (
  items: FlatRecord[],
  rootId: number | null
): TreeRecord[] =>
  items
    .filter((item) => item.parentId === rootId)
    .map(
      (item): TreeRecord => ({
        ...item,
        descendants: nestByParentId(items, item.id),
      })
    );

export const noPropagate =
  (callback: (event?: React.SyntheticEvent) => void) =>
  (evt: React.SyntheticEvent): void => {
    evt.stopPropagation();
    callback(evt);
  };
