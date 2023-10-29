import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NextLink from 'next/link';
import { Theme } from '@mui/material/styles';
import { useQuery } from 'react-query';
import { Breadcrumbs, Link, Typography, useMediaQuery } from '@mui/material';
import { NextRouter, useRouter } from 'next/router';

import { Breadcrumb } from 'utils/types';
import getBreadcrumbs from '../../../utils/fetching/getBreadcrumbs';
import { Msg } from 'core/i18n';

import messageIds from '../l10n/messageIds';

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
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    viewTitle: {
      fontWeight: ({ highlight }) => (highlight ? 'bolder' : 'inherit'),
    },
  })
);

function validMessageId(
  idStr: string
): keyof typeof messageIds.elements | null {
  if (idStr in messageIds.elements) {
    return idStr as keyof typeof messageIds.elements;
  } else {
    return null;
  }
}

const BreadcrumbTrail = ({
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

  const getLabel = (crumb: Breadcrumb) => {
    if (crumb.labelMsg) {
      const msgId = validMessageId(crumb.labelMsg);
      if (msgId) {
        return <Msg id={messageIds.elements[msgId]} />;
      }
    }

    return crumb.label;
  };

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
                <Link
                  className={classes.breadcrumb}
                  color="inherit"
                  underline="hover"
                >
                  {getLabel(crumb)}
                </Link>
              </NextLink>
            );
          } else {
            return (
              <Typography
                key={crumb.href}
                classes={{ root: classes.viewTitle }}
              >
                {getLabel(crumb)}
              </Typography>
            );
          }
        })}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbTrail;
