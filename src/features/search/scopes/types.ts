/**
 * A scope always refers to one instance of a model. Sections such as the
 * calendar or the activities list are not scopes: they stand for a set of
 * types, which is what the filter chips are for.
 *
 * Emails and area assignments are missing on purpose: both are defined by a
 * query over people, which only the API can answer, so there is nothing
 * honest for a pill to do there yet.
 */
export enum SCOPE_TYPE {
  CALL_ASSIGNMENT = 'callassignment',
  EVENT = 'event',
  FOLDER = 'folder',
  JOURNEY = 'journey',
  JOURNEY_INSTANCE = 'journeyinstance',
  PERSON = 'person',
  PROJECT = 'project',
  SURVEY = 'survey',
  TASK = 'task',
}

export type SearchScope = {
  id: number;
  title: string;
  type: SCOPE_TYPE;
};

/**
 * Person ids belonging to a scope, for the scopes whose members have to be
 * looked up rather than read off the search result itself.
 *
 * Undefined means "not known yet", which is different from an empty list.
 */
export type ScopeMembers = Record<string, number[] | undefined>;

export function scopeKey(scope: SearchScope): string {
  return `${scope.type}-${scope.id}`;
}
