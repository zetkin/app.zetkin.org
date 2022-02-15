import { nestByParentId } from '.';

const flatOrgs = [
  {
    id: 1,
    parentId: null,
    title: 'My Organization',
  },
  {
    id: 2,
    parentId: 1,
    title: 'My Other Organization',
  },
  {
    id: 3,
    parentId: 1,
    title: 'My Third Organization',
  },
  {
    id: 33,
    parentId: 3,
    title: 'Next level org',
  },
];

describe('nestByParentId()', () => {
  it('Returns an organisation tree from a flat array of organisations', async () => {
    const orgsTree = nestByParentId(flatOrgs, null);
    expect(orgsTree.length).toEqual(1);
    expect(orgsTree[0].title).toEqual(flatOrgs[0].title);
    expect(orgsTree[0]?.children?.length).toEqual(2);
    expect(orgsTree[0]?.children[1].children[0].id).toEqual(flatOrgs[3].id);
  });
});
