import { Store } from 'core/store';
import { ZetkinTag } from 'types/zetkin';
import { assignedTagsResolved } from '../store';
import TagListModel from './TagListModel';

export enum TagAssignState {
  DEFAULT,
  ADD,
  CREATE,
  EDIT,
  SET_VALUE,
}

export default class TagAssignModel {
  private _store: Store;
  private _basePath: string;
  private _listModel: TagListModel;
  private _state: TagAssignState;
  private _selectedTag: ZetkinTag | null;
  private _pendingPromise: Promise<void> | null = null;

  constructor(store: Store, orgId: number, basePath: string) {
    this._store = store;
    this._basePath = basePath;
    this._listModel = new TagListModel(store, orgId);
    this._selectedTag = null;
    this._state = TagAssignState.DEFAULT;
  }

  public get state(): TagAssignState {
    return this._state;
  }

  public pickTag(tag: ZetkinTag): void {
    if (tag.value_type) {
      this._selectedTag = tag;
      this._state = TagAssignState.SET_VALUE;
    }
  }

  public getAssignedTags(): ZetkinTag[] {
    const list = this._store.getState().tags.tagsByTypeAndId.person[1];

    // TODO: Implement caching
    if (list?.loaded) {
      return list.items.map((item) => item.data);
    } else {
      this._pendingPromise =
        this._pendingPromise ||
        fetch(`/api/orgs/1/people/1/tags`).then(async (res) => {
          const data = await res.json();
          const tags = data.data as ZetkinTag[];
          this._store.dispatch(assignedTagsResolved({ id: 1, tags }));
          this._pendingPromise = null;
        });

      //throw this._pendingPromise;

      return [];
    }
  }
}
