import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinOrganization,
  ZetkinMembership,
  ZetkinEvent,
  ZetkinCampaign,
  ZetkinSurvey,
} from 'utils/types/zetkin';
import { z } from 'zod';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;

export type OrgPageData = {
  id: number;
  memberships: ZetkinMembership[];
  org: ZetkinOrganization;
  subOrgs: ZetkinOrganization[];
  projects: ZetkinCampaign[];
  surveys: ZetkinSurvey[];
  events: ZetkinEvent[];
};

export const getOrgPageData = {
  handler: handle,
  name: 'getOrgPageData',
  schema: paramsSchema,
};

export default makeRPCDef<Params, OrgPageData>(getOrgPageData.name);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<OrgPageData> {
  const endDate = new Date().toISOString();
  //  const organization = await apiClient.get<ZetkinOrganization>
  const [events, memberships, org, subOrgs, projects, surveys] =
    await Promise.all([
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/${params.orgId}/actions?filter=end_time>${endDate}`
      ),
      apiClient.get<ZetkinMembership[]>(`/api/users/me/memberships`),
      apiClient.get<ZetkinOrganization>(`/api/orgs/${params.orgId}`),
      apiClient.get<ZetkinOrganization[]>(
        `/api/orgs/${params.orgId}/sub_organizations`
      ),
      apiClient.get<ZetkinCampaign[]>(`/api/orgs/${params.orgId}/campaigns`),
      apiClient.get<ZetkinSurvey[]>(`/api/orgs/${params.orgId}/surveys`),
    ]);

  return {
    id: params.orgId,
    memberships,
    org,
    subOrgs,
    projects,
    surveys,
    events,
  };
}
