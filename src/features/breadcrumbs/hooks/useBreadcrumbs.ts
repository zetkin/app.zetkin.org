import { BreadcrumbElement } from 'pages/api/breadcrumbs';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { crumbsLoad, crumbsLoaded } from '../store';
import { NextRouter, useRouter } from 'next/router';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useBreadcrumbElements() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const path = router.pathname;
  const crumbsItem = useAppSelector(
    (state) => state.breadcrumbs.crumbsByPath[path]
  );

  const query = getPathParameters(router);

  const future = loadItemIfNecessary(crumbsItem, dispatch, {
    actionOnLoad: () => crumbsLoad(path),
    actionOnSuccess: (item) => crumbsLoaded([path, item]),
    loader: async () => {
      const elements = await apiClient.get<BreadcrumbElement[]>(
        `/api/breadcrumbs?pathname=${path}&${query}`
      );

      return { elements, id: path };
    },
  });

  return future.data?.elements ?? [];
}

const getPathParameters = function (router: NextRouter): string {
  // Only use parameters that are part of the path (e.g. [personId])
  // and not ones that are part of the actual querystring (e.g. ?filter_*)
  return Object.entries(router.query)
    .filter(([key]) => router.pathname.includes(`[${key}]`))
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
};
