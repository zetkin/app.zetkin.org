import { updateOrCreateItemWithData } from 'utils/storeUtils/updateOrCreateItemWithData';
import { remoteList } from 'utils/storeUtils';
import { findOrAddItem } from './findOrAddItem';

describe('updateOrCreateItemWithData', () => {
  const newId = 'new';
  const existingId = 'existing';

  const newData = { id: newId, value: 'New data' };
  const existingData = { id: existingId, value: 'Existing data' };

  const existingUpdatedData = {
    id: existingId,
    value: 'Existing data, updated',
  };

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('Creates an item with data if none exist', () => {
    const list = remoteList();
    updateOrCreateItemWithData(list, newData);

    const foundItemInList = list.items.find((item) => item.id == newId);

    expect(foundItemInList).toBeTruthy();
    expect(foundItemInList?.data).toBe(newData);
  });

  it('Finds and updates an existing item with data', () => {
    const list = remoteList();
    const existingItem = findOrAddItem(list, existingId);

    updateOrCreateItemWithData(list, existingUpdatedData);

    expect(existingItem.data).toBe(existingUpdatedData);
  });

  it('Sets loaded to a recent time', () => {
    const list = remoteList();

    const currentDate = new Date('2020-01-01');
    jest.useFakeTimers().setSystemTime(currentDate);

    const resultNew = updateOrCreateItemWithData(list, newData);

    findOrAddItem(list, existingId);
    const resultUpdated = updateOrCreateItemWithData(list, existingUpdatedData);

    expect(resultNew.loaded).toBeDefined();
    expect(resultNew.loaded).toBe(currentDate.toISOString());

    expect(resultUpdated.loaded).toBeDefined();
    expect(resultUpdated.loaded).toBe(currentDate.toISOString());
  });

  it('Empties the mutating array', () => {
    const list = remoteList();

    const existingItem = findOrAddItem(list, existingId);
    existingItem.data = existingData;
    existingItem.mutating = ['ChangedField'];

    const resultUpdated = updateOrCreateItemWithData(list, existingUpdatedData);

    expect(resultUpdated.mutating.length).toBe(0);
  });

  it('Sets isLoading to false', () => {
    const list = remoteList();

    const existingItem = findOrAddItem(list, existingId);
    existingItem.data = existingData;
    existingItem.isLoading = true;

    const resultUpdated = updateOrCreateItemWithData(list, existingUpdatedData);

    expect(resultUpdated.isLoading).toBeFalsy();
  });

  it('Returns the updated/fetched item', () => {
    const list = remoteList();

    const existingItem = findOrAddItem(list, existingId);
    const resultUpdated = updateOrCreateItemWithData(list, existingUpdatedData);

    const resultNew = updateOrCreateItemWithData(list, newData);

    const foundUpdatedItemInList = list.items.find(
      (item) => item.id == existingId
    );
    const foundNewItemInList = list.items.find((item) => item.id == newId);

    expect(foundUpdatedItemInList).toBeDefined();
    expect(foundUpdatedItemInList?.data).toBe(existingUpdatedData);

    expect(foundNewItemInList).toBeDefined();
    expect(foundNewItemInList?.data).toBe(newData);

    expect(existingItem).toBe(resultUpdated);
    expect(resultUpdated).toBe(resultUpdated);
    expect(resultNew.data).toBe(newData);
  });
});
