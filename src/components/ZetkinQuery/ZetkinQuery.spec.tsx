/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'test-utils';
import { LinearProgress, Typography } from '@material-ui/core';
import { QueryObserverResult, UseQueryResult } from 'react-query';

import ZetkinQuery from './index';

// @ts-ignore
const mockQuery: UseQueryResult<unknown> = {
    data: {},
    dataUpdatedAt: 1000000,
    error: null,
    errorUpdatedAt: 1000000,
    failureCount: 0,
    isError: false,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isIdle: false,
    isLoading: false,
    isLoadingError: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: false,
    refetch: async () => ({} as QueryObserverResult),
    remove: () => null,
    status: 'idle',
};

describe('<ZetkinQuery />', () => {
    describe('When passed one query', () => {

        describe('when loading', () => {

            it('renders the loading indicator', () => {
                const mockLoadingQuery = {
                    ...mockQuery,
                    isLoading: true,
                    status: 'loading',
                };
                const { getByTestId } = render(<ZetkinQuery query={ mockLoadingQuery as UseQueryResult } />);
                expect(getByTestId('loading-indicator')).toBeTruthy();
            });

            it('renders a custom loading indicator if provided', () => {
                const mockLoadingQuery = {
                    ...mockQuery,
                    isIdle: false,
                    isLoading: true,
                    status: 'loading',
                };
                const { getByTestId } = render(<ZetkinQuery
                    loadingIndicator={
                        <LinearProgress data-testid="custom-loading-indicator" />
                    }
                    query={ mockLoadingQuery as UseQueryResult }
                />);
                expect(getByTestId('custom-loading-indicator')).toBeTruthy();
            });
        });

        describe('when there is an error', () => {

            it('renders the error indicator', () => {
                const mockErrorQuery = {
                    ...mockQuery,
                    isError: true,
                    status: 'error',
                };
                const { getByTestId } = render(<ZetkinQuery query={ mockErrorQuery as UseQueryResult } />);
                expect(getByTestId('error-indicator')).toBeTruthy();
            });

            it('renders a custom error indicator if provided', () => {
                const mockErrorQuery = {
                    ...mockQuery,
                    isError: true,
                    status: 'error',
                };
                const { getByTestId } = render(<ZetkinQuery
                    errorIndicator={
                        <Typography data-testid="custom-error-indicator" variant="h1">THERE WAS AN ERROR!!!</Typography>
                    }
                    query={ mockErrorQuery as UseQueryResult }
                />);
                expect(getByTestId('custom-error-indicator')).toBeTruthy();
            });
        });

        describe('when query successfully resolves', () => {

            it('renders the children', () => {
                const mockSuccessQuery = {
                    ...mockQuery,
                    isSuccess: true,
                    status: 'success',
                };
                const { getByTestId } = render(
                    <ZetkinQuery query={ mockSuccessQuery as UseQueryResult }>
                        <Typography data-testid="success-state-child">
                            When you control the mail, you control EVERYTHING!
                        </Typography>
                    </ZetkinQuery>,
                );
                expect(getByTestId('success-state-child')).toBeTruthy();
            });

            it('exposes the query result to the children', () => {
                const mockSuccessQuery = {
                    ...mockQuery,
                    data: {
                        text: 'These pretzels are making me thirsty',
                    },
                    isSuccess: true,
                    status: 'success',
                };
                const { getByText } = render(
                    <ZetkinQuery query={ mockSuccessQuery as UseQueryResult<{text: string}> }>
                        { ({ query }) => {
                            const { data } = query;
                            return (
                                <Typography>
                                    { data?.text }
                                </Typography>
                            );
                        } }
                    </ZetkinQuery>,
                );
                expect(getByText('These pretzels are making me thirsty')).toBeTruthy();
            });
        });

    });
});
