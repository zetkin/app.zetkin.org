import { remoteList } from 'utils/storeUtils';
import {
  remoteListCreated,
  remoteListLoad,
  remoteListLoaded,
  remoteListInvalidated,
} from 'utils/storeUtils/remoteListUtils';

describe('remoteListCreated', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('Sets loaded to recent time if list is created', () => {
    const testDate = new Date('2020-01-01');
    jest.useFakeTimers().setSystemTime(testDate);

    const resultList = remoteListCreated(null);

    expect(resultList.loaded).toBe(testDate.toISOString());
  });

  it('Leaves loaded untouched if list already exists', () => {
    const existingList = remoteList();
    const correctDate = new Date('2020-01-01');
    const incorrectDate = new Date('2025-01-01');
    jest.useFakeTimers().setSystemTime(incorrectDate);
    existingList.loaded = correctDate.toISOString();

    const resultList = remoteListCreated(existingList);

    expect(resultList.loaded).toBe(correctDate.toISOString());
  });
});

describe('remoteListLoad', () => {
  it('Sets isLoading to true for an existing list', () => {
    const existingList = remoteList();
    existingList.isLoading = false;

    const resultList = remoteListLoad(existingList);

    expect(resultList.isLoading).toBe(true);
  });

  it('Sets isLoading to true for a new list', () => {
    const resultList = remoteListLoad(null);

    expect(resultList.isLoading).toBe(true);
  });
});

describe('remoteListLoaded', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('Sets loaded to recent time for the list', () => {
    const correctDate = new Date('2020-01-01');
    jest.useFakeTimers().setSystemTime(correctDate);
    const loadedData = [{ id: 'Loaded example data' }];

    const resultList = remoteListLoaded(loadedData);

    expect(resultList.loaded).toBe(correctDate.toISOString());
  });

  it('Sets loaded to recent time for the items in the list', () => {
    const correctDate = new Date('2020-01-01');
    jest.useFakeTimers().setSystemTime(correctDate);
    const loadedData = [
      { id: 'Loaded example data A' },
      { id: 'Loaded example data B' },
    ];

    const resultList = remoteListLoaded(loadedData);

    expect(resultList.items.length).toBe(loadedData.length);
    resultList.items.forEach((item) => {
      expect(item.loaded).toBe(correctDate.toISOString());
    });
  });
});

describe('remoteListInvalidated', () => {
  it('Sets isStale to true for an existing list', () => {
    const existingList = remoteList();
    existingList.isStale = false;

    const resultList = remoteListInvalidated(existingList);

    expect(resultList.isStale).toBe(true);
  });

  it('Sets isStale to true for a new list', () => {
    const resultList = remoteListInvalidated(null);

    expect(resultList.isStale).toBe(true);
  });
});
