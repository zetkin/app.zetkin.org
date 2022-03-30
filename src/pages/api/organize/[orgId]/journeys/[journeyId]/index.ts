/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: re-enable eslint
import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { getMessages } from 'utils/locale';
import { getTagColumns } from './getTagColumns';

import { dummyTableData } from 'components/journeys/JourneyInstancesDataTable/index.spec';

const getJourneyTableData = async (
  req: NextApiRequest & { query: Record<string, string> },
  res: NextApiResponse
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
    // const journeyInstancesRes = await apiFetch(
    //   `/orgs/${orgId}/journeys/${journeyId}/instances`
    // );
    // const { data: journeyInstances } = await journeyInstancesRes.json();
    // Retrieve column names
    const columnNames = Object.fromEntries(
      Object.entries(
        await getMessages('en', ['pages.organizeJourneyInstances'])
      ).map(([key, value]) => [key.split('.').pop(), value])
    );
    const journeyInstances = dummyTableData;
    const dynamicColumns = getTagColumns(journeyInstances, columnNames);

    res
      .status(200)
      .json({ data: { columnNames, dynamicColumns, journeyInstances } });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default getJourneyTableData;
