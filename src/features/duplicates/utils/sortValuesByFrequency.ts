export default function sortValuesByFrequency(values: string[]) {
  const frequency: Record<string | number, number> = {};

  values.forEach((value) => {
    if (!frequency[value]) {
      frequency[value] = 0;
    }
    frequency[value] = frequency[value] + 1;
  });

  const uniqueValues = [...new Set(values)];

  return uniqueValues.sort((value1, value2) => {
    const a = value1 || '';
    const b = value2 || '';

    if (frequency[a] > frequency[b]) {
      return -1;
    } else if (frequency[b] > frequency[a]) {
      return 1;
    } else {
      return 0;
    }
  });
}
