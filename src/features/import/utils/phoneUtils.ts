export function cleanPhoneNumber(value: string | number): string {
  return value.toString().replaceAll(/[^+\d]/g, '');
}
