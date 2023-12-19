import { PersonImportSummary } from './types';

export const checkAllValuesAreZero = (obj: PersonImportSummary) => {
  const objs = Object.values(obj);
  return objs.every((item) => item.total === 0);
};

export const checkEmptyObj = (
  obj: PersonImportSummary | { [key: number]: number }
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

export default function getAddedOrgsSummary(
  addedToOrg: PersonImportSummary['addedToOrg']
): AddedOrgsSummary {
  const orgs: string[] = [];

  if (!checkEmptyObj(addedToOrg.byOrg)) {
    orgs.push(...Object.keys(addedToOrg.byOrg));
  }

  return { numCreated: addedToOrg.total, orgs };
}
