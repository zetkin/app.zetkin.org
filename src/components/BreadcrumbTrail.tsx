import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Breadcrumbs, Item } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';

type Breadcrumb = {
    href: string;
    label?: string;
    labelMsg?: string;
}

type QueryData = {[key: string]: string}

const BreadcrumbTrail = () : JSX.Element | null => {
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[] | null>(null);

    const fetchBreadcrumbs = async (params: QueryData) => {
        const queryString = Object.entries(params)
            .map(([key, val]) => `${key}=${val}`).join('&');
        const completeUrl = `/api/breadcrumbs?${queryString}`;
        const data = await fetch(completeUrl).then(res => res.json());
        setBreadcrumbs(data.breadcrumbs);
    };

    useEffect(() => {
        const params = { path: router.pathname, ...router.query };
        fetchBreadcrumbs(params);
    }, [router]);


    if (!breadcrumbs) return null;

    return (
        <Breadcrumbs>
            { breadcrumbs.map(crumb => (
                <Item key={ crumb.href }>
                    <NextLink href={ crumb.href }>
                        <a>
                            { crumb.labelMsg ? <Msg id={ crumb.labelMsg }/> :
                                crumb.label }

                        </a>
                    </NextLink>
                </Item>
            )) }
        </Breadcrumbs>
    );
};

export default BreadcrumbTrail;