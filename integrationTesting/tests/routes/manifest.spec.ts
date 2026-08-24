import { expect, test } from '@playwright/test';

import { classifyTemplate, collectPageRouteTemplates } from './smokeUtils';

test.describe('route manifest smoke test', () => {
  test('every Page route template maps to a smoke test bucket', () => {
    const unclassified = collectPageRouteTemplates().filter(
      (template) => classifyTemplate(template) === null
    );

    expect(unclassified).toEqual([]);
  });
});
