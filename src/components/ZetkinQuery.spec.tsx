import { render } from 'utils/testing';
import { LinearProgress, Typography } from '@material-ui/core';

import mockUseQueryResult from 'utils/testing/mocks/mockUseQueryResult';
import ZetkinQuery from './ZetkinQuery';

describe('<ZetkinQuery />', () => {
  describe('when single query is passed', () => {
    describe('when loading', () => {
      it('renders the loading indicator', () => {
        const mockLoadingQuery = mockUseQueryResult('loading');
        const { getByTestId } = render(
          <ZetkinQuery queries={{ mockLoadingQuery }} />
        );
        expect(getByTestId('loading-indicator')).toBeTruthy();
      });

      it('renders a custom loading indicator if provided', () => {
        const mockLoadingQuery = mockUseQueryResult('loading');
        const { getByTestId } = render(
          <ZetkinQuery
            loadingIndicator={
              <LinearProgress data-testid="custom-loading-indicator" />
            }
            queries={{ mockLoadingQuery }}
          />
        );
        expect(getByTestId('custom-loading-indicator')).toBeTruthy();
      });
    });

    describe('when there is an error', () => {
      it('renders the error indicator', () => {
        const mockErrorQuery = mockUseQueryResult('error');
        const { getByTestId } = render(
          <ZetkinQuery queries={{ mockErrorQuery }} />
        );
        expect(getByTestId('error-indicator')).toBeTruthy();
      });

      it('renders a custom error indicator if provided', () => {
        const mockErrorQuery = mockUseQueryResult('error');
        const { getByTestId } = render(
          <ZetkinQuery
            errorIndicator={
              <Typography data-testid="custom-error-indicator" variant="h1">
                THERE WAS AN ERROR!!!
              </Typography>
            }
            queries={{ mockErrorQuery }}
          />
        );
        expect(getByTestId('custom-error-indicator')).toBeTruthy();
      });
    });

    describe('when query successfully resolves', () => {
      it('renders the children', () => {
        const mockSuccessQuery = mockUseQueryResult('success');
        const { getByTestId } = render(
          <ZetkinQuery queries={{ mockSuccessQuery }}>
            <Typography data-testid="success-state-child">
              When you control the mail, you control EVERYTHING!
            </Typography>
          </ZetkinQuery>
        );
        expect(getByTestId('success-state-child')).toBeTruthy();
      });

      it('exposes the query result to the children', () => {
        const mockSuccessQuery = mockUseQueryResult('success', {
          text: 'These pretzels are making me thirsty',
        });
        const { getByText } = render(
          <ZetkinQuery queries={{ mockSuccessQuery }}>
            {({ queries }) => {
              const { data } = queries.mockSuccessQuery;
              return <Typography>{data.text}</Typography>;
            }}
          </ZetkinQuery>
        );
        expect(getByText('These pretzels are making me thirsty')).toBeTruthy();
      });
    });
  });

  describe('when multiple queries are passed', () => {
    it('renders the error indicator if any query resolves to error', () => {
      const mockSuccessQuery = mockUseQueryResult('success');
      const mockErrorQuery = mockUseQueryResult('error');
      const mockLoadingQuery = mockUseQueryResult('loading');

      const { getByTestId } = render(
        <ZetkinQuery
          queries={{
            mockErrorQuery,
            mockLoadingQuery,
            mockSuccessQuery,
          }}
        />
      );
      expect(getByTestId('error-indicator')).toBeTruthy();
    });

    it('renders the loading indicator if any query is loading and none have errors', () => {
      const mockSuccessQuery = mockUseQueryResult('success');
      const mockLoadingQuery = mockUseQueryResult('loading');

      const { getByTestId } = render(
        <ZetkinQuery
          queries={{
            mockLoadingQuery,
            mockSuccessQuery,
          }}
        />
      );
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('exposes the query result to the children', () => {
      const pretzelQuery = mockUseQueryResult('success', {
        text: 'These pretzels are making me thirsty',
      });
      const movieQuery = mockUseQueryResult('success', {
        title: 'Rochelle, Rochelle',
      });

      const { getByText } = render(
        <ZetkinQuery queries={{ movieQuery, pretzelQuery }}>
          {({ queries: { movieQuery, pretzelQuery } }) => {
            const { data: pretzelData } = pretzelQuery;
            const { data: movieData } = movieQuery;
            return (
              <>
                <Typography>{pretzelData.text}</Typography>
                <Typography>{movieData.title}</Typography>
              </>
            );
          }}
        </ZetkinQuery>
      );
      expect(getByText('These pretzels are making me thirsty')).toBeTruthy();
    });
  });
});
