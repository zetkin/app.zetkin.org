import { ErrorOutlined } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { QueryObserverSuccessResult, UseQueryResult } from 'react-query';

interface ZUIQueryProps<G extends Record<string, unknown>> {
  children?:
    | React.ReactNode
    | (({
        queries,
      }: {
        queries: { [I in keyof G]: QueryObserverSuccessResult<G[I]> };
      }) => React.ReactElement | null);
  queries: { [I in keyof G]: UseQueryResult<G[I]> };
  errorIndicator?: React.ReactElement;
  loadingIndicator?: React.ReactElement;
}

function ZUIQuery<G extends Record<string, unknown>>({
  children,
  queries,
  loadingIndicator,
  errorIndicator,
}: ZUIQueryProps<G>): React.ReactElement | null {
  if (Object.values(queries).some((query) => query.isError)) {
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
            <FormattedMessage id="misc.errorLoading" />
          </Typography>
        </Box>
      )
    );
  }

  if (Object.values(queries).some((query) => query.isLoading)) {
    return (
      loadingIndicator || (
        <Box display="flex" justifyContent="center" padding={3} width="100%">
          <CircularProgress data-testid="loading-indicator" disableShrink />
        </Box>
      )
    );
  }

  const successQueries = queries as {
    [I in keyof G]: QueryObserverSuccessResult<G[I]>;
  };

  // Render children if query resolves successfully
  return typeof children === 'function' ? (
    children({ queries: successQueries }) // Expose the successfully resolved query if children is a function
  ) : (
    <>{children || null}</>
  ); // Otherwise render children
}

export default ZUIQuery;
