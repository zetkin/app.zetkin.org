import { Store } from './store';

export default class StoreModel {
  protected _store: Store;
  public onChange: (() => void) | null = null;

  constructor(store: Store) {
    this._store = store;
    this._store.subscribe(() => {
      if (this.onChange) {
        this.onChange();
      }
    });
  }
}
