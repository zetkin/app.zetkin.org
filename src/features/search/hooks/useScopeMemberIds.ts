import { useEffect, useRef, useState } from 'react';

import {
  SCOPE_TYPE,
  ScopeMembers,
  SearchScope,
  scopeKey,
} from '../scopes/types';
import { useApiClient, useNumericRouteParams } from 'core/hooks';
import {
  ZetkinEventParticipant,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import IApiClient from 'core/api/client/IApiClient';

/**
 * Person ids for the scopes that know their people through a separate
 * endpoint, rather than through the search result itself.
 *
 * PROTOTYPE: this fetches whole collections and matches in the browser, which
 * is fine for an event's participants and wrong for a survey with tens of
 * thousands of submissions. Real scoping belongs in the search API.
 */
export default function useScopeMemberIds(
  scopes: SearchScope[],
  enabled: boolean
): ScopeMembers {
  const apiClient = useApiClient();
  const { orgId } = useNumericRouteParams();
  const [members, setMembers] = useState<ScopeMembers>({});

  // Read inside the effect without making it depend on every new object
  const loadedRef = useRef<Set<string>>(new Set());

  const keysToLoad = scopes
    .filter((scope) => !!pathFor(scope, orgId))
    .map((scope) => scopeKey(scope))
    .join(',');

  useEffect(() => {
    if (!enabled || !keysToLoad) {
      return;
    }

    keysToLoad.split(',').forEach(async (key) => {
      if (loadedRef.current.has(key)) {
        return;
      }
      loadedRef.current.add(key);

      const scope = scopeFromKey(key);
      const path = pathFor(scope, orgId);
      if (!path) {
        return;
      }

      try {
        const ids = await loadIds(scope, path, apiClient);
        setMembers((current) => ({ ...current, [key]: ids }));
      } catch {
        setMembers((current) => ({ ...current, [key]: [] }));
      }
    });
  }, [apiClient, enabled, keysToLoad, orgId]);

  return members;
}

function scopeFromKey(key: string): SearchScope {
  const separator = key.lastIndexOf('-');

  return {
    id: parseInt(key.slice(separator + 1)),
    title: '',
    type: key.slice(0, separator) as SCOPE_TYPE,
  };
}

function pathFor(scope: SearchScope, orgId: number): string | null {
  if (scope.type === SCOPE_TYPE.EVENT) {
    return `/api/orgs/${orgId}/actions/${scope.id}/participants`;
  }
  if (scope.type === SCOPE_TYPE.SURVEY) {
    return `/api/orgs/${orgId}/surveys/${scope.id}/submissions`;
  }
  return null;
}

async function loadIds(
  scope: SearchScope,
  path: string,
  apiClient: IApiClient
): Promise<number[]> {
  if (scope.type === SCOPE_TYPE.SURVEY) {
    const submissions = await apiClient.get<ZetkinSurveySubmission[]>(path);
    return submissions
      .map((submission) => submission.respondent?.id)
      .filter((id): id is number => !!id);
  }

  const participants = await apiClient.get<ZetkinEventParticipant[]>(path);
  return participants.map((participant) => participant.id);
}
