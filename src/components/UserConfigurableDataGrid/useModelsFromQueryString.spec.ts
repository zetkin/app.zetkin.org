import mockRouter from 'next-router-mock';
import { renderHook } from '@testing-library/react-hooks';

import { useModelsFromQueryString } from './useModelsFromQueryString';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('useModelsFromQueryString()', () => {
  describe('parser', () => {
    it('handles single filter', () => {
      mockRouter.setCurrentUrl('/irrelevant?filter_first_name_contains=Clara');

      const { result } = renderHook(() =>
        useModelsFromQueryString({ columns: [], rows: [] })
      );

      expect(result.current.filterModel).toMatchObject({
        items: [
          {
            columnField: 'first_name',
            operatorValue: 'contains',
            value: 'Clara',
          },
        ],
      });
    });

    it('handles duplicate filters', () => {
      mockRouter.setCurrentUrl(
        '/irrelevant?filter_name_contains=Clara&filter_name_contains=Zetkin'
      );

      const { result } = renderHook(() =>
        useModelsFromQueryString({ columns: [], rows: [] })
      );

      expect(result.current.filterModel).toMatchObject({
        items: [
          {
            columnField: 'name',
            operatorValue: 'contains',
            value: 'Clara',
          },
          {
            columnField: 'name',
            operatorValue: 'contains',
            value: 'Zetkin',
          },
        ],
      });
    });
  });
});
