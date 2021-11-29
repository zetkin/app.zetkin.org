import getBreadcrumbs from '../fetching/getBreadcrumbs';
import { FormattedMessage as Msg } from 'react-intl';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NextLink from 'next/link';
import { ParsedUrlQuery } from 'node:querystring';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Breadcrumbs, Link, Typography, useMediaQuery } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const getQueryString = function (query: ParsedUrlQuery): string {
    return Object.entries(query)
        .map(([key, val]) => `${key}=${val}`)
        .join('&');
};

const useStyles = makeStyles<Theme, { small?: boolean }>((theme) =>
    createStyles({
        breadcrumb: {
            display: 'block',
            fontSize: ({ small }) =>  small ? 12 : 16,
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'font-size 0.2s ease',
            whiteSpace: 'nowrap',

        },
        root: {
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            },
            '& p, svg': {
                fontSize: ({ small }) =>  small ? 12 : 16,
                transition: 'font-size 0.2s ease',
            },
        },
    }),
);

const BreadcrumbTrail =  ({ small } : { small?: boolean }) : JSX.Element | null => {
    const classes = useStyles({ small });
    const router = useRouter();
    const path = router.pathname;
    const query = getQueryString(router.query);
    const breadcrumbsQuery = useQuery(['breadcrumbs', path, query], getBreadcrumbs(path, query));
    const breadcrumbs = breadcrumbsQuery.data;
    const smallScreen= useMediaQuery('(max-width:700px)');
    const mediumScreen = useMediaQuery('(max-width:960px)');
    const largeScreen = useMediaQuery('(max-width:1200px)');

    if (!breadcrumbs) return null;

    return (
        <div className={ classes.root }>
            <Breadcrumbs
                aria-label="breadcrumb"
                itemsAfterCollapse={ smallScreen ? 1 : mediumScreen ? 2 : 3 }
                itemsBeforeCollapse={ smallScreen ? 1 : mediumScreen ? 2 : 3 }
                maxItems={ smallScreen ? 2 : mediumScreen ? 4 : largeScreen ? 6 : 10 }
                separator={ <NavigateNextIcon fontSize="small" /> }>
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
