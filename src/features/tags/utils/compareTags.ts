import { ZetkinAppliedTag } from 'utils/types/zetkin';

export default function compareTags(
  tag0: ZetkinAppliedTag | null,
  tag1: ZetkinAppliedTag | null
): number {
  const title0 = tag0?.title;
  const title1 = tag1?.title;

  //only compare titles if they are not null
  if (title0 && title1) {
    const titleComparison = title0.localeCompare(title1);
    if (titleComparison !== 0) {
      return titleComparison;
    }
  } else if (title0) {
    return -1;
  } else if (title1) {
    return 1;
  }

  // If 'title' properties are equal, proceed to compare 'value' properties
  const value0 = tag0?.value;
  const value1 = tag1?.value;

  if (value0 !== null && value0 !== undefined) {
    if (value1 !== null && value1 !== undefined) {
      if (typeof value0 === 'string' && typeof value1 === 'string') {
        if (isNaN(Number(value0)) && isNaN(Number(value1))) {
          return value0.localeCompare(value1);
        }
        if (!isNaN(Number(value0)) && !isNaN(Number(value1))) {
          return parseInt(value0) - parseInt(value1);
        }
        if (isNaN(Number(value0))) {
          return 1;
        }
        if (isNaN(Number(value1))) {
          return -1;
        } else {
          return value0.localeCompare(value1);
        }
      } else if (typeof value0 === 'number' && typeof value1 === 'number') {
        return value0 - value1;
      }
    } else {
      // tag1 has a null 'value' property, so tag0 comes before tag1
      return -1;
    }
  }

  return 0;
}
