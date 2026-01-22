import Fuse from 'fuse.js';

import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';
import { EventSignupModelType } from '../models';

const SEARCH_THRESHOLD = 0.4;
const WEIGHTS = {
  email: 0.8,
  first_name: 1.0,
  last_name: 0.8,
  phone: 0.8,
} as const;

function toTokens(filterString: string): string[] {
  return filterString.trim().split(/\s+/);
}

export function filterUnverifiedSignups(
  list: EventSignupModelType[],
  filterString: string
): EventSignupModelType[] {
  const tokens = toTokens(filterString);
  const unverifiedFuseList = new Fuse<EventSignupModelType>(list, {
    includeScore: true,
    keys: [
      { name: 'first_name', weight: WEIGHTS.first_name },
      { name: 'last_name', weight: WEIGHTS.last_name },
      { name: 'phone', weight: WEIGHTS.phone },
      { name: 'email', weight: WEIGHTS.email },
    ],
    threshold: SEARCH_THRESHOLD,
  });

  return unverifiedFuseList
    .search({
      $and: tokens.map((searchToken: string) => {
        const orFields: Fuse.Expression[] = [
          { first_name: searchToken },
          { last_name: searchToken },
          { phone: searchToken },
          { email: searchToken },
        ];

        return {
          $or: orFields,
        };
      }),
    })
    .map((fuseResult) => fuseResult.item);
}

export function isSignupList(
  list: ZetkinEventResponse[] | ZetkinEventParticipant[]
): list is ZetkinEventResponse[] {
  return list.some((obj) => 'person' in obj);
}

export function filterSignupOrParticipantRows(
  list: ZetkinEventResponse[] | ZetkinEventParticipant[],
  filterString: string
): ZetkinEventResponse[] | ZetkinEventParticipant[] {
  return isSignupList(list)
    ? filterSignups(list, filterString)
    : filterParticipantsList(list, filterString);
}

export function filterSignups(
  list: ZetkinEventResponse[],
  filterString: string
): ZetkinEventResponse[] {
  const tokens = toTokens(filterString);
  const signUpFuseList = new Fuse<ZetkinEventResponse>(list, {
    includeScore: true,
    keys: [
      { name: 'person.first_name', weight: WEIGHTS.first_name },
      { name: 'person.last_name', weight: WEIGHTS.last_name },
      { name: 'person.phone', weight: WEIGHTS.phone },
      { name: 'person.email', weight: WEIGHTS.email },
    ],
    threshold: SEARCH_THRESHOLD,
  });

  return signUpFuseList
    .search({
      $and: tokens.map((searchToken: string) => {
        const orFields: Fuse.Expression[] = [
          { $path: ['person', 'first_name'], $val: searchToken },
          { $path: ['person', 'last_name'], $val: searchToken },
          { $path: ['person', 'phone'], $val: searchToken },
          { $path: ['person', 'email'], $val: searchToken },
        ];

        return {
          $or: orFields,
        };
      }),
    })
    .map((fuseResult) => fuseResult.item);
}

export function filterParticipantsList(
  list: ZetkinEventParticipant[],
  filterString: string
): ZetkinEventParticipant[] {
  const tokens = toTokens(filterString);
  const participantsFuseList = new Fuse<ZetkinEventParticipant>(list, {
    includeScore: true,
    keys: [
      { name: 'first_name', weight: WEIGHTS.first_name },
      { name: 'last_name', weight: WEIGHTS.last_name },
      { name: 'phone', weight: WEIGHTS.phone },
      { name: 'email', weight: WEIGHTS.email },
    ],
    threshold: SEARCH_THRESHOLD,
  });

  return participantsFuseList
    .search({
      $and: tokens.map((searchToken: string) => {
        const orFields: Fuse.Expression[] = [
          { first_name: searchToken },
          { last_name: searchToken },
          { phone: searchToken },
          { email: searchToken },
        ];

        return {
          $or: orFields,
        };
      }),
    })
    .map((fuseResult) => fuseResult.item);
}
