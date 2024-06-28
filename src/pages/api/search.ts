import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import makeSearchRequest from 'utils/api/makeSearchRequest';
import { SEARCH_DATA_TYPE } from 'features/search/components/types';

/**
 * To use
 *
 * fetch('/api/search?orgId=1', {
 *   method: "post",
 *   body: {q: "some search string"}
 * })
 */

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    method,
    query: { orgId },
    body: { q },
  } = req;

  // Return error if method other than POST
  if (method !== 'POST') {
    return res
      .setHeader('Allow', ['POST'])
      .status(405)
      .json({ error: `Method ${method} Not Allowed` });
  }

  // Validate orgId, return error if not valid
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

  const query = { orgId, q };
  const apiFetch = createApiFetch(req.headers);

  try {
    const results = await Promise.all([
      makeSearchRequest(SEARCH_DATA_TYPE.PERSON, query, apiFetch),
      makeSearchRequest(SEARCH_DATA_TYPE.CAMPAIGN, query, apiFetch),
      makeSearchRequest(SEARCH_DATA_TYPE.TASK, query, apiFetch),
      makeSearchRequest(SEARCH_DATA_TYPE.VIEW, query, apiFetch),
      makeSearchRequest(SEARCH_DATA_TYPE.CALL_ASSIGNMENT, query, apiFetch),
      makeSearchRequest(SEARCH_DATA_TYPE.SURVEY, query, apiFetch),
      makeSearchRequest(SEARCH_DATA_TYPE.JOURNEY_INSTANCE, query, apiFetch),
    ]);

    const searchResults = results.flat();

    res.status(200).json({ data: searchResults });
  } catch (err) {
    // error
    res.status(500).json({ error: 'Error making one or more of the requests' });
  }
};

export default search;
