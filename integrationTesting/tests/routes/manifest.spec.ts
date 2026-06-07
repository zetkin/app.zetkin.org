import { expect, test } from '@playwright/test';

import { collectPageRouteTemplates, expectedPageTemplates } from './smokeUtils';

test.describe('route manifest smoke test', () => {
  test('covers every Page route template', () => {
    expect(collectPageRouteTemplates()).toEqual(expectedPageTemplates());
  });
});
