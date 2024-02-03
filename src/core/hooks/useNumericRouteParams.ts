import { useRouter } from 'next/router';

export default function useNumericRouteParams(): Record<string, number> {
  const input = useRouter().query;
  const output: Record<string, number> = {};
  Object.keys(input).forEach((key: string) => {
    const value = parseInt(input[key] as string);
    if (!isNaN(value)) {
      output[key] = value;
    }
  });

  return output;
}
