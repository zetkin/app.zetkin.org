import { ApiFetch, createApiFetch } from 'utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

import handleResponseData from 'api/utils/handleResponseData';
import { ZetkinCampaign, ZetkinPerson, ZetkinTask } from 'types/zetkin';

const searchRequest = async <G>(
  dataType: SEARCH_DATA_TYPE,
  query: {
    orgId: number | string;
    q: string;
  },
  apiFetch: ApiFetch
): Promise<G[]> => {
  const { orgId, q } = query;
  const req = await apiFetch(`/orgs/${orgId}/search/${dataType}`, {
    body: JSON.stringify({ q }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const data = await handleResponseData<G[]>(req, 'post');
  return data;
};

/**
 * To use
 *
 * fetch('/api/search?orgId=1', {
 *   method: "post",
 *   body: {q: "some search string"}
 * })
 */

export enum SEARCH_DATA_TYPE {
  PERSON = 'person',
  CAMPAIGN = 'campaign',
  TASK = 'task',
}

interface PersonSearchResult {
  type: SEARCH_DATA_TYPE.PERSON;
  match: ZetkinPerson;
}
interface CampaignSearchResult {
  type: SEARCH_DATA_TYPE.CAMPAIGN;
  match: ZetkinCampaign;
}
interface TaskSearchResult {
  type: SEARCH_DATA_TYPE.TASK;
  match: ZetkinTask;
}

export type SearchResult =
  | PersonSearchResult
  | CampaignSearchResult
  | TaskSearchResult;

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { orgId } = req.query;
  const { method } = req;

  // Return error if method other than POST
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  // Validate orgId
  if (!orgId) {
    return res
      .status(400)
      .json({ error: 'Query Parameter "orgId" not provided' });
  }
  if (typeof orgId === 'object') {
    return res
      .status(400)
      .json({ error: 'Query Parameter "orgId" must by a single value' });
  }

  const apiFetch = createApiFetch(req.headers);

  const { q } = req.body;

  try {
    const peopleRequest = async () => {
      const data = await searchRequest<ZetkinPerson>(
        SEARCH_DATA_TYPE.PERSON,
        { orgId, q },
        apiFetch
      );
      return data.map<PersonSearchResult>((result) => ({
        match: result,
        type: SEARCH_DATA_TYPE.PERSON,
      }));
    };

    const campaignRequest = async () => {
      const data = await searchRequest<ZetkinCampaign>(
        SEARCH_DATA_TYPE.CAMPAIGN,
        { orgId, q },
        apiFetch
      );
      return data.map<CampaignSearchResult>((result) => ({
        match: result,
        type: SEARCH_DATA_TYPE.CAMPAIGN,
      }));
    };

    const taskRequest = async () => {
      const data = await searchRequest<ZetkinTask>(
        SEARCH_DATA_TYPE.TASK,
        { orgId, q },
        apiFetch
      );
      return data.map<TaskSearchResult>((result) => ({
        match: result,
        type: SEARCH_DATA_TYPE.TASK,
      }));
    };

    const results = await Promise.all([
      peopleRequest(),
      campaignRequest(),
      taskRequest(),
    ]);
    const searchResults = results.flat();

    res.status(200).json({ data: searchResults });
  } catch (err) {
    // error
    res.status(500).json({ error: 'Error making one or more of the requests' });
  }
};

export default search;
