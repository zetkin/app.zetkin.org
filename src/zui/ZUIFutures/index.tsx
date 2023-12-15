import { ErrorOutlined } from '@mui/icons-material';
import { FC } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import { IFuture } from 'core/caching/futures';
import { Msg } from 'core/i18n';

import messageIds from 'zui/l10n/messageIds';

interface ZUIFuturesProps<G extends Record<string, unknown>> {
  children?:
    | JSX.Element
    | (({
        data,
      }: {
        data: { [I in keyof G]: G[I] };
      }) => React.ReactElement | null);
  errorIndicator?: React.ReactElement;
  futures: { [I in keyof G]: IFuture<G[I]> };
  loadingIndicator?: React.ReactElement;
}

function ZUIFutures<G extends Record<string, unknown>>({
  children,
  errorIndicator,
  futures,
  loadingIndicator,
}: ZUIFuturesProps<G>): ReturnType<FC> {
  if (Object.values(futures).some((future) => future.error)) {
    return (
      errorIndicator || (
        <Box
          alignItems="center"
          data-testid="error-indicator"
          display="flex"
          flexDirection="column"
          justifyItems="center"
          padding={3}
          width="100%"
        >
          <ErrorOutlined color="error" fontSize="large" />
          <Typography variant="body1">
            <Msg id={messageIds.futures.errorLoading} />
          </Typography>
        </Box>
      )
    );
  }

  if (
    Object.values(futures).some((future) => future.isLoading && !future.data)
  ) {
    return (
      loadingIndicator || (
        <Box display="flex" justifyContent="center" padding={3} width="100%">
          <CircularProgress data-testid="loading-indicator" disableShrink />
        </Box>
      )
    );
  }

  const dataObjects: Record<string, unknown> = {};
  Object.entries(futures).forEach(([key, future]) => {
    dataObjects[key] = future.data;
  });

  // Render children if query resolves successfully
  return typeof children === 'function'
    ? children({ data: dataObjects as { [I in keyof G]: G[I] } }) // Expose the successfully resolved query if children is a function
    : children || null; // Otherwise render children
}

export default ZUIFutures;
