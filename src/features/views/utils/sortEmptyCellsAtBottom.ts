import { GridSortDirection } from '@mui/x-data-grid-pro';

export default function sortEmptyCellsAtBottom<T>(
  sortDirection: GridSortDirection,
  comparator: (v1: T, v2: T) => number
) {
  const modifier = sortDirection === 'desc' ? -1 : 1;
  return (v1?: T | null, v2?: T | null) => {
    if (!v1 && !v2) {
      return 0;
    }
    if (!v1) {
      return 1;
    }
    if (!v2) {
      return -1;
    }
    return modifier * comparator(v1, v2);
  };
}
