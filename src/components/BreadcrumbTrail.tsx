import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { ParsedUrlQuery } from 'node:querystring';
import { useRouter } from 'next/router';
import { Breadcrumbs, Item } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';

type Breadcrumb = {
    href: string;
    label?: string;
    labelMsg?: string;
}

const BreadcrumbTrail = () : JSX.Element | null => {
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[] | null>(null);

    const fetchBreadcrumbs = async (
        pathname: string,
        query: ParsedUrlQuery,
    ) => {
        const queryString = Object.entries(query)
            .map(([key, val]) => `${key}=${val}`)
            .join('&');
        const completeUrl = `/api/breadcrumbs?pathname=${pathname}&${queryString}`;
        const data = await fetch(completeUrl).then((res) => res.json());
        setBreadcrumbs(data.breadcrumbs);
    };

    useEffect(() => {
        fetchBreadcrumbs(router.pathname, router.query);
    }, [router.pathname, router.query]);

    if (!breadcrumbs) return null;

    return (
        <Breadcrumbs>
            { breadcrumbs.map(crumb => (
                <Item key={ crumb.href }>
                    <NextLink href={ crumb.href }>
                        <a>
                            { crumb.labelMsg ? <Msg id={ crumb.labelMsg }/>: crumb.label }
                        </a>
                    </NextLink>
                </Item>
            )) }
        </Breadcrumbs>
    );
};

export default BreadcrumbTrail;