import { FormattedMessage as Msg } from 'react-intl';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NextLink from 'next/link';
import { ParsedUrlQuery } from 'node:querystring';
import { useRouter } from 'next/router';
import { Breadcrumbs, Link, Typography, useMediaQuery } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';

type Breadcrumb = {
    href: string;
    label?: string;
    labelMsg?: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        breadcrumb: {
            display: 'block',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        root: {
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }),
);

const BreadcrumbTrail = () : JSX.Element | null => {
    const router = useRouter();
    const classes = useStyles();
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[] | null>(null);
    const isSmallScreen = useMediaQuery('(max-width:1280px)');

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
        <div className={ classes.root }>
            <Breadcrumbs aria-label="breadcrumb" maxItems={ isSmallScreen ? 2 : 8 } separator={ <NavigateNextIcon fontSize="small" /> }>
                { breadcrumbs.map((crumb, index) => {
                    if (index < breadcrumbs.length - 1) {
                        return (
                            <NextLink key={ crumb.href } href={ crumb.href } passHref>
                                <Link className={ classes.breadcrumb } color="inherit">
                                    { crumb.labelMsg ? <Msg id={ crumb.labelMsg } /> : crumb.label }
                                </Link>
                            </NextLink>
                        );
                    }
                    else {
                        return (
                            <Typography key={ crumb.href }>
                                { crumb.labelMsg ? <Msg id={ crumb.labelMsg } /> : crumb.label }
                            </Typography>
                        );
                    }
                }) }
            </Breadcrumbs>
        </div>
    );
};

export default BreadcrumbTrail;