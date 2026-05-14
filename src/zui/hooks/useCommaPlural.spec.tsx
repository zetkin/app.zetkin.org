import { describe, expect, it } from '@jest/globals';
import { NextIntlClientProvider } from 'next-intl';
import { renderHook } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';

import { m } from 'core/i18n';
import { AnyMessage } from 'core/i18n/messages';
import useCommaPlural from './useCommaPlural';

describe('useCommaPlural()', () => {
  function mockMessages<MapType extends Record<string, AnyMessage>>(
    messages: MapType
  ): MapType {
    Object.keys(messages).forEach((key) => (messages[key]._id = key));
    return messages;
  }

  const messages = mockMessages({
    few: m<{ first: string; last: string }>(
      'The team consists of {first} and {last}'
    ),
    many: m<{ additional: number; first: string }>(
      'The team consists of {first} and {additional} more'
    ),
    single: m<{ value: string }>('The team consists of {value}'),
  });

  const messagesDict = Object.fromEntries(
    Object.values(messages).map((m) => [m._id, m._defaultMessage])
  );

  const TestWrapper: FC<PropsWithChildren> = ({ children }) => (
    <NextIntlClientProvider locale="en" messages={messagesDict}>
      {children}
    </NextIntlClientProvider>
  );

  const opts = { wrapper: TestWrapper };

  it('throws for empty array', () => {
    const { result } = renderHook(() => useCommaPlural([], 10, messages), opts);
    expect(result.current).toEqual('');
  });

  it('returns correct for single value', () => {
    const values = ['Josef'];
    const { result } = renderHook(
      () => useCommaPlural(values, 10, messages),
      opts
    );
    expect(result.current).toEqual('The team consists of Josef');
  });

  it('returns a and b', () => {
    const values = ['Josef', 'Haeju'];
    const { result } = renderHook(
      () => useCommaPlural(values, 10, messages),
      opts
    );
    expect(result.current).toEqual('The team consists of Josef and Haeju');
  });

  it('comma-separates the first ones', () => {
    const values = ['Josef', 'Haeju', 'Niklas', 'Rebeca'];
    const { result } = renderHook(
      () => useCommaPlural(values, 10, messages),
      opts
    );
    expect(result.current).toEqual(
      'The team consists of Josef, Haeju, Niklas and Rebeca'
    );
  });

  it('combines additionals for three values when max is 2', () => {
    const values = ['Josef', 'Haeju', 'Niklas'];
    const { result } = renderHook(
      () => useCommaPlural(values, 2, messages),
      opts
    );
    expect(result.current).toEqual('The team consists of Josef and 2 more');
  });

  it('combines additionals when there are too many values', () => {
    const values = ['Josef', 'Haeju', 'Niklas', 'Rebeca', 'Richard', 'Ziggi'];
    const { result } = renderHook(
      () => useCommaPlural(values, 3, messages),
      opts
    );
    expect(result.current).toEqual(
      'The team consists of Josef, Haeju and 4 more'
    );
  });
});
