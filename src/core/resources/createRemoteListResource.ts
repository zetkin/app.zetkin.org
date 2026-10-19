import { RemoteListResource } from './types';

export default function createRemoteListResource<Context, Data>(
  createConfig: RemoteListResource<Context, Data>['createConfig']
): RemoteListResource<Context, Data> {
  return { createConfig };
}
