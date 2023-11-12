import { eventRangeLoaded } from 'features/events/store';
import { IFuture } from 'core/caching/futures';
import { campaignsLoad, campaignsLoaded } from 'features/campaigns/store';
import getOrgPageData, { OrgPageData } from '../rpc/getOrgPageData';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { membershipsLoad, membershipsLoaded } from '../store';
import {
  orgPageLoad,
  orgPageLoaded,
  organizationLoad,
  organizationLoaded,
  subOrganizationsLoad,
  subOrganizationsLoaded,
} from 'features/organizations/store';
import { surveysLoad, surveysLoaded } from 'features/surveys/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useOrgPageData(orgId: number): IFuture<OrgPageData> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const cachedItem = useAppSelector(
    (state) => state.organizations.orgPageDataById[orgId]
  );

  const getData = async (): Promise<OrgPageData> => {
    dispatch(organizationLoad());
    dispatch(subOrganizationsLoad());
    dispatch(campaignsLoad());
    dispatch(surveysLoad());
    dispatch(membershipsLoad());

    const { memberships, org, subOrgs, projects, surveys, events } =
      await apiClient.rpc(getOrgPageData, { orgId });

    const firstDate = events.reduce((prev, cur) => {
      // Find minimum date
      const curDate = new Date(cur.start_time);
      return curDate < prev ? curDate : prev;
    }, new Date('9999-12-31'));

    const lastDate = events.reduce((prev, cur) => {
      // Find minimum date
      const curDate = new Date(cur.start_time);
      return curDate > prev ? curDate : prev;
    }, new Date(0));

    dispatch(
      eventRangeLoaded([
        [firstDate.toISOString(), lastDate.toISOString()],
        events,
      ])
    );
    dispatch(organizationLoaded(org));
    dispatch(subOrganizationsLoaded(subOrgs));
    dispatch(campaignsLoaded(projects));
    dispatch(surveysLoaded(surveys));
    dispatch(membershipsLoaded(memberships));
    return { id: orgId, memberships, org, subOrgs, projects, surveys, events };
  };
  return loadItemIfNecessary(cachedItem, dispatch, {
    actionOnLoad: () => orgPageLoad(orgId),
    actionOnSuccess: (data) => orgPageLoaded([orgId, data]),
    loader: () => getData(),
  });
}
