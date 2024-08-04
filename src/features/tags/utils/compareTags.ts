import { ZetkinTag } from 'utils/types/zetkin';

export default function compareTags(
  tag0: ZetkinTag | null,
  tag1: ZetkinTag | null
): number {
  //only compare titles if they are not null
  if (tag0 && tag0.title && tag1 && tag1.title) {
    const titleComparison = tag0.title.localeCompare(tag1.title);
    if (titleComparison !== 0) {
      return titleComparison;
    }
  } else if (tag0 && tag0.title) {
    return -1;
  } else if (tag1 && tag1.title) {
    return 1;
  }

  // If 'title' properties are equal, proceed to compare 'value' properties
  if (tag0 && tag0.value != null) {
    if (tag1 && tag1.value != null) {
      if (typeof tag0.value === 'string' && typeof tag1.value === 'string') {
        if (isNaN(Number(tag0.value)) && isNaN(Number(tag1.value))) {
          return tag0.value.localeCompare(tag1.value);
        }
        if (!isNaN(Number(tag0.value)) && !isNaN(Number(tag1.value))) {
          return parseInt(tag0.value) - parseInt(tag1.value);
        }
        if (isNaN(Number(tag0.value))) {
          return 1;
        }
        if (isNaN(Number(tag1.value))) {
          return -1;
        } else {
          return tag0.value.localeCompare(tag1.value);
        }
      } else if (
        typeof tag0.value === 'number' &&
        typeof tag1.value === 'number'
      ) {
        return tag0.value - tag1.value;
      }
    } else {
      // tag1 has a null 'value' property, so tag0 comes before tag1
      return -1;
    }
  }

  return 0;
}
