import { mockObject } from '.';

describe('mockObject', () => {
  it('if only object given, returns object', () => {
    const obj = { hometown: 'New York', name: 'Jerry' };
    const mock = mockObject(obj);
    expect(mock).toMatchObject(obj);
  });

  it('overrides subset of object values', () => {
    const obj = {
      friends: ['Kramer', 'George'],
      hometown: 'New York',
      name: 'Jerry',
    };
    const newFriends = ['Kramer', 'George', 'Elaine'];
    const mock = mockObject(obj, {
      friends: newFriends,
    });
    expect(mock).toMatchObject({
      ...obj,
      friends: newFriends,
    });
  });
});
