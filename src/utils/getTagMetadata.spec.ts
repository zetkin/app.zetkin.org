import { dummyTableData } from '../../playwright/mockData/orgs/KPD/journeys/MarxistTraining/instances';
import { getTagMetadata } from './getTagMetadata';

describe('getTagMetadata.ts', () => {
  const { groups, valueTags } = getTagMetadata(dummyTableData);

  it('extracts group names correctly', () => {
    const groupNames = groups.map((group) => group?.title);
    expect(groupNames.sort()).toEqual(['Animals', 'Category', 'Priority']);
  });

  it('extracts value tags correctly', () => {
    expect(valueTags.length).toEqual(1);
    expect(Object.keys(valueTags[0]).sort()).toEqual([
      'color',
      'group',
      'id',
      'title',
      'value',
    ]);
    expect(valueTags[0].color).toEqual('green');
    expect(valueTags[0].title).toEqual('Number of pets');
  });
});
