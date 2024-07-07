import { STATUS_COLORS } from '../components/ActivityList/items/ActivityListItem';

export default function getStatusColor(
  startDate: Date | null,
  endDate: Date | null
): STATUS_COLORS {
  const now = new Date();

  if (startDate) {
    if (startDate > now) {
      return STATUS_COLORS.BLUE;
    } else if (startDate < now) {
      if (!endDate || endDate > now) {
        return STATUS_COLORS.GREEN;
      } else if (endDate && endDate < now) {
        // Should never happen, because it should not be
        // in the overview after it's closed.
        return STATUS_COLORS.RED;
      }
    }
  }

  // Should never happen, because it should not be in the
  // overview if it's not yet scheduled/published.
  return STATUS_COLORS.GRAY;
}
