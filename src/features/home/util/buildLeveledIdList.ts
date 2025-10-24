import { OrganizationTreeElement } from '../components/OrganizationsForest';

const buildLeveledIdListRecursive = (
  elements: OrganizationTreeElement[],
  level: number,
  list: number[]
) => {
  if (level <= 0) {
    return;
  }

  elements.forEach((elem) => {
    list.push(elem.organization.id);
  });

  elements.forEach((elem) => {
    buildLeveledIdListRecursive(elem.children, level - 1, list);
  });
};

/**
 * Build a list of organization ids down to a certain tree level. For example the tree 1 => 2 => 3, 4 together with level 2
 * would result in [1, 2], because that is all ids in the first two levels.
 * @param baseElements the organization forest
 * @param level the level to which ids should be included
 * @return the list of organization ids
 */
const buildLeveledIdList = (
  baseElements: OrganizationTreeElement[],
  level: number
): number[] => {
  const list: number[] = [];

  buildLeveledIdListRecursive(baseElements, level, list);

  return list;
};

export default buildLeveledIdList;
