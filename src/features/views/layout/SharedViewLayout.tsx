import { FormattedMessage } from 'react-intl';
import { FunctionComponent } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { Group, ViewColumnOutlined } from '@mui/icons-material';

import getView from '../fetching/getView';
import getViewColumns from '../fetching/getViewColumns';
import getViewRows from '../fetching/getViewRows';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUIQuery from 'zui/ZUIQuery';

const useStyles = makeStyles((theme) => ({
  main: {
    overflowX: 'hidden',
  },
  title: {
    marginBottom: '8px',
    transition: 'all 0.3s ease',
  },
  titleGrid: {
    alignItems: 'center',
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: '1fr auto',
    gridTemplateRows: 'auto',
    transition: 'font-size 0.2s ease',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

interface SharedViewLayoutProps {
  children?: React.ReactNode;
}

const SharedViewLayout: FunctionComponent<SharedViewLayoutProps> = ({
  children,
}) => {
  const router = useRouter();
  const { orgId, viewId } = router.query;
  const classes = useStyles();
  const viewQuery = useQuery(
    ['view', viewId],
    getView(orgId as string, viewId as string)
  );

  const title = (
    <ZUIQuery queries={{ viewQuery }}>
      {({ queries: { viewQuery } }) => <>{viewQuery.data.title}</>}
    </ZUIQuery>
  );
  const subtitle = (
    // TODO: Replace with model eventually
    <ZUIQuery
      queries={{
        colsQuery: useQuery(
          ['view', viewId, 'columns'],
          getViewColumns(orgId as string, viewId as string)
        ),
        rowsQuery: useQuery(
          ['view', viewId, 'rows'],
          getViewRows(orgId as string, viewId as string)
        ),
      }}
    >
      {({ queries: { colsQuery, rowsQuery } }) => (
        <ZUIIconLabelRow
          iconLabels={[
            {
              icon: <Group />,
              label: (
                <FormattedMessage
                  id="pages.people.views.layout.subtitle.people"
                  values={{ count: rowsQuery.data.length }}
                />
              ),
            },
            {
              icon: <ViewColumnOutlined />,
              label: (
                <FormattedMessage
                  id="pages.people.views.layout.subtitle.columns"
                  values={{ count: colsQuery.data.length }}
                />
              ),
            },
          ]}
        />
      )}
    </ZUIQuery>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      overflow="auto"
      position="relative"
      width={1}
    >
      <Box component="header" flexGrow={0} flexShrink={0} paddingLeft={2}>
        <Box className={classes.titleGrid} mt={2}>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="row"
            overflow="hidden"
          >
            <Box>
              <Typography
                className={classes.title}
                component="div"
                data-testid="page-title"
                noWrap
                style={{ display: 'flex' }}
                variant="h3"
              >
                {title}
              </Typography>
              <Typography color="secondary" component="h2" variant="h5">
                {subtitle}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className={classes.main}
        component="main"
        flexGrow={1}
        minHeight={0}
        position="relative"
      >
        {children}
      </Box>
    </Box>
  );
};

export default SharedViewLayout;
