import { ZetkinViewColumn } from '../components/types';

export default function getUniqueColumnName(
  defaultTitle: string,
  columns: ZetkinViewColumn[]
) {
  let title = defaultTitle;
  let count = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const titleIsAlreadyIn = columns.some((column) => column.title === title);
    if (titleIsAlreadyIn) {
      title = defaultTitle + ' ' + count;
    } else {
      break;
    }
    count++;
  }
  return title;
}
