import IApiClient from 'core/api/client/IApiClient';
import { ZetkinEmail, ZetkinUser } from 'utils/types/zetkin';
import renderEmailHtml from '../../utils/rendering/renderEmailHtml';
import { Params, paramsSchema } from './client';

export const renderEmailDef = {
  handler: handle,
  name: 'renderEmail',
  schema: paramsSchema,
};

async function handle(params: Params, apiClient: IApiClient) {
  const { emailId, orgId } = params;

  const user = await apiClient.get<ZetkinUser>('/api/users/me');

  const email = await apiClient.get<ZetkinEmail>(
    `/api/orgs/${orgId}/emails/${emailId}`
  );

  const html = renderEmailHtml(email, {
    'target.first_name': user.first_name,
    'target.full_name': `${user.first_name} ${user.last_name}`,
    'target.last_name': user.last_name,
  });

  return {
    html: html,
  };
}
