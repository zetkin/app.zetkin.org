import { Store } from 'core/store';
import { ZetkinTag } from 'types/zetkin';
import { tagsResolved } from '../store';

export default class TagListModel {
  private _store: Store;
  private _orgId: number;
  private _pendingPromise: Promise<void> | null;

  constructor(store: Store, orgId: number = 1) {
    console.log('constructing');
    this._store = store;
    this._orgId = orgId;
    this._pendingPromise = null;
  }

  public getAll(): ZetkinTag[] {
    const list = this._store.getState().tags.tagList;

    // TODO: Implement caching
    if (list.loaded) {
      console.log('Getting data')
      return list.items.map((item) => item.data);
    } else {
      console.log('Getting promise')
      this._pendingPromise = this._pendingPromise || fetch(`/api/orgs/${this._orgId}/people/tags`).then(
        async (res) => {
          const data = await res.json();
          const tags = data.data as ZetkinTag[];
          this._store.dispatch(tagsResolved(tags));
          this._pendingPromise = null;
        }
      );

      //throw this._pendingPromise;

      return [];
    }
  }
}
