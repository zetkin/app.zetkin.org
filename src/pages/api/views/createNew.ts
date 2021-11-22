import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { DATA_FIELD } from 'types/smartSearch';
import postView from 'fetching/views/postView';
import postViewColumn from 'fetching/views/postViewColumn';

export interface CreateNewViewApiReqBody {
    columns: {
        first_name: {
            title: string;
        };
        last_name: {
            title: string;
        };
    };
    view: {
        title: string;
    };
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const {
        query: { orgId },
        method,
        body,
    } = req;

    const { view, columns } = body as CreateNewViewApiReqBody;

    // Return error if method other than POST
    if (method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

    const apiFetch = createApiFetch(req.headers);

    const viewPostMethod = postView(orgId as string, apiFetch);
    const newView = await viewPostMethod({ title: view.title });
    const { id: newViewId } = newView;

    const columnsPostMethod = postViewColumn(orgId as string, newViewId, apiFetch);
    await columnsPostMethod({
        config: {
            field:  DATA_FIELD.FIRST_NAME,
        },
        title: columns.first_name.title,
        type: 'person_field',
    });
    await columnsPostMethod({
        config: {
            field:  DATA_FIELD.LAST_NAME,
        },
        title: columns.last_name.title,
        type: 'person_field',
    });

    res.status(200).json({ data: newView });
};
