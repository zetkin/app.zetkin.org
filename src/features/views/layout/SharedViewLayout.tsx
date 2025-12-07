import { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';
import { Group, ViewColumnOutlined } from '@mui/icons-material';

import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useView from '../hooks/useView';
import useViewGrid from '../hooks/useViewGrid';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIFutures from 'zui/ZUIFutures';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import messageIds from '../l10n/messageIds';
import oldTheme from 'theme';

interface SharedViewLayoutProps {
  children?: React.ReactNode;
}

const SharedViewLayout: FunctionComponent<SharedViewLayoutProps> = ({
  children,
}) => {
  const { orgId, viewId } = useNumericRouteParams();

  const { columnsFuture, rowsFuture } = useViewGrid(orgId, viewId);
  const viewFuture = useView(orgId, viewId);

  const title = (
    <ZUIFuture future={viewFuture}>
      {(view) => <span>{view.title}</span>}
    </ZUIFuture>
  );
  const subtitle = (
    // TODO: Replace with model eventually
    <ZUIFutures
      futures={{
        cols: columnsFuture,
        rows: rowsFuture,
      }}
    >
      {({ data: { cols, rows } }) => (
        <ZUIIconLabelRow
          iconLabels={[
            {
              icon: <Group />,
              label: (
                <Msg
                  id={messageIds.viewLayout.subtitle.people}
                  values={{ count: rows.length }}
                />
              ),
            },
            {
              icon: <ViewColumnOutlined />,
              label: (
                <Msg
                  id={messageIds.viewLayout.subtitle.columns}
                  values={{ count: cols.length }}
                />
              ),
            },
          ]}
        />
      )}
    </ZUIFutures>
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
        <Box
          mt={2}
          sx={{
            alignItems: 'center',
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: '1fr auto',
            gridTemplateRows: 'auto',
            transition: 'font-size 0.2s ease',
            width: '100%',
            [oldTheme.breakpoints.down('md')]: {
              gridTemplateColumns: '1fr',
            },
          }}
        >
          <Box
            alignItems="center"
            display="flex"
            flexDirection="row"
            overflow="hidden"
          >
            <Box>
              <Typography
                component="div"
                data-testid="page-title"
                noWrap
                sx={{
                  display: 'flex',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease',
                }}
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
        component="main"
        flexGrow={1}
        minHeight={0}
        position="relative"
        sx={{
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SharedViewLayout;
