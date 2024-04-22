import shouldLoad from './shouldLoad';
import { remoteItem, remoteList } from 'utils/storeUtils';

describe('shouldLoad()', () => {
  const dummyItemData = {
    id: 1,
    title: 'Dummy',
  };

  describe('with lists', () => {
    it('returns true when list is undefined', () => {
      const result = shouldLoad(undefined);
      expect(result).toBeTruthy();
    });

    it('returns true when list has not loaded', () => {
      const list = remoteList([dummyItemData]);
      list.loaded = null;

      const result = shouldLoad(list);
      expect(result).toBeTruthy();
    });

    it('returns true when list has loaded but is stale', () => {
      const list = remoteList([dummyItemData]);
      list.loaded = new Date().toISOString();
      list.isStale = true;

      const result = shouldLoad(list);
      expect(result).toBeTruthy();
    });

    it('returns true when list has loaded but too long ago', () => {
      const loaded = new Date();
      loaded.setMinutes(loaded.getMinutes() - 6);

      const list = remoteList([dummyItemData]);
      list.loaded = loaded.toISOString();

      const result = shouldLoad(list);
      expect(result).toBeTruthy();
    });

    it('returns false when list has loaded recently', () => {
      const list = remoteList([dummyItemData]);
      list.loaded = new Date().toISOString();

      const result = shouldLoad(list);
      expect(result).toBeFalsy();
    });

    it('returns false when list is already loading', () => {
      const list = remoteList([dummyItemData]);
      list.isLoading = true;

      const result = shouldLoad(list);
      expect(result).toBeFalsy();
    });
  });

  describe('with items', () => {
    it('returns true when item is undefined', () => {
      const result = shouldLoad(undefined);
      expect(result).toBeTruthy();
    });

    it('returns true when item has not loaded', () => {
      const item = remoteItem(dummyItemData.id);
      item.loaded = null;

      const result = shouldLoad(item);
      expect(result).toBeTruthy();
    });

    it('returns true when item has loaded but is stale', () => {
      const item = remoteItem(dummyItemData.id);
      item.loaded = new Date().toISOString();
      item.isStale = true;

      const result = shouldLoad(item);
      expect(result).toBeTruthy();
    });

    it('returns true when item has loaded but too long ago', () => {
      const loaded = new Date();
      loaded.setMinutes(loaded.getMinutes() - 6);

      const item = remoteItem(dummyItemData.id);
      item.loaded = loaded.toISOString();
      item.isStale = true;

      const result = shouldLoad(item);
      expect(result).toBeTruthy();
    });

    it('returns false when item has loaded recently', () => {
      const item = remoteItem(dummyItemData.id);
      item.loaded = new Date().toISOString();

      const result = shouldLoad(item);
      expect(result).toBeFalsy();
    });

    it('returns false when item is already loading', () => {
      const item = remoteItem(dummyItemData.id);
      item.isLoading = true;

      const result = shouldLoad(item);
      expect(result).toBeFalsy();
    });

    it('returns false when item is deleted', () => {
      const item = remoteItem(dummyItemData.id);
      item.deleted = true;

      const result = shouldLoad(item);
      expect(result).toBeFalsy();
    });
  });

  describe('with map of lists', () => {
    it('returns true when any needs loading', () => {
      const map = {
        '1': remoteList([dummyItemData]),
        '2': remoteList([dummyItemData]),
      };

      // List for 1 needs loading
      map[1].isStale = true;

      const result = shouldLoad(map);
      expect(result).toBeTruthy();
    });

    it('returns false when none need loading', () => {
      const map = {
        '1': remoteList([dummyItemData]),
        '2': remoteList([dummyItemData]),
      };

      // Both lists have loaded
      map[1].loaded = new Date().toISOString();
      map[2].loaded = new Date().toISOString();

      const result = shouldLoad(map);
      expect(result).toBeFalsy();
    });
  });

  describe('with map of items', () => {
    it('returns true when any needs loading', () => {
      const map = {
        '1': remoteItem(dummyItemData.id),
        '2': remoteItem(dummyItemData.id),
      };

      // List for 1 needs loading
      map[1].isStale = true;

      const result = shouldLoad(map);
      expect(result).toBeTruthy();
    });

    it('returns false when none need loading', () => {
      const map = {
        '1': remoteItem(dummyItemData.id),
        '2': remoteItem(dummyItemData.id),
      };

      // Both lists have loaded
      map[1].loaded = new Date().toISOString();
      map[2].loaded = new Date().toISOString();

      const result = shouldLoad(map);
      expect(result).toBeFalsy();
    });
  });
});
