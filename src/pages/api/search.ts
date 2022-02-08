import { createApiFetch } from 'utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

import handleResponseData from 'api/utils/handleResponseData';
import { ZetkinCampaign, ZetkinPerson, ZetkinTask } from 'types/zetkin';

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
      const req = await apiFetch(
        `/orgs/${orgId}/search/${SEARCH_DATA_TYPE.PERSON}`,
        {
          body: JSON.stringify({ q }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );
      const data = await handleResponseData<ZetkinPerson[]>(req, 'post');
      return data.map((result) => ({
        match: result,
        type: SEARCH_DATA_TYPE.PERSON,
      }));
    };

    const campaignRequest = async () => {
      const req = await apiFetch(
        `/orgs/${orgId}/search/${SEARCH_DATA_TYPE.CAMPAIGN}`,
        {
          body: JSON.stringify({ q }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );
      const data = await handleResponseData<ZetkinCampaign[]>(req, 'post');
      return data.map<SearchResult>((result) => ({
        match: result,
        type: SEARCH_DATA_TYPE.CAMPAIGN,
      }));
    };

    const taskRequest = async () => {
      const req = await apiFetch(
        `/orgs/${orgId}/search/${SEARCH_DATA_TYPE.TASK}`,
        {
          body: JSON.stringify({ q }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );
      const data = await handleResponseData<ZetkinTask[]>(req, 'post');
      return data.map<SearchResult>((result) => ({
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
