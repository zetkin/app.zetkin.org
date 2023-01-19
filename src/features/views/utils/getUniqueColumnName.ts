import { ZetkinViewColumn } from '../components/types';

export default function getUniqueColumnName(
  defaultTitle: string,
  columns: ZetkinViewColumn[]
) {
  let title = defaultTitle;
  let count = 2;
  let foundNewTitle = false;
  while (!foundNewTitle) {
    const titleIsAlreadyIn = columns.some((column) => column.title === title);
    if (titleIsAlreadyIn) {
      title = defaultTitle + ' ' + count.toString();
    } else {
      foundNewTitle = true;
    }
    count++;
  }
  return title;
}
