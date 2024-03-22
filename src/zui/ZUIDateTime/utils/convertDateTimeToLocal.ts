export default function convertDateTimeToLocal(datetime: string) {
  const lastChar = datetime[datetime.length - 1];
  const lastSixChars = datetime.slice(-6);

  if (lastChar === 'Z') {
    const lastSevenChars = datetime.slice(-7);

    if (lastSevenChars[0] === '+' || lastSevenChars[0] === '-') {
      return datetime.slice(0, datetime.length - 1);
    } else {
      return datetime;
    }
  } else if (lastSixChars[0] === '+' || lastSixChars[0] === '-') {
    return datetime;
  } else {
    return datetime + 'Z';
  }
}
