import { NextApiRequest, NextApiResponse } from 'next';

import { COLUMN_TYPE } from 'types/views';
import { createApiFetch } from 'utils/apiFetch';
import { DATA_FIELD } from 'types/smartSearch';
import postView from 'fetching/views/postView';
import postViewColumn from 'fetching/views/postViewColumn';
import { getBrowserLanguage, getMessages } from 'utils/locale';

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const {
        query: { orgId },
        method,
    } = req;

    // Return error if method other than POST
    if (method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
        return;
    }

    const lang = getBrowserLanguage(req);

    const messages = await getMessages(lang, ['misc.views']);

    const apiFetch = createApiFetch(req.headers);

    try {
        const viewPostMethod = postView(orgId as string, apiFetch);
        const newView = await viewPostMethod({ title: messages['misc.views.newViewFields.title'] });
        const { id: newViewId } = newView;

        const columnsPostMethod = postViewColumn(orgId as string, newViewId, apiFetch);
        await columnsPostMethod({
            config: {
                field:  DATA_FIELD.FIRST_NAME,
            },
            title: messages['misc.nativePersonFields.first_name'],
            type: COLUMN_TYPE.PERSON_FIELD,
        });
        await columnsPostMethod({
            config: {
                field:  DATA_FIELD.LAST_NAME,
            },
            title: messages['misc.nativePersonFields.last_name'],
            type: COLUMN_TYPE.PERSON_FIELD,
        });

        res.status(200).json({ data: newView });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }

};
