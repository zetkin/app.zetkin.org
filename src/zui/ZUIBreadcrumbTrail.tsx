import getBreadcrumbs from '../utils/fetching/getBreadcrumbs';
import { FormattedMessage as Msg } from 'react-intl';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import {
  Breadcrumbs,
  Link,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { NextRouter, useRouter } from 'next/router';

const getQueryString = function (router: NextRouter): string {
  // Only use parameters that are part of the path (e.g. [personId])
  // and not ones that are part of the actual querystring (e.g. ?filter_*)
  return Object.entries(router.query)
    .filter(([key]) => router.pathname.includes(`[${key}]`))
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
};

const useStyles = makeStyles<Theme, { highlight?: boolean }>((theme) =>
  createStyles({
    breadcrumb: {
      display: 'block',
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
    },
    viewTitle: {
      fontWeight: ({ highlight }) => (highlight ? 'bolder' : 'inherit'),
    },
  })
);

const ZUIBreadcrumbTrail = ({
  highlight,
}: {
  highlight?: boolean;
}): JSX.Element | null => {
  const classes = useStyles({ highlight });
  const router = useRouter();
  const path = router.pathname;
  const query = getQueryString(router);
  const breadcrumbsQuery = useQuery(
    ['breadcrumbs', path, query],
    getBreadcrumbs(path, query)
  );
  const smallScreen = useMediaQuery('(max-width:700px)');
  const mediumScreen = useMediaQuery('(max-width:960px)');
  const largeScreen = useMediaQuery('(max-width:1200px)');

  if (!breadcrumbsQuery.isSuccess) {
    return <div />;
  }

  return (
    <div className={classes.root}>
      <Breadcrumbs
        aria-label="breadcrumb"
        itemsAfterCollapse={smallScreen ? 1 : mediumScreen ? 2 : 3}
        itemsBeforeCollapse={smallScreen ? 1 : mediumScreen ? 2 : 3}
        maxItems={smallScreen ? 2 : mediumScreen ? 4 : largeScreen ? 6 : 10}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {breadcrumbsQuery.data.map((crumb, index) => {
          if (index < breadcrumbsQuery.data.length - 1) {
            return (
              <NextLink key={crumb.href} href={crumb.href} passHref>
                <Link className={classes.breadcrumb} color="inherit">
                  {crumb.labelMsg ? <Msg id={crumb.labelMsg} /> : crumb.label}
                </Link>
              </NextLink>
            );
          } else {
            return (
              <Typography
                key={crumb.href}
                classes={{ root: classes.viewTitle }}
              >
                {crumb.labelMsg ? <Msg id={crumb.labelMsg} /> : crumb.label}
              </Typography>
            );
          }
        })}
      </Breadcrumbs>
    </div>
  );
};

export default ZUIBreadcrumbTrail;
