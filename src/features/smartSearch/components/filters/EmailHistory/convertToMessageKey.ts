export default function convertToMessageKey(value: string) {
  return value.replace(/_(.)/, (_, char) => char.toUpperCase());
}
