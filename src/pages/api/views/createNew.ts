import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { CreateNewViewPostBody } from 'fetching/views/createNewView';
import { DATA_FIELD } from 'types/smartSearch';
import postView from 'fetching/views/postView';
import postViewColumn from 'fetching/views/postViewColumn';

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const {
        query: { orgId },
        method,
        body,
    } = req;

    const {
        first_name_column_title,
        last_name_column_title,
        new_view_title,
    } = body as CreateNewViewPostBody;

    // Return error if method other than POST
    if (method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

    const apiFetch = createApiFetch(req.headers);

    const viewPostMethod = postView(orgId as string, apiFetch);
    const newView = await viewPostMethod({ title: new_view_title });
    const { id: newViewId } = newView;

    const columnsPostMethod = postViewColumn(orgId as string, newViewId, apiFetch);
    await columnsPostMethod({
        config: {
            field:  DATA_FIELD.FIRST_NAME,
        },
        title: first_name_column_title,
        type: 'person_field',
    });
    await columnsPostMethod({
        config: {
            field:  DATA_FIELD.LAST_NAME,
        },
        title: last_name_column_title,
        type: 'person_field',
    });

    res.status(200).json({ data: newView });
};
