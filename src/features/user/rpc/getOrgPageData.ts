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
  orgId: z.number()
});

type Params = z.input<typeof paramsSchema>;

type Result = {
  memberships: ZetkinMembership[];
  org: ZetkinOrganization;
  subOrgs: ZetkinOrganization[];
  campaigns: ZetkinCampaign[];
  surveys: ZetkinSurvey[];
};

export const getOrgPageData = {
  handler: handle,
  name: 'getOrgPageData',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getOrgPageData.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const endDate = new Date().toISOString();
  //  const organization = await apiClient.get<ZetkinOrganization>
  const [events, memberships, org, subOrgs, campaigns, surveys] =
    await Promise.all([
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/{orgId}/actions?filter=end_time>${endDate}`
      ),
      apiClient.get<ZetkinMembership[]>(`/api/users/me/memberships`),
      apiClient.get<ZetkinOrganization>(`/api/org/${params.orgId}`),
      apiClient.get<ZetkinOrganization[]>(
        `/api/org/${params.orgId}/sub_organizations`
      ),
      apiClient.get<ZetkinCampaign[]>(`/api/org/${params.orgId}/campaigns`),
      apiClient.get<ZetkinSurvey[]>(`/api/org/${params.orgId}/surveys`),
    ]);

  return {
    memberships,
    org,
    subOrgs,
    campaigns: campaigns.filter((c) =>
      events.some((e) => e.campaign?.id === c.id)
    ),
    surveys,
  };
}
