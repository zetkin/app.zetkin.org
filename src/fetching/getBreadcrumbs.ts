import { Breadcrumb } from '../types';
import { defaultFetch } from '.';

export default function getBreadcrumbs(pathname: string, queryString: string, fetch  = defaultFetch) {
    return async () : Promise<Breadcrumb[]> => {
        const bRes = await fetch(`/breadcrumbs?pathname=${pathname}&${queryString}`);
        const bData = await bRes.json();
        return bData.breadcrumbs;
    };
}

