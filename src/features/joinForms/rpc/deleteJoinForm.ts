import IApiClient from 'core/api/client/IApiClient';
import { paramsSchema, Params } from './getJoinFormEmbedData';
import { makeRPCDef } from 'core/rpc/types';

export const deleteJoinFormDataDef = {
  handler: handle,
  name: 'deleteJoinForm',
  schema: paramsSchema,
};

export default makeRPCDef<Params, void>(deleteJoinFormDataDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<void> {
  const { formId, orgId } = params;
  return apiClient.delete(`/api/orgs/${orgId}/join_forms/${formId}`);
}
