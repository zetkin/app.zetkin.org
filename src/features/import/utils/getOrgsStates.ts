import { FakeDataType } from '../components/Importer/validation';

export const isEmptyObj = (obj: { [key: number]: number }) => {
  return Object.keys(obj).every((value) => value.length === 0);
};

export const getOrgsStates = (
  createdOrgs: FakeDataType['summary']['createdPeople']['organizationMembershipsCreated'],
  updatedOrgs: FakeDataType['summary']['updatedPeople']['organizationMembershipsCreated']
) => {
  const orgs = [];
  let updatedNum = 0;

  if (!isEmptyObj(createdOrgs)) {
    updatedNum += Object.values(createdOrgs).reduce((acc, val) => acc + val, 0);
    orgs.push(...Object.keys(createdOrgs));
  }

  if (!isEmptyObj(updatedOrgs)) {
    updatedNum += Object.values(updatedOrgs).reduce((acc, val) => acc + val, 0);
    orgs.push(...Object.keys(updatedOrgs));
  }
  return { orgs, updatedNum };
};
