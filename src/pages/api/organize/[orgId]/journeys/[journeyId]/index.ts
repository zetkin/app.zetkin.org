import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { ZetkinApiSuccessResponse } from 'api/utils/handleResponseData';
import { ZetkinJourneyInstance } from 'types/zetkin';
import { getTagMetadata, TagMetadata } from 'utils/getTagMetadata';

export interface JourneyInstancesData {
  journeyInstances: ZetkinJourneyInstance[];
  tagMetadata: TagMetadata;
}

const getJourneyTableData = async (
  req: NextApiRequest & { query: Record<string, string> },
  res: NextApiResponse<
    ZetkinApiSuccessResponse<JourneyInstancesData> | { error: string }
  >
): Promise<void> => {
  const {
    query: { orgId, journeyId },
    method,
  } = req;
  const apiFetch = createApiFetch(req.headers);

  // Return error if method other than GET
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  try {
    const journeyInstancesRes = await apiFetch(
      `/orgs/${orgId}/journeys/${journeyId}/instances`
    );
    const { data: journeyInstances } = await journeyInstancesRes.json();

    const tagMetadata = getTagMetadata(journeyInstances);

    res.status(200).json({ data: { journeyInstances, tagMetadata } });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default getJourneyTableData;
