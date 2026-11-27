import { describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render, waitFor } from 'utils/testing';
import ManageUsersPage from './ManageUsersPage';
import useApiClient from 'core/hooks/useApiClient';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import RosaLuxemburgUser from '../../../../integrationTesting/mockData/users/RosaLuxemburgUser';

jest.mock('core/hooks/useApiClient');

const mockedUseApiClient = jest.mocked(useApiClient);

describe('ManageUsersPage', () => {
  it('searches users by name or email and keeps the grid actions', async () => {
    const apiClient = mockApiClient();
    apiClient.rpc.mockResolvedValue([RosaLuxemburgUser]);
    mockedUseApiClient.mockReturnValue(apiClient);
    const { findByText, getByRole, queryByText } = render(<ManageUsersPage />, {
      theme: 'zui',
    });

    expect(apiClient.get).not.toHaveBeenCalled();
    expect(apiClient.rpc).not.toHaveBeenCalled();
    expect(queryByText(RosaLuxemburgUser.email)).toBeNull();

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'Rosa Luxemburg' },
    });
    expect(await findByText(RosaLuxemburgUser.email)).toBeTruthy();
    expect(
      getByRole('link', { name: 'feat.manage.users.manage' }).getAttribute(
        'href'
      )
    ).toBe('/manage/users/1');

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'rosa@zetkin.org' },
    });
    await waitFor(() =>
      expect(apiClient.rpc).toHaveBeenLastCalledWith(
        expect.objectContaining({ name: 'searchUsers' }),
        { query: 'rosa@zetkin.org' }
      )
    );
    expect(apiClient.get).not.toHaveBeenCalled();

    fireEvent.change(getByRole('textbox'), { target: { value: '' } });
    expect(queryByText(RosaLuxemburgUser.email)).toBeNull();
  });
});
