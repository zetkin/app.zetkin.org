import mockRouter from 'next-router-mock';
import { renderHook } from '@testing-library/react-hooks';

import useModelsFromQueryString from './useModelsFromQueryString';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('useModelsFromQueryString()', () => {
  describe('parser', () => {
    it('handles single filter', () => {
      mockRouter.setCurrentUrl('/irrelevant?filter_first_name_contains=Clara');

      const { result } = renderHook(() => useModelsFromQueryString());

      expect(result.current.filterModel).toMatchObject({
        items: [
          {
            field: 'first_name',
            operator: 'contains',
            value: 'Clara',
          },
        ],
      });
    });

    it('handles duplicate filters', () => {
      mockRouter.setCurrentUrl(
        '/irrelevant?filter_name_contains=Clara&filter_name_contains=Zetkin'
      );

      const { result } = renderHook(() => useModelsFromQueryString());

      expect(result.current.filterModel).toMatchObject({
        items: [
          {
            field: 'name',
            operator: 'contains',
            value: 'Clara',
          },
          {
            field: 'name',
            operator: 'contains',
            value: 'Zetkin',
          },
        ],
      });
    });
  });
});
