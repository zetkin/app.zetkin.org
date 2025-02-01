import { findOrAddItem } from 'utils/storeUtils/findOrAddItem';
import { remoteList } from 'utils/storeUtils';

describe('findOrAddItem', () => {
  const existingId = 'existing';
  const existingData = { id: existingId, value: 'Existing value' };
  const newId = 'new';

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('Creates a new item in list if none exist', () => {
    const list = remoteList();
    const result = findOrAddItem(list, newId);

    expect(list.items.find((item) => item.id == newId)).toBeTruthy();
    expect(result.id == newId).toBeTruthy();
  });

  it('Fetches an existing item', () => {
    const list = remoteList([existingData]);

    const result = findOrAddItem(list, existingId);

    expect(list.items.find((item) => item.id == existingId)).toBeTruthy();
    expect(result.id == existingId).toBeTruthy();
  });

  it('Sets loaded field to recent time for a created item', () => {
    const list = remoteList();
    const testDate = new Date('2020-01-01');
    jest.useFakeTimers().setSystemTime(testDate);

    const result = findOrAddItem(list, newId);
    expect(result.loaded).toBeDefined();
    expect(result.loaded).toBe(testDate.toISOString());
  });

  it('Leaves other fields unchanged', () => {
    const dataValue = { id: existingId, value: 'existing' };
    const deletedValue = true;
    const errorValue = 'error';
    const isLoadingValue = true;
    const isStaleValue = true;
    const mutatingValue = ['ChangedField'];

    const existingItem = {
      data: dataValue,
      deleted: deletedValue,
      error: errorValue,
      id: existingId,
      isLoading: isLoadingValue,
      isStale: isStaleValue,
      loaded: null,
      mutating: mutatingValue,
    };
    const list = remoteList();
    list.items.push(existingItem);

    const result = findOrAddItem(list, existingId);

    expect(result.data).toBe(dataValue);
    expect(result.deleted).toBe(deletedValue);
    expect(result.error).toBe(errorValue);
    expect(result.isLoading).toBe(isLoadingValue);
    expect(result.isStale).toBe(isStaleValue);
    expect(result.mutating).toBe(mutatingValue);
  });

  it('Returns the item', () => {
    const existingItem = {
      data: null,
      deleted: false,
      error: null,
      id: existingId,
      isLoading: false,
      isStale: false,
      loaded: null,
      mutating: [],
    };
    const list = remoteList();
    list.items.push(existingItem);

    const result = findOrAddItem(list, existingId);

    expect(result).toBe(existingItem);
  });

  it('Leaves loaded unchanged if new item is not created ', () => {
    const list = remoteList([existingData]);

    const result = findOrAddItem(list, existingId);

    expect(result.loaded).toBe(null);
  });
});
