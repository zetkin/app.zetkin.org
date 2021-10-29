import { ErrorOutlined } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { QueryObserverSuccessResult, UseQueryResult } from 'react-query';

interface ZetkinQueryProps<G> {
    children?: React.ReactNode | (({ query }: {query: QueryObserverSuccessResult<G>}) => React.ReactNode);
    query: UseQueryResult<G>;
    errorIndicator?: React.ReactNode;
    loadingIndicator?: React.ReactNode;
}


function ZetkinQuery<G>({
    children,
    query,
    loadingIndicator,
    errorIndicator,
}: ZetkinQueryProps<G>): JSX.Element {
    if (query.isLoading) {
        return (
            <>
                { loadingIndicator || (
                    <Box
                        display="flex"
                        justifyContent="center"
                        padding={ 3 }
                        width="100%">
                        <CircularProgress data-testid="loading-indicator" disableShrink />
                    </Box>
                ) }
            </>
        );
    }

    if (query.isError) {
        return (
            <>
                { errorIndicator || (
                    <Box
                        alignItems="center"
                        data-testid="error-indicator"
                        display="flex"
                        flexDirection="column"
                        justifyItems="center"
                        padding={ 3 }
                        width="100%">
                        <ErrorOutlined color="error" fontSize="large" />
                        <Typography variant="body1">
                            <FormattedMessage id="misc.errorLoading" />
                        </Typography>
                    </Box>
                ) }
            </>
        );
    }

    const successQuery = query as QueryObserverSuccessResult<G>;
    // Render children if query resolves successfully
    return typeof children === 'function' ?
        children({ query: successQuery }) : // Expose the successfully resolved query if children is a function
        children; // Otherwise render children

}

export default ZetkinQuery;
