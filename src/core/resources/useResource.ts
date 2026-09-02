import shouldLoad from 'core/caching/shouldLoad';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { useResourceCache } from './ResourceProvider';
import { RemoteListResource } from './types';

function findResource(
  cache: ReturnType<typeof useResourceCache>,
  collection: 'serverResources' | 'wrappedResources',
  key: string
): Promise<unknown> | undefined {
  return (
    cache[collection].get(key) ??
    (cache.parent ? findResource(cache.parent, collection, key) : undefined)
  );
}

export default function useResource<Context, Data>(
  definition: RemoteListResource<Context, Data>,
  context: Context
): Data[] {
  const apiClient = useApiClient();
  const cache = useResourceCache();
  const dispatch = useAppDispatch();
  const config = definition.createConfig(context);
  const remoteList = useAppSelector(config.selector);
  const existingResource = findResource(
    cache,
    'wrappedResources',
    config.cacheKey
  );

  if (!remoteList?.loaded && existingResource) {
    throw existingResource;
  }

  if (shouldLoad(remoteList)) {
    let wrappedResource = existingResource;

    if (!wrappedResource) {
      const serverResource = findResource(
        cache,
        'serverResources',
        config.cacheKey
      );

      if (!serverResource && typeof window === 'undefined') {
        throw new Error(
          `Resource ${config.cacheKey} was not provided by the server`
        );
      }

      wrappedResource = Promise.resolve()
        .then(() => dispatch(config.actionOnLoad()))
        .then(() => serverResource ?? config.loader(apiClient))
        .then((data) => {
          dispatch(config.actionOnSuccess(data as Data[]));
        })
        .catch((error) => {
          if (config.actionOnError) {
            dispatch(config.actionOnError(error));
          } else {
            throw error;
          }
        });
      cache.wrappedResources.set(config.cacheKey, wrappedResource);
      cache.serverResources.delete(config.cacheKey);
      const removeResource = () => {
        if (cache.wrappedResources.get(config.cacheKey) === wrappedResource) {
          cache.wrappedResources.delete(config.cacheKey);
        }
      };
      wrappedResource.then(removeResource, removeResource);
    }

    throw wrappedResource;
  }

  return (
    remoteList?.items
      .filter((item) => !item.deleted)
      .map((item) => item.data)
      .filter((data): data is Data => data != null) ?? []
  );
}
