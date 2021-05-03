import apiUrl from '../../utils/apiUrl';
import { NextApiRequest, NextApiResponse } from 'next';

type QueryData = { [key: string]: string }

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const orgId = req.query.orgId;
    if (!orgId) {
        return res.status(400).json({ error: 'orgId not provided' });
    }

    const breadcrumbs = await pathToCrumbs(req.query as QueryData, orgId as string);
    res.status(200).json({ breadcrumbs });
};

const pathToCrumbs = async (query: QueryData, orgId: string) => {
    const pathFields = query.pathname.split('/').slice(1);
    const crumbs = [];
    const curPath = [];

    for (const field of pathFields) {
        if (field.startsWith('[') && field.endsWith(']')) {
            const fieldName = field.slice(1, -1);
            const fieldValue = query[fieldName];

            const label = await fetchLabel(fieldName, fieldValue, orgId);
            curPath.push(fieldValue);
            crumbs.push({
                href: '/' + curPath.join('/'),
                label: label,
            });
        }
        else {
            curPath.push(field);
            crumbs.push({
                href: '/' + curPath.join('/'),
                labelMsg: `misc.breadcrumbs.${field}`,
            });
        }
    }
    return crumbs;
};

async function fetchLabel (fieldName: string, fieldValue: string, orgId: string) {
    if (fieldName === 'orgId') {
        const org = await fetch(apiUrl(`/orgs/${orgId}`))
            .then((res) => res.json());
        return `${org.data.title}`;
    }
    if (fieldName === 'personId') {
        const person = await fetch(apiUrl(`/orgs/${orgId}/people/${fieldValue}`))
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


