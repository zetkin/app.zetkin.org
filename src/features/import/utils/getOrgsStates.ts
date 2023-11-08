import { FakeDataType } from '../components/Importer/validation';

export const isEmptyObj = (
  obj: FakeDataType['summary'] | { [key: number]: number }
): boolean => {
  const objs = Object.values(obj);
  return Object.values(objs).every((value) => {
    if (typeof value === 'number' && value === 0) {
      return true;
    } else if (value instanceof Object === true) {
      return isEmptyObj(value);
    } else {
      return false;
    }
  });
};

export const getOrgsStates = (
  createdOrgs: FakeDataType['summary']['createdPeople']['organizationMembershipsCreated'],
  updatedOrgs: FakeDataType['summary']['updatedPeople']['organizationMembershipsCreated']
): { orgs: string[]; updatedNum: number } => {
  const orgs: string[] = [];
  let updatedNum = 0;

  const calcOrgState = (
    org:
      | FakeDataType['summary']['createdPeople']['organizationMembershipsCreated']
      | FakeDataType['summary']['updatedPeople']['organizationMembershipsCreated']
  ) => {
    updatedNum += Object.values(org).reduce((acc, val) => acc + val, 0);
    orgs.push(...Object.keys(org));
  };

  if (!isEmptyObj(createdOrgs)) {
    calcOrgState(createdOrgs);
  }

  if (!isEmptyObj(updatedOrgs)) {
    calcOrgState(updatedOrgs);
  }
  return { orgs, updatedNum };
};
