import { ApiFetch, createApiFetch } from '../../utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const { query, error } = validateQuery(req.query);

    if (query) {
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
    }
    else {
        return res.status(400).json({ error });
    }

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
    if (fieldName === 'taskId') {
        const campaign = await apiFetch(
            `/orgs/${orgId}/tasks/${fieldValue}`,
        ).then((res) => res.json());
        return campaign.data.title;
    }
    return fieldValue;
}

const validateQuery =(query: Record<string, string | string[]>): {
    error?: string;
    query?: Record<string, string>;
 } => {
    for (const key of Object.keys(query)) {
        if (typeof query[key] !== 'string') {
            return {
                error: 'Bad request',
            };
        }
    }
    if (!query.pathname) {
        return {
            error: 'Invalid path',
        };
    }
    const pathname = query.pathname as string;
    const pathFields = pathname.split('/').slice(1);
    for (const field of pathFields) {
        if (field.startsWith('[') && field.endsWith(']')) {
            const fieldName = field.slice(1, -1);
            if (!query[fieldName]) {
                return {
                    error: 'Request missing parameters',
                };
            }
        }
    }
    return { query: query as Record<string, string> };
};









