import { useState } from 'react';

import { importResultAdd } from '../store';
import { ImportRes, ZetkinPersonImportPostBody } from '../utils/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useImport(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const importOperations = useAppSelector(
    (state) => state.import.importOperations
  );
  const [loading, setLoading] = useState(false);

  const importPeople = async () => {
    setLoading(true);
    const importResult = await apiClient.post<
      ImportRes,
      ZetkinPersonImportPostBody
    >(`/api/orgs/${orgId}/bulk/execute`, {
      ops: importOperations,
    });
    dispatch(importResultAdd(importResult.stats.person));
    setLoading(false);
  };

  return { importPeople, loading };
}
