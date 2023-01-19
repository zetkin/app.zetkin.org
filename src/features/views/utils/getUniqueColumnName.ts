import { ZetkinViewColumn } from '../components/types';

export default function getUniqueColumnName(
  defaultTitle: string,
  columns: ZetkinViewColumn[]
) {
  let title = defaultTitle;

  let foundNewTitle = false;
  while (!foundNewTitle) {
    let count = 2;
    const titleIsAlreadyIn = columns.some((column) => column.title === title);
    //const firstColumnTitle = isNaN(+title.slice(title.length - 1));
    // make title and 1 variables
    // make if statements variables
    //write test
    //create utils folder > create modul getUniqueColumnName +
    if (titleIsAlreadyIn) {
      /*        if (firstColumnTitle) {
        title += ' ' + 2;
        console.log('if');
      } else {
        const oldNumericSuffix = title.split(defaultTitle);
        title = defaultTitle + (+oldNumericSuffix[0] + 1).toString();
        console.log('else');
      } */
      const oldNumericSuffix = title.split(defaultTitle);
      title = defaultTitle + ' ' + (+oldNumericSuffix[0] + count).toString();
    } else {
      foundNewTitle = true;
    }

    count++;
  }
  return title;
}
