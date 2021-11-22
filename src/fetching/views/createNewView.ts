
import APIError from 'utils/apiError';
import { ZetkinView } from 'types/zetkin';

import { CreateNewViewApiReqBody } from 'pages/api/views/createNew';
import { defaultFetch } from '..';

export interface CreateNewViewPostBody {
    first_name_column_title: string;
    last_name_column_title: string;
    new_view_title: string;
}

export default function createNewView(orgId: string, fetch = defaultFetch) {
    return async ({
        first_name_column_title,
        last_name_column_title,
        new_view_title,
    }: CreateNewViewPostBody) : Promise<ZetkinView> => {
        const url = `/views/createNew?orgId=${orgId}`;

        const body = {
            columns: {
                first_name: {
                    title: first_name_column_title,
                },
                last_name: {
                    title: last_name_column_title,
                },
            },
            view: {
                title: new_view_title,
            },
        } as CreateNewViewApiReqBody;

        const res = await fetch(url, {
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (!res.ok) {
            throw new APIError('POST', url);
        }

        const resData = await res.json();
        return resData.data;
    };
}
