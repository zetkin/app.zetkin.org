import { UseQueryResult } from 'react-query';
import { Box, CircularProgress, Typography } from '@material-ui/core';

interface ZetkinQueryProps<G> {
    children?: React.ReactNode | (({ query }: {query: UseQueryResult<G>}) => React.ReactNode);
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
                { loadingIndicator || ( // Render custom loading indicator if provided
                    <CircularProgress data-testid="loading-indicator" disableShrink />
                ) }
            </>
        );
    }

    if (query.isError) {
        return (
            <>
                { errorIndicator || (
                    <Box data-testid="error-indicator" display="flex" flexDirection="column" justifyItems="center">
                        <Typography variant="body2">There was an error</Typography>
                    </Box>
                ) }
            </>
        );
    }

    // Success
    return (
        <>
            { typeof children === 'function' ? children({ query }) : children }
        </>
    );
}

export default ZetkinQuery;
