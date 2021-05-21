import { ApiFetch, createApiFetch } from '../../utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    let query: Record<string, string>;
    try {
        query = validateQuery(req.query);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }

    const { orgId, pathname } = query;

    if (!orgId) {
        return res.status(400).json({ error: 'orgId not provided' });
    }

    const apiFetch = createApiFetch(req.headers);
    const pathFields = pathname.split('/').slice(1);
    const breadcrumbs = [];
    const curPath = [];

    for (const field of pathFields) {
        if (field.startsWith('[') && field.endsWith(']')) {
            const fieldName = field.slice(1, -1);
            const fieldValue = query[fieldName];

            const label = await fetchLabel(
                fieldName,
                fieldValue,
                orgId,
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

async function fetchLabel(
    fieldName: string,
    fieldValue: string,
    orgId: string,
    apiFetch: ApiFetch,
) {
    if (fieldName === 'orgId') {
        const org = await apiFetch(`/orgs/${orgId}`).then((res) =>
            res.json(),
        );
        return org.data.title;
    }
    if (fieldName === 'personId') {
        const person = await apiFetch(
            `/orgs/${orgId}/people/${fieldValue}`,
        ).then((res) => res.json());
        return `${person.data.first_name} ${person.data.last_name}`;
    }
    if (fieldName === 'campId') {
        const campaign = await apiFetch(
            `/orgs/${orgId}/campaigns/${fieldValue}`,
        ).then((res) => res.json());
        return campaign.data.title;
    }
    return fieldValue;
}

function validateQuery(query: {
    [key: string]: string | string[];
}): Record<string, string> {
    for (const key of Object.keys(query)) {
        if (typeof query[key] !== 'string') {
            throw new Error('Bad request');
        }
    }
    if (!query.pathname) {
        throw new Error('invalid path');
    }
    const pathname = query.pathname as string;
    const pathFields = pathname.split('/').slice(1);
    for (const field of pathFields) {
        if (field.startsWith('[') && field.endsWith(']')) {
            const fieldName = field.slice(1, -1);
            if (!query[fieldName]) {
                throw new Error('Request missing parameters');
            }
        }
    }
    return query as Record<string, string>;
}









