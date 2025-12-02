export default function mockCsv(rows: string[][]): string {
  return rows.map((row) => row.join(',')).join('\n');
}
