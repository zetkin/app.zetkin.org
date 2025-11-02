import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function useDateRouterParam(paramName: string): Date | null {
  const router = useRouter();

  return useMemo(() => {
    const rawValue = router.query[paramName];

    if (typeof rawValue !== 'string') {
      return null;
    }

    const date = new Date(rawValue);

    if (isNaN(date.valueOf())) {
      return null;
    }

    return date;
  }, [router.query]);
}
