import { z } from 'zod';
import Iron from '@hapi/iron';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { EmbeddedJoinFormData, ZetkinJoinForm } from '../types';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { ZetkinCustomField } from 'utils/types/zetkin';

const paramsSchema = z.object({
  formId: z.number(),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = {
  data: string;
};

export const getJoinFormEmbedDataDef = {
  handler: handle,
  name: 'getJoinFormEmbedData',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getJoinFormEmbedDataDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { formId, orgId } = params;

  const joinForm = await apiClient.get<ZetkinJoinForm>(
    `/api/orgs/${orgId}/join_forms/${formId}`
  );

  const nativeSlugs = Object.values(NATIVE_PERSON_FIELDS) as string[];
  const hasCustomFields = joinForm.fields.some((slug) =>
    nativeSlugs.includes(slug)
  );

  const customFields = hasCustomFields
    ? await apiClient.get<ZetkinCustomField[]>(
        `/api/orgs/${orgId}/people/fields`
      )
    : [];

  const data: EmbeddedJoinFormData = {
    fields: joinForm.fields.map((slug) => {
      const isNative = nativeSlugs.includes(slug);

      if (isNative) {
        // This cast is safe because we are only in this execution
        // branch if the slug was one of the native field slugs
        const typedSlug = slug as NATIVE_PERSON_FIELDS;
        return {
          s: typedSlug,
        };
      } else {
        const field = customFields.find((field) => field.slug == slug);

        if (!field) {
          throw new Error('Referencing unknown custom field');
        }

        return {
          l: field.title,
          s: slug,
          t: field.type,
        };
      }
    }),
    formId: formId,
    orgId: orgId,
    token: joinForm.submit_token,
  };

  const password = process.env.SESSION_PASSWORD;
  if (!password) {
    throw new Error('Missing password');
  }

  const sealed = await Iron.seal(data, password, Iron.defaults);

  return {
    data: sealed,
  };
}
