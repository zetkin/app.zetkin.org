import { remoteItemDeleted } from 'utils/storeUtils/remoteItemDeleted';
import { remoteList } from 'utils/storeUtils';
import { findOrAddItem } from './findOrAddItem';

describe('remoteItemDeleted', () => {
  const existingId = 'existing';
  const missingId = 'missing';

  it('Sets deleted value to true', () => {
    const list = remoteList();
    const item = findOrAddItem(list, existingId);

    remoteItemDeleted(list, existingId);
    expect(item.deleted).toBeTruthy();
  });

  it('Returns true if item was set as deleted', () => {
    const list = remoteList();
    findOrAddItem(list, existingId);

    const result = remoteItemDeleted(list, existingId);
    expect(result).toBeTruthy();
  });

  it('Returns false if item was not found', () => {
    const list = remoteList();

    const result = remoteItemDeleted(list, missingId);
    expect(result).toBeFalsy();
  });
});
