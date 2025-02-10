export default function placeInCorrectCentury(date: Date) {
  const thisYear = new Date().getFullYear();
  const year = date.getFullYear();

  if (year > thisYear) {
    date.setFullYear(year - 100);
  }
}
