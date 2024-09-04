import { renderHook } from '@testing-library/react';
import { createElement, PropsWithChildren } from 'react';

import IApiClient from 'core/api/client/IApiClient';
import { EnvProvider } from 'core/env/EnvContext';
import Environment from 'core/env/Environment';
import useFeature from './useFeature';

function getOptsWithEnvVars(vars?: Partial<Environment['vars']>) {
  return {
    wrapper: ({ children }: PropsWithChildren) =>
      createElement(
        EnvProvider,
        {
          env: new Environment(null as unknown as IApiClient, {
            FEAT_AREAS: null,
            MUIX_LICENSE_KEY: null,
            ZETKIN_APP_DOMAIN: null,
            ...vars,
          }),
        },
        children
      ),
  };
}

describe('useFeature()', () => {
  it('returns false for empty vars', () => {
    const opts = getOptsWithEnvVars();
    const { result } = renderHook(() => useFeature('UNKNOWN', 1), opts);
    expect(result.current).toBeFalsy();
  });

  it('returns true when org ID is in feature flag', () => {
    const opts = getOptsWithEnvVars({
      FEAT_AREAS: '1',
    });
    const { result } = renderHook(() => useFeature('AREAS', 1), opts);
    expect(result.current).toBeTruthy();
  });

  it('returns true when org ID is listed in feature flag', () => {
    const opts = getOptsWithEnvVars({
      FEAT_AREAS: '1,2,3',
    });
    const { result } = renderHook(() => useFeature('AREAS', 2), opts);
    expect(result.current).toBeTruthy();
  });

  it('returns false when orgId is not listed in feature flag', () => {
    const opts = getOptsWithEnvVars({
      FEAT_AREAS: '1,2,3',
    });
    const { result } = renderHook(() => useFeature('AREAS', 4), opts);
    expect(result.current).toBeFalsy();
  });

  it.each([1, 2, 34, 567])(
    'returns true for orgId=%p when feature flag is *',
    () => {
      const opts = getOptsWithEnvVars({
        FEAT_AREAS: '*',
      });
      const { result } = renderHook(() => useFeature('AREAS', 1), opts);
      expect(result.current).toBeTruthy();
    }
  );
});
