import { GridSortDirection } from '@mui/x-data-grid-pro';

export const copmareCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
}).compare;

export default function sortEmptyCellsAtBottom(
  sortDirection: GridSortDirection,
  v1?: string | null,
  v2?: string | null
) {
  const modifier = sortDirection === 'desc' ? -1 : 1;

  if (!v1 && !v2) {
    return 0;
  }
  if (!v1) {
    return 1;
  }
  if (!v2) {
    return -1;
  }

  const result = copmareCollator(v1.trim(), v2.trim());

  return modifier * result;
}
