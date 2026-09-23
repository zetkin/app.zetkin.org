import { SCOPE_TYPE, ScopeMembers, SearchScope, scopeKey } from './types';
import { SEARCH_DATA_TYPE, SearchResult } from '../components/types';

/**
 * A scope's verdict on a result.
 *
 * `null` means "can't tell": the scope has nothing to say about results of
 * this type. A project knows its surveys but not its people, so it stays
 * silent about people rather than hiding them, which would cancel out an
 * inner scope that does know.
 */
export type ScopeVerdict = boolean | null;

type ScopeMatcher = (
  result: SearchResult,
  scope: SearchScope,
  isMember: ScopeVerdict
) => ScopeVerdict;

const isSelf = (
  result: SearchResult,
  type: SEARCH_DATA_TYPE,
  id: number
): ScopeVerdict => (result.type === type ? result.match.id == id : null);

/**
 * One matcher per scope, saying which search results belong to it.
 *
 * Three ways of knowing, in order of how much they cost:
 *
 * 1. The result is the scope itself (the survey you are standing on).
 * 2. The result carries the scope (a task knows its project).
 * 3. The result is a person and the scope has a member list that had to be
 *    fetched (the people in a list, the participants of an event).
 */
const MATCHERS: Record<SCOPE_TYPE, ScopeMatcher> = {
  [SCOPE_TYPE.CALL_ASSIGNMENT]: (result, scope) =>
    isSelf(result, SEARCH_DATA_TYPE.CALL_ASSIGNMENT, scope.id),
  [SCOPE_TYPE.EVENT]: (result, scope, isMember) => isMember,
  [SCOPE_TYPE.FOLDER]: (result, scope) =>
    result.type === SEARCH_DATA_TYPE.VIEW
      ? result.match.folder?.id == scope.id
      : null,
  [SCOPE_TYPE.JOURNEY]: (result, scope) =>
    result.type === SEARCH_DATA_TYPE.JOURNEY_INSTANCE
      ? result.match.journey.id == scope.id
      : null,
  [SCOPE_TYPE.JOURNEY_INSTANCE]: (result, scope) =>
    isSelf(result, SEARCH_DATA_TYPE.JOURNEY_INSTANCE, scope.id),
  [SCOPE_TYPE.PERSON]: (result, scope) => {
    if (result.type === SEARCH_DATA_TYPE.JOURNEY_INSTANCE) {
      return result.match.subjects.some((subject) => subject.id == scope.id);
    }
    return isSelf(result, SEARCH_DATA_TYPE.PERSON, scope.id);
  },
  [SCOPE_TYPE.PROJECT]: (result, scope) => {
    const carriesProject =
      result.type === SEARCH_DATA_TYPE.TASK ||
      result.type === SEARCH_DATA_TYPE.SURVEY ||
      result.type === SEARCH_DATA_TYPE.CALL_ASSIGNMENT;

    if (carriesProject) {
      return result.match.campaign?.id == scope.id;
    }
    return isSelf(result, SEARCH_DATA_TYPE.PROJECT, scope.id);
  },
  [SCOPE_TYPE.SURVEY]: (result, scope, isMember) =>
    result.type === SEARCH_DATA_TYPE.SURVEY
      ? result.match.id == scope.id
      : isMember,
  [SCOPE_TYPE.TASK]: (result, scope) =>
    isSelf(result, SEARCH_DATA_TYPE.TASK, scope.id),
};

export default function matchResult(
  result: SearchResult,
  scope: SearchScope,
  members: ScopeMembers
): ScopeVerdict {
  if (result.type !== SEARCH_DATA_TYPE.PERSON) {
    return MATCHERS[scope.type](result, scope, null);
  }

  const key = scopeKey(scope);
  const memberIds = members[key];
  // A member list that hasn't arrived yet is unknown, not empty
  const isMember =
    key in members && memberIds ? memberIds.includes(result.match.id) : null;

  return MATCHERS[scope.type](result, scope, isMember);
}
