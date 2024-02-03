import { ApiFetch } from 'utils/apiFetch';
import handleResponseData from './handleResponseData';
import {
  CallAssignmentSearchResult,
  CampaignSearchResult,
  JourneyInstanceSearchResult,
  PersonSearchResult,
  SEARCH_DATA_TYPE,
  SurveySearchResult,
  TaskSearchResult,
  ViewSearchResult,
} from 'features/search/components/types';

async function makeSearchRequest(
  dataType: SEARCH_DATA_TYPE.VIEW,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<ViewSearchResult[]>;
async function makeSearchRequest(
  dataType: SEARCH_DATA_TYPE.TASK,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<TaskSearchResult[]>;
async function makeSearchRequest(
  dataType: SEARCH_DATA_TYPE.CAMPAIGN,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<CampaignSearchResult[]>;
async function makeSearchRequest(
  dataType: SEARCH_DATA_TYPE.PERSON,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<PersonSearchResult[]>;
async function makeSearchRequest(
  dataType: SEARCH_DATA_TYPE.CALL_ASSIGNMENT,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<CallAssignmentSearchResult[]>;
async function makeSearchRequest(
  dataType: SEARCH_DATA_TYPE.SURVEY,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<SurveySearchResult[]>;
async function makeSearchRequest(
  dataType: SEARCH_DATA_TYPE.JOURNEY_INSTANCE,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<JourneyInstanceSearchResult[]>;
async function makeSearchRequest(
  dataType: unknown,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<unknown[]> {
  const { orgId, q } = query;
  const req = await apiFetch(`/orgs/${orgId}/search/${dataType}`, {
    body: JSON.stringify({ q }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const data = await handleResponseData<unknown[]>(req, 'post');
  return data.map((result) => ({
    match: result,
    type: dataType,
  }));
}

export default makeSearchRequest;
