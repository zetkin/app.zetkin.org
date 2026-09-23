import { useEffect, useRef, useState } from 'react';

import IApiClient from 'core/api/client/IApiClient';
import { SEARCH_DATA_TYPE, SearchResult } from '../components/types';
import { SCOPE_TYPE, SearchScope, scopeKey } from '../scopes/types';
import { useApiClient, useNumericRouteParams } from 'core/hooks';

/**
 * Everything inside a scope, fetched from the scope's own endpoints.
 *
 * The search API caps its answer per type and cannot be told about a scope, so
 * a project's survey can be missing from the response even when its name is
 * typed in full. A project has tens of activities rather than thousands, so
 * asking it directly what it contains is both cheap and complete.
 */
export default function useScopeContents(
  scopes: SearchScope[],
  enabled: boolean
): SearchResult[] {
  const apiClient = useApiClient();
  const { orgId } = useNumericRouteParams();
  const [contents, setContents] = useState<Record<string, SearchResult[]>>({});

  // Read inside the effect without making it depend on every new object
  const loadedRef = useRef<Set<string>>(new Set());

  const keys = scopes
    .filter((scope) => CAN_ENUMERATE.includes(scope.type))
    .map((scope) => `${scopeKey(scope)}`)
    .join(',');

  useEffect(() => {
    if (!enabled || !keys) {
      return;
    }

    keys.split(',').forEach(async (key) => {
      if (loadedRef.current.has(key)) {
        return;
      }
      loadedRef.current.add(key);

      const separator = key.lastIndexOf('-');
      const type = key.slice(0, separator) as SCOPE_TYPE;
      const id = parseInt(key.slice(separator + 1));

      try {
        const results = await loadContents(type, id, orgId, apiClient);
        setContents((current) => ({ ...current, [key]: results }));
      } catch {
        setContents((current) => ({ ...current, [key]: [] }));
      }
    });
  }, [apiClient, enabled, keys, orgId]);

  return Object.values(contents).flat();
}

const CAN_ENUMERATE = [
  SCOPE_TYPE.PROJECT,
  SCOPE_TYPE.FOLDER,
  SCOPE_TYPE.JOURNEY,
];

async function loadContents(
  type: SCOPE_TYPE,
  id: number,
  orgId: number,
  apiClient: IApiClient
): Promise<SearchResult[]> {
  const base = `/api/orgs/${orgId}`;

  if (type === SCOPE_TYPE.PROJECT) {
    const [surveys, tasks, callAssignments] = await Promise.all([
      apiClient.get<SearchResult['match'][]>(`${base}/campaigns/${id}/surveys`),
      apiClient.get<SearchResult['match'][]>(`${base}/campaigns/${id}/tasks`),
      apiClient.get<SearchResult['match'][]>(
        `${base}/campaigns/${id}/call_assignments`
      ),
    ]);

    return [
      ...asResults(surveys, SEARCH_DATA_TYPE.SURVEY),
      ...asResults(tasks, SEARCH_DATA_TYPE.TASK),
      ...asResults(callAssignments, SEARCH_DATA_TYPE.CALL_ASSIGNMENT),
    ];
  }

  if (type === SCOPE_TYPE.FOLDER) {
    // Views cannot be listed by folder, so the folder is matched client-side
    const views = await apiClient.get<SearchResult['match'][]>(
      `${base}/people/views`
    );
    return asResults(views, SEARCH_DATA_TYPE.VIEW).filter(
      (result) =>
        result.type === SEARCH_DATA_TYPE.VIEW && result.match.folder?.id == id
    );
  }

  const instances = await apiClient.get<SearchResult['match'][]>(
    `${base}/journeys/${id}/instances`
  );
  return asResults(instances, SEARCH_DATA_TYPE.JOURNEY_INSTANCE);
}

function asResults(
  matches: SearchResult['match'][],
  type: SEARCH_DATA_TYPE
): SearchResult[] {
  return matches.map((match) => ({ match, type }) as SearchResult);
}
