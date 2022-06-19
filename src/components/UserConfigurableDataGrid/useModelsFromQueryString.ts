import { ParsedUrlQuery } from 'querystring';
import { useRouter } from 'next/router';
import { GridFilterModel, GridLinkOperator } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';

interface UseModelsFromQueryString {
  filterModel: GridFilterModel;
  setFilterModel: (model: GridFilterModel) => void;
}

export function useModelsFromQueryString(): UseModelsFromQueryString {
  const router = useRouter();

  const [filterModel, setFilterModel] = useState<GridFilterModel>(
    parseFilterModelFromQuery(router.query)
  );

  // Update router URL when model changes
  useEffect(() => {
    const pathWithoutQuery = router.asPath.includes('?')
      ? router.asPath.slice(0, router.asPath.indexOf('?'))
      : router.asPath;

    const qs = serializeFilterQueryString(filterModel);

    const filterPath = [pathWithoutQuery, qs]
      .filter((elem) => elem.length)
      .join('?');
    if (filterPath != router.asPath) {
      router.push(filterPath, filterPath, {
        shallow: true,
      });
    }
  }, [filterModel]);

  // Update model when router URL changes
  useEffect(() => {
    const modelQueryString = serializeFilterQueryString(filterModel);
    const routerQueryString = router.asPath.slice(
      router.asPath.indexOf('?') + 1
    );

    if (modelQueryString != routerQueryString) {
      setFilterModel(parseFilterModelFromQuery(router.query));
    }
  }, [router.asPath, router.query]);

  return {
    filterModel,
    setFilterModel,
  };
}

function parseFilterModelFromQuery(query: ParsedUrlQuery): GridFilterModel {
  const items = Object.entries(query)
    .filter(([param]) => param.startsWith('filter_'))
    .map(([param, val], idx) => {
      // Split the query param, ignoring the first field ('filter')
      const paramFields = param.split('_').slice(1);

      // The last will be the operator
      const op = paramFields.pop();

      // The remaining ones are the name of the field, possibly containing underscores
      const field = paramFields.join('_');

      return {
        columnField: field,
        id: idx,
        operatorValue: op,
        value: val || undefined,
      };
    });

  return {
    items,
    ...(!!items.length && {
      linkOperator:
        query.filterOperator == 'or'
          ? GridLinkOperator.Or
          : GridLinkOperator.And,
    }),
  };
}

function serializeFilterQueryString(filterModel: GridFilterModel): string {
  const qs = filterModel.items
    .map(
      (filter) =>
        `filter_${filter.columnField}_${filter.operatorValue}` +
        (filter.value ? `=${encodeURIComponent(filter.value)}` : '')
    )
    .join('&');

  // Include the operator if more than one filter
  if (filterModel.items.length > 1) {
    return qs + `&filterOperator=${filterModel.linkOperator || 'and'}`;
  } else {
    return qs;
  }
}
