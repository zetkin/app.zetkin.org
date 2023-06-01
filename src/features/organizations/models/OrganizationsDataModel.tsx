import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import OrganizationsRepo from '../repos/OrganizationsRepo';

export default class OrganizationsDataModel extends ModelBase {
  private _repo: OrganizationsRepo;

  constructor(env: Environment) {
    super();

    this._repo = new OrganizationsRepo(env);
  }

  getData() {
    return this._repo.getUserOrganizations();
  }

  getOrganization(orgId: number) {
    return this._repo.getOrganization(orgId);
  }

  getOrganizations() {
    return this._repo.getOrganizations();
  }

  //rpc
  getOrganizationsTree() {
    this._repo.getOrganizationsTree();
  }

  getUserOrganizationsTree() {
    const userOrgs = this._repo.getUserMemberships();

    return userOrgs;
  }
}
