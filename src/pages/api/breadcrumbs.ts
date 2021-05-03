import apiUrl from '../../utils/apiUrl';
import { ApiFetch, createApiFetch, RequestWithHeaders } from '../../utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const orgId = req.query.orgId;

    if (!orgId) {
        return res.status(400).json({ error: 'orgId not provided' });
    }

    const apiFetch = createApiFetch(req as RequestWithHeaders);

    const { query } = req;
    const pathname  = query.pathname as string;

    const pathFields = pathname.split('/').slice(1);
    const breadcrumbs = [];
    const curPath = [];

    for (const field of pathFields) {
        if (field.startsWith('[') && field.endsWith(']')) {
            const fieldName = field.slice(1, -1);
            const fieldValue = req.query[fieldName];

            const label = await fetchLabel(
                fieldName, fieldValue as string,
                orgId as string,
                apiFetch,
            );
            curPath.push(fieldValue);
            breadcrumbs.push({
                href: '/' + curPath.join('/'),
                label: label,
            });
        }
        else {
            curPath.push(field);
            breadcrumbs.push({
                href: '/' + curPath.join('/'),
                labelMsg: `misc.breadcrumbs.${field}`,
            });
        }
    }
    res.status(200).json({ breadcrumbs });
};

async function fetchLabel (fieldName: string, fieldValue: string, orgId: string, apiFetch: ApiFetch) {
    if (fieldName === 'orgId') {
        const org = await fetch(apiUrl(`/orgs/${orgId}`))
            .then((res) => res.json());
        return `${org.data.title}`;
    }
    if (fieldName === 'personId') {
        const person = await apiFetch(`/orgs/${orgId}/people/${fieldValue}`)
            .then((res) => res.json());
        return `${person.data.first_name} ${person.data.last_name}`;
    }
    if (fieldName === 'campaignId') {
        const campaign = await fetch(apiUrl(`/orgs/${orgId}/campaigns/${fieldValue}`))
            .then((res) => res.json());
        return `${campaign.data.title}`;
    }
    return `${fieldValue}`;
}




