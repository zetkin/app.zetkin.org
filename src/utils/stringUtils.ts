function stringToBool(str: string | undefined): boolean {
  if (!str) {
    return false;
  }

  const n = parseInt(str);

  if (!isNaN(n)) {
    return Boolean(n);
  } else {
    return str.toLowerCase() === 'true';
  }
}

const getEllipsedString = (string: string, maxLength: number): string => {
  if (maxLength >= string.length) {
    return string;
  }
  const matches = Array.from(string.matchAll(/(\s)/g));
  const ellipseIndex = matches.find(
    (m) => (m.index as number) >= maxLength
  )?.index;
  return string.slice(0, ellipseIndex) + '...';
};

export { getEllipsedString, stringToBool };
