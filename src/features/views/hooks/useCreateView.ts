import { useRouter } from 'next/router';
import { useState } from 'react';

import createNew from '../rpc/createNew/client';
import { ZetkinView } from '../components/types';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { viewCreate, viewCreated } from '../store';

interface useCreateViewReturn {
  createView: (folderId?: number, rows?: number[]) => void;
  isLoading: boolean;
}

export default function useCreateView(orgId: number): useCreateViewReturn {
  const apiClient = useApiClient();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const createView = async (
    folderId = 0,
    rows: number[] = []
  ): Promise<ZetkinView> => {
    setIsLoading(true);
    dispatch(viewCreate());
    const view = await apiClient.rpc(createNew, {
      folderId,
      orgId,
      rows,
    });
    dispatch(viewCreated(view));
    router.push(`/organize/${view.organization.id}/people/lists/${view.id}`);
    setIsLoading(false);
    return view;
  };

  return { createView, isLoading };
}
