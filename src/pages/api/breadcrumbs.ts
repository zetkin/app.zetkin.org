import apiUrl from '../../utils/apiUrl';
import { NextApiRequest, NextApiResponse } from 'next';

type QueryObject = {[key: string]: string | string[]}
type ReturnedData = {[key: string]: {[key: string]: string}}

export default async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const returnedData = await fetchData(req.query);
    const breadcrumbs = pathToCrumbs(req.query.path as string, returnedData);
    res.status(200).json({ breadcrumbs });
};

const pathToCrumbs = (path: string, data: ReturnedData) => {
    const regexp = new RegExp(/\[(.*?)\]/);
    const pathArray = path.split('/').slice(1);

    const realPath = pathArray.map((path) => {
        const matchedPath = path.match(regexp);
        if (matchedPath) {
            return data[matchedPath[1]].id;
        }
        else return path;
    });

    const breadcrumbs = pathArray.map((path: string, i: number) => {
        let href, label, labelMsg;
        const matchedPath = path.match(regexp);
        if (matchedPath) {
            label = data[matchedPath[1]].label;
            href = '/' + realPath.slice(0, i + 1).join('/');
        }
        else {
            labelMsg = `misc.breadcrumbs.${path}`;
            href = '/' + realPath.slice(0, i + 1).join('/');
        }

        return {
            href,
            label,
            labelMsg,
        };
    });
    return breadcrumbs;
};

const fetchData = async (query: QueryObject) => {
    const data= {} as ReturnedData;

    const { orgId } = query;
    const org = await fetch(apiUrl(`/orgs/${orgId}`)).then((res) => res.json());
    data.orgId = { id: org.data.id, label: org.data.title };

    if (query.personId) {
        const person = await fetch(
            apiUrl(`/orgs/${orgId}/people/${query.personId}`),
        ).then((res) => res.json());
        data.personId = {
            id: person.data.id,
            label: `${person.data.first_name} ${person.data.last_name}`,
        };
    }

    if (query.campaignId) {
        const campaign = await fetch(
            apiUrl(`/orgs/${orgId}/campaigns/${query.campaignId}`),
        ).then((res) => res.json());
        data.campaignId = { id: campaign.data.id, label: campaign.data.title };
    }

    return data;
};
