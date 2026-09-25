import IApiClient from 'core/api/client/IApiClient';
import { RemoteListResource, StreamedResource } from './types';

export default function prefetchResource<Context, Data>(
  apiClient: IApiClient,
  definition: RemoteListResource<Context, Data>,
  context: Context
): StreamedResource {
  const config = definition.createConfig(context);

  return {
    key: config.cacheKey,
    resource: config.loader(apiClient),
  };
}
