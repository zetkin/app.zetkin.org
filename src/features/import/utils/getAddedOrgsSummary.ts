import { PersonImport } from './types';

export const checkAllValuesAreZero = (obj: PersonImport['summary']) => {
  const objs = Object.values(obj);
  return objs.every((item) => item.total === 0);
};

export const checkEmptyObj = (
  obj: PersonImport['summary'] | { [key: number]: number }
): boolean => {
  const objs = Object.values(obj);
  return Object.values(objs).every((value) => {
    if (typeof value === 'number' && value === 0) {
      return true;
    } else if (value instanceof Object === true) {
      return checkEmptyObj(value);
    } else {
      return false;
    }
  });
};

export interface AddedOrgsSummary {
  numCreated: number;
  orgs: string[];
}

export default function getAddedOrgsSummary(membershipsAdded: {
  byOrg: { [key: number]: number };
  total: number;
}): AddedOrgsSummary {
  const orgs: string[] = [];

  if (!checkEmptyObj(membershipsAdded.byOrg)) {
    orgs.push(...Object.keys(membershipsAdded.byOrg));
  }

  return { numCreated: membershipsAdded.total, orgs };
}
