import { describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render, waitFor } from 'utils/testing';
import OrganizationSelect from './OrganizationSelect';
import useApiClient from 'core/hooks/useApiClient';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import KPD from '../../../../integrationTesting/mockData/orgs/KPD';

jest.mock('core/hooks/useApiClient');

const mockedUseApiClient = jest.mocked(useApiClient);

describe('OrganizationSelect', () => {
  it('requires a selection and clears it when the search changes', async () => {
    const apiClient = mockApiClient();
    apiClient.rpc.mockResolvedValue([KPD]);
    mockedUseApiClient.mockReturnValue(apiClient);
    const onSelect = jest.fn();
    const setSubmitDisabled = jest.fn();
    const { findByRole, getByRole } = render(
      <OrganizationSelect
        onSelect={onSelect}
        setSubmitDisabled={setSubmitDisabled}
      />
    );

    expect(setSubmitDisabled).toHaveBeenLastCalledWith(true);
    fireEvent.change(getByRole('textbox'), { target: { value: 'deutsch' } });
    fireEvent.click(await findByRole('radio', { name: KPD.title }));
    expect(onSelect).toHaveBeenLastCalledWith(KPD);
    expect(setSubmitDisabled).toHaveBeenLastCalledWith(false);

    fireEvent.change(getByRole('textbox'), { target: { value: 'party' } });
    expect(onSelect).toHaveBeenLastCalledWith(null);
    expect(setSubmitDisabled).toHaveBeenLastCalledWith(true);
    await waitFor(() =>
      expect(apiClient.rpc).toHaveBeenLastCalledWith(
        expect.objectContaining({ name: 'searchOrganizations' }),
        { query: 'party' }
      )
    );
  });

  it('shows an error when the search fails', async () => {
    const apiClient = mockApiClient();
    apiClient.rpc.mockRejectedValue(new Error('Failed'));
    mockedUseApiClient.mockReturnValue(apiClient);
    const { findByRole, getByRole } = render(
      <OrganizationSelect onSelect={jest.fn()} setSubmitDisabled={jest.fn()} />
    );

    fireEvent.change(getByRole('textbox'), { target: { value: 'deutsch' } });
    expect(await findByRole('alert')).toBeTruthy();
  });
});
