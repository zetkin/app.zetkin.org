type FlatRecord = { id: number; parentId: number | null } & Record<
  string,
  unknown
>;
type TreeRecord = FlatRecord & { children: TreeRecord[] };

export const nestByParentId = (
  items: FlatRecord[],
  rootId: number | null
): TreeRecord[] =>
  items
    .filter((item) => item.parentId === rootId)
    .map(
      (item): TreeRecord => ({
        ...item,
        children: nestByParentId(items, item.id),
      })
    );

export const noPropagate =
  (callback: (event?: React.SyntheticEvent) => void) =>
  (evt: React.SyntheticEvent): void => {
    evt.stopPropagation();
    callback(evt);
  };
