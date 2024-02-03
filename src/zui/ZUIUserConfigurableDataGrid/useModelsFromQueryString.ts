import { isEqual } from 'lodash';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from 'next/router';
import {
  DataGridProProps,
  GridFilterModel,
  GridLogicOperator,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';

interface UseModelsFromQueryString {
  filterModel: GridFilterModel;
  gridProps: Required<
    Pick<
      DataGridProProps,
      'filterModel' | 'onFilterModelChange' | 'onSortModelChange' | 'sortModel'
    >
  >;
  setFilterModel: (model: GridFilterModel) => void;
  setSortModel: (model: GridSortModel) => void;
  sortModel: GridSortModel;
}

export default function useModelsFromQueryString(): UseModelsFromQueryString {
  const router = useRouter();

  const [filterModel, setFilterModel] = useState<GridFilterModel>(
    parseFilterModelFromQuery(router.query)
  );

  const [sortModel, setSortModel] = useState<GridSortModel>(
    parseSortModelFromQuery(router.query)
  );

  // Update router URL when model changes
  useEffect(() => {
    const pathWithoutQuery = router.asPath.includes('?')
      ? router.asPath.slice(0, router.asPath.indexOf('?'))
      : router.asPath;

    const qs = [
      serializeFilterQueryString(filterModel),
      serializeSortQueryString(sortModel),
    ]
      .filter((item) => !!item.length)
      .join('&');

    const modelPath = [pathWithoutQuery, qs]
      .filter((elem) => elem.length)
      .join('?');

    if (modelPath != router.asPath) {
      router.push(modelPath, modelPath, {
        shallow: true,
      });
    }
  }, [filterModel, sortModel]);

  // Update model when router URL changes
  useEffect(() => {
    const routerFilterModel = parseFilterModelFromQuery(router.query);
    const routerSortModel = parseSortModelFromQuery(router.query);

    if (!isEqual(routerFilterModel, filterModel)) {
      setFilterModel(routerFilterModel);
    }

    if (!isEqual(routerSortModel, sortModel)) {
      setSortModel(routerSortModel);
    }
  }, [router.query]);

  return {
    filterModel,
    gridProps: {
      filterModel: filterModel,
      onFilterModelChange: (model) => {
        if (!isEqual(model, filterModel)) {
          setFilterModel(model);
        }
      },
      onSortModelChange: (model) => {
        if (!isEqual(model, sortModel)) {
          setSortModel(model);
        }
      },
      sortModel: sortModel,
    },
    setFilterModel,
    setSortModel,
    sortModel,
  };
}

function parseFilterModelFromQuery(query: ParsedUrlQuery): GridFilterModel {
  const items = Object.entries(query)
    .filter(([param]) => param.startsWith('filter_'))
    .flatMap(([param, val], idx) => {
      const values = Array.isArray(val) ? val : [val];

      return values.map((val, valIdx) => {
        // Split the query param, ignoring the first field ('filter')
        const paramFields = param.split('_').slice(1);

        // The last will be the operator
        const op = paramFields[paramFields.length - 1];
        paramFields.pop();

        // The remaining ones are the name of the field, possibly containing underscores
        const field = paramFields.join('_');

        return {
          field: field,
          id: idx * 10000 + valIdx,
          operator: op,
          value: val || undefined,
        };
      });
    });

  return {
    items,
    ...(!!items.length && {
      linkOperator:
        query.filterOperator == 'or'
          ? GridLogicOperator.Or
          : GridLogicOperator.And,
    }),
  };
}

function parseSortModelFromQuery(query: ParsedUrlQuery): GridSortModel {
  const sort = Array.isArray(query.sort) ? query.sort[0] : query.sort;
  if (sort) {
    return sort.split(',').map((sortStr) => {
      const direction = sortStr.charAt(0) == '-' ? 'desc' : 'asc';
      const field = '+-'.includes(sortStr.charAt(0))
        ? sortStr.slice(1)
        : sortStr;

      return {
        field,
        sort: direction,
      };
    });
  } else {
    return [];
  }
}

function serializeFilterQueryString(filterModel: GridFilterModel): string {
  const qs = filterModel.items
    .map(
      (filter) =>
        `filter_${filter.field}_${filter.operator}` +
        (filter.value ? `=${encodeURIComponent(filter.value)}` : '')
    )
    .join('&');

  // Include the operator if more than one filter
  if (filterModel.items.length > 1) {
    return qs + `&filterOperator=${filterModel.logicOperator || 'and'}`;
  } else {
    return qs;
  }
}

function serializeSortQueryString(sortModel: GridSortModel): string {
  if (sortModel.length) {
    return (
      'sort=' +
      sortModel
        .map((item) => (item.sort == 'desc' ? `-${item.field}` : item.field))
        .join(',')
    );
  } else {
    return '';
  }
}
