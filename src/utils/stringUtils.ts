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

const truncateOnMiddle = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str;
  }
  const halfLength = Math.floor((maxLength - 3) / 2);
  const firstPartBase = str.substring(0, halfLength);
  const lastPartBase = str.substring(str.length - halfLength);
  const lastWhitespaceOfFirst = firstPartBase.lastIndexOf(' ');
  const firstWhitespaceOfLast = lastPartBase.indexOf(' ');
  if (lastWhitespaceOfFirst == -1 || firstWhitespaceOfLast == -1) {
    return `${firstPartBase}...${lastPartBase}`;
  }
  const firstPart = firstPartBase.substring(0, lastWhitespaceOfFirst);
  const lastPart = lastPartBase.substring(
    firstWhitespaceOfLast + 1,
    lastPartBase.length
  );
  return `${firstPart}...${lastPart}`;
};

export const isInteger = (str: string): boolean =>
  Number.isInteger(parseFloat(str));

export { getEllipsedString, stringToBool, truncateOnMiddle };
