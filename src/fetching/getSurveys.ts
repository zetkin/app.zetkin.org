import { useQuery, UseQueryResult } from 'react-query';

import { defaultFetch } from '.';
import { ZetkinSurvey } from '../types/zetkin';

export default function getSurveys(orgId : string, fetch = defaultFetch) {
    return async (): Promise<ZetkinSurvey[]> => {
        const sIdRes = await fetch(`/orgs/${orgId}/surveys`);
        const sIdData = await sIdRes.json();
        return sIdData.data;
    };
}

export const getSurveysQueryKey = (orgId: string): ['surveys', string] => ['surveys', orgId];

export const useGetSurveys = (orgId: string): UseQueryResult<ZetkinSurvey[]> => {
    return useQuery(getSurveysQueryKey(orgId), getSurveys(orgId));
};