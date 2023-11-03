export default function useColumn(column: (string | number | null)[]) {
  const rowsWithValues: (string | number)[] = [];
  let numberOfEmptyRows = 0;

  column.forEach((rowValue) => {
    if (typeof rowValue === 'string' || typeof rowValue === 'number') {
      rowsWithValues.push(rowValue);
    } else {
      numberOfEmptyRows += 1;
    }
  });

  const uniqueValues = Array.from(new Set(rowsWithValues));

  return { numberOfEmptyRows, uniqueValues };
}
