import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import TagsRepo from '../repos/TagsRepo';
import { ZetkinTag } from 'utils/types/zetkin';

export default class TagModel extends ModelBase {
  private _orgId: number;
  private _repo: TagsRepo;
  private _tagId: number;

  assignToPerson(personId: number, value?: string) {
    this._repo.assignTagToPerson(this._orgId, personId, this._tagId, value);
  }

  constructor(env: Environment, orgId: number, tagId: number) {
    super();
    this._orgId = orgId;
    this._tagId = tagId;
    this._repo = new TagsRepo(env);
  }

  getTag(): IFuture<ZetkinTag> {
    return this._repo.getTag(this._orgId, this._tagId);
  }

  removeFromPerson(personId: number) {
    this._repo.removeTagFromPerson(this._orgId, personId, this._tagId);
  }
}
