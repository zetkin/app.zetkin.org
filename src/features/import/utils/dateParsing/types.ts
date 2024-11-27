export type DateParts = {
  day: string;
  delimiter: string;
  month: string;
  suffix: string;
  year: string;
};

export interface IDateParser {
  makeDateParts(value: string): DateParts | null;
  parse(value: string): string;
  validate(value: string | number): boolean;
}
