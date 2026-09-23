import { SearchScope } from '../hooks/useSearchScope';
import { SEARCH_DATA_TYPE, SearchResult } from '../components/types';

/**
 * Narrows search results to those connected to the scope.
 *
 * This is a placeholder for server-side scoping: it can only use the project
 * that results already carry. Types that don't carry one (people, lists,
 * journey instances) are dropped while a scope is active, even though some of
 * them are connected to the project in ways only the API can know about.
 */
export default function filterResultsByScope(
  results: SearchResult[],
  scope: SearchScope | null
): SearchResult[] {
  if (!scope) {
    return results;
  }

  return results.filter((result) => {
    if (result.type === SEARCH_DATA_TYPE.PROJECT) {
      return result.match.id == scope.id;
    }

    if (
      result.type === SEARCH_DATA_TYPE.TASK ||
      result.type === SEARCH_DATA_TYPE.SURVEY ||
      result.type === SEARCH_DATA_TYPE.CALL_ASSIGNMENT
    ) {
      return result.match.campaign?.id == scope.id;
    }

    return false;
  });
}
