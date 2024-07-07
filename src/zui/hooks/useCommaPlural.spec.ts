import { IntlProvider } from 'react-intl';
import { renderHook } from '@testing-library/react';
import { createElement, PropsWithChildren } from 'react';

import { m } from 'core/i18n';
import { Message } from 'core/i18n/messages';
import useCommaPlural from './useCommaPlural';

describe('useCommaPlural()', () => {
  const opts = {
    wrapper: ({ children }: PropsWithChildren) =>
      createElement(
        IntlProvider,
        {
          locale: 'en',
          messages: {},
        },
        children
      ),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function mockMessages<MapType extends Record<string, Message<any>>>(
    messages: MapType
  ): MapType {
    Object.keys(messages).forEach((key) => (messages[key]._id = 'x'));
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
