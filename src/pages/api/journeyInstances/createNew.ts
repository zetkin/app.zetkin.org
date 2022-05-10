import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { ZetkinPerson } from 'types/zetkin';

const createNewInstance = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    query: { orgId, journeyId },
    method,
    body,
  } = req;

  // Return error if method other than POST
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const apiFetch = createApiFetch(req.headers);

  try {
    const instRes = await apiFetch(
      `/orgs/${orgId}/journeys/${journeyId}/instances`,
      {
        body: JSON.stringify({
          opening_note: body.note,
          title: body.title,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    );

    const instData = await instRes.json();
    const instId = instData.data.id;

    const putPeople = async (field: string, people: ZetkinPerson[]) => {
      await Promise.all(
        people.map((person: ZetkinPerson) =>
          apiFetch(
            `/orgs/${orgId}/journey_instances/${instId}/${field}/${person.id}`,
            { method: 'PUT' }
          )
        )
      );
    };

    if (body.assignees) {
      await putPeople('assignees', body.assignees);
    }

    if (body.subjects) {
      await putPeople('subjects', body.subjects);
    }

    res.status(200).json(instData);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default createNewInstance;
