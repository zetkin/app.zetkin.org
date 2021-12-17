import { useQuery, UseQueryResult } from 'react-query';

import { defaultFetch } from '.';
import { ZetkinSurvey } from '../types/zetkin';

export default function getSurvey(orgId : string, surveyId: string, fetch = defaultFetch) {
    return async (): Promise<ZetkinSurvey> => {
        const res = await fetch(`/orgs/${orgId}/surveys/${surveyId}`);
        const body = await res.json();
        return body?.data;
    };
}

export const getSurveyQueryKey = (orgId: string, surveyId: string): ['survey', string, string] => ['survey', orgId, surveyId];

export const useGetSurvey = (orgId: string, surveyId: string): UseQueryResult<ZetkinSurvey> => {
    return useQuery(getSurveyQueryKey(orgId, surveyId), getSurvey(orgId, surveyId));
};