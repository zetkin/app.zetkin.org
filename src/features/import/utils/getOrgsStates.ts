import { FakeDataType } from '../components/Importer/validation';

export const checkAllValuesAreZero = (obj: FakeDataType['summary']) => {
  const objs = Object.values(obj);
  return objs.every((item) => item.total === 0);
};

export const checkEmptyObj = (
  obj: FakeDataType['summary'] | { [key: number]: number }
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

export const getOrgsStates = (membershipsAdded: {
  byOrganization: { [key: number]: number };
  total: number;
}): { createdNum: number; orgs: string[] } => {
  const orgs: string[] = [];

  if (!checkEmptyObj(membershipsAdded.byOrganization)) {
    orgs.push(...Object.keys(membershipsAdded.byOrganization));
  }

  return { createdNum: membershipsAdded.total, orgs };
};
