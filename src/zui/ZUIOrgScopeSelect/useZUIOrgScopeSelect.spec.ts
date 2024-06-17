import { act, renderHook } from '@testing-library/react';

import useZUIOrgScopeSelect from './useZUIOrgScopeSelect';

describe('useZUIOrgScopeSelect', () => {
  it('finds scope to be "all" when value is "all"', () => {
    const { result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, value: 'all' })
    );

    expect(result.current.scope).toEqual('all');
  });

  it('finds scope to be "suborgs" when value is "suborgs"', () => {
    const { result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, value: 'suborgs' })
    );
    expect(result.current.scope).toEqual('suborgs');
  });

  it('finds scope to be "specific" when value is a single sub-org', () => {
    const { result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, value: [2] })
    );
    expect(result.current.scope).toEqual('specific');
    expect(result.current.orgs).toEqual([2]);
  });

  it('finds scope to be "specific" when value is an empty array', () => {
    const { result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, value: [] })
    );
    expect(result.current.scope).toEqual('specific');
    expect(result.current.orgs).toEqual([]);
  });

  it('finds scope to be "this" when value is only currentOrg', () => {
    const { result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, value: [1] })
    );
    expect(result.current.scope).toEqual('this');
  });

  it('correctly handles when scope becomes "this"', () => {
    const onChange = jest.fn();

    const { rerender, result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, onChange, value: [] })
    );

    act(() => {
      result.current.setScope('this');
    });

    rerender();

    expect(result.current.orgs).toEqual([1]);
    expect(onChange).toHaveBeenCalledWith([1]);
  });

  it('correctly handles when scope becomes "suborgs"', () => {
    const onChange = jest.fn();

    const { rerender, result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, onChange, value: [1] })
    );

    act(() => {
      result.current.setScope('suborgs');
    });

    rerender();

    expect(result.current.orgs).toEqual([1]);
    expect(onChange).toHaveBeenCalledWith('suborgs');
  });

  it('correctly handles when scope becomes "all"', () => {
    const onChange = jest.fn();

    const { rerender, result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, onChange, value: [1] })
    );

    act(() => {
      result.current.setScope('all');
    });

    rerender();

    expect(result.current.orgs).toEqual([1]);
    expect(onChange).toHaveBeenCalledWith('all');
  });

  it('correctly invokes onChange when organizations change', () => {
    const onChange = jest.fn();

    const { rerender, result } = renderHook(() =>
      useZUIOrgScopeSelect({ currentOrg: 1, onChange, value: [1] })
    );

    act(() => {
      result.current.setOrgs([2]);
    });

    rerender();

    expect(result.current.orgs).toEqual([2]);
    expect(onChange).toHaveBeenCalledWith([2]);
  });
});
