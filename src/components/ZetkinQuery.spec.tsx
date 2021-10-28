/* eslint-disable @typescript-eslint/ban-ts-comment */

import { QueryObserverSuccessResult } from 'react-query';
import { render } from 'test-utils';
import { LinearProgress, Typography } from '@material-ui/core';

import mockUseQueryResult from 'test-utils/mocks/mockUseQueryResult';
import ZetkinQuery from './ZetkinQuery';

describe('<ZetkinQuery />', () => {
    describe('When passed one query', () => {

        describe('when loading', () => {

            it('renders the loading indicator', () => {
                const mockLoadingQuery = mockUseQueryResult('loading');
                const { getByTestId } = render(<ZetkinQuery query={ mockLoadingQuery } />);
                expect(getByTestId('loading-indicator')).toBeTruthy();
            });

            it('renders a custom loading indicator if provided', () => {
                const mockLoadingQuery = mockUseQueryResult('loading');
                const { getByTestId } = render(<ZetkinQuery
                    loadingIndicator={
                        <LinearProgress data-testid="custom-loading-indicator" />
                    }
                    query={ mockLoadingQuery }
                />);
                expect(getByTestId('custom-loading-indicator')).toBeTruthy();
            });
        });

        describe('when there is an error', () => {

            it('renders the error indicator', () => {
                const mockErrorQuery = mockUseQueryResult('error');
                const { getByTestId } = render(<ZetkinQuery query={ mockErrorQuery } />);
                expect(getByTestId('error-indicator')).toBeTruthy();
            });

            it('renders a custom error indicator if provided', () => {
                const mockErrorQuery = mockUseQueryResult('error');
                const { getByTestId } = render(<ZetkinQuery
                    errorIndicator={
                        <Typography data-testid="custom-error-indicator" variant="h1">THERE WAS AN ERROR!!!</Typography>
                    }
                    query={ mockErrorQuery }
                />);
                expect(getByTestId('custom-error-indicator')).toBeTruthy();
            });
        });

        describe('when query successfully resolves', () => {

            it('renders the children', () => {
                const mockSuccessQuery = mockUseQueryResult('success');
                const { getByTestId } = render(
                    <ZetkinQuery query={ mockSuccessQuery }>
                        <Typography data-testid="success-state-child">
                            When you control the mail, you control EVERYTHING!
                        </Typography>
                    </ZetkinQuery>,
                );
                expect(getByTestId('success-state-child')).toBeTruthy();
            });

            it('exposes the query result to the children', () => {
                const mockSuccessQuery = mockUseQueryResult('success', {
                    text: 'These pretzels are making me thirsty',
                });
                const { getByText } = render(
                    <ZetkinQuery query={ mockSuccessQuery as QueryObserverSuccessResult<{text: string}> }>
                        { ({ query }) => {
                            const { data } = query;
                            return (
                                <Typography>
                                    { data.text }
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
