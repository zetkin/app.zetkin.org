import { NextRouter, useRouter } from 'next/router';

import { BreadcrumbElement } from 'pages/api/breadcrumbs';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { crumbsLoad, crumbsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useBreadcrumbElements() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pathname, asPath: path } = router;
  const pathWithoutQueryString = path.split('?')[0];
  const crumbsItem = useAppSelector(
    (state) => state.breadcrumbs.crumbsByPath[pathWithoutQueryString]
  );

  const query = getPathParameters(router);

  const future = loadItemIfNecessary(crumbsItem, dispatch, {
    actionOnLoad: () => crumbsLoad(pathWithoutQueryString),
    actionOnSuccess: (item) => crumbsLoaded([pathWithoutQueryString, item]),
    loader: async () => {
      const elements = await apiClient.get<BreadcrumbElement[]>(
        `/api/breadcrumbs?pathname=${pathname}&${query}`
      );

      return { elements, id: pathWithoutQueryString };
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
