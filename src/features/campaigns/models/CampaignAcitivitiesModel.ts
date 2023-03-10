import { CallAssignmentData } from 'features/callAssignments/apiTypes';
import CallAssignmentsRepo from 'features/callAssignments/repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';

export type CampaignAcitivity = CallAssignmentData | ZetkinSurveyExtended;

export default class CampaignActivitiesModel extends ModelBase {
  private _callAssignmentsRepo: CallAssignmentsRepo;
  private _orgId: number;

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._callAssignmentsRepo = new CallAssignmentsRepo(env);
  }

  getActvities(): IFuture<CampaignAcitivity[]> {
    const callAssignmentsFuture = this._callAssignmentsRepo.getCallAssignments(
      this._orgId
    );

    if (!callAssignmentsFuture.data) {
      return new LoadingFuture();
    }

    return new ResolvedFuture([...callAssignmentsFuture.data]);
  }
}
