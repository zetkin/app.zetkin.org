import { Typography } from '@mui/material';
import { useState } from 'react';

import FilterEditor from './FilterEditor';
import FilterGallery from './FilterGallery';
import QueryOverview from './QueryOverview';
import smartSearchMessageIds from 'features/smartSearch/l10n/messageIds';
import StartsWith from '../StartsWith';
import { useMessages } from 'core/i18n';
import useSmartSearch from 'features/smartSearch/hooks/useSmartSearch';
import viewsMessageIds from 'features/views/l10n/messageIds';
import {
  AnyFilterConfig,
  CallerFilterConfig,
  FILTER_TYPE,
  OPERATION,
  SelectedSmartSearchFilter,
  SmartSearchFilterWithId,
  ZetkinQuery,
  ZetkinSmartSearchFilter,
} from '../types';
import {
  COLUMN_TYPE,
  SelectedViewColumn,
} from 'features/views/components/types';

export interface SmartSearchDialogProps {
  query?: ZetkinQuery | null;
  onDialogClose?: () => void;
  onOutputConfigured?: (columns: SelectedViewColumn[]) => void;
  onSave?: (query: Pick<ZetkinQuery, 'filter_spec'>) => void;
  readOnly?: boolean;
  hasSaveCancelButtons?: boolean;
}

enum STATE {
  PREVIEW = 'preview',
  EDIT = 'edit',
  GALLERY = 'gallery',
  START_WITH = 'start_with',
}

function expandFilterForBackend(
  filter: ZetkinSmartSearchFilter | SmartSearchFilterWithId
): ZetkinSmartSearchFilter[] {
  if (filter.type !== FILTER_TYPE.CALLER) {
    const { config, op, type } = filter;
    return [{ config, op, type }];
  }

  const config = { ...filter.config } as CallerFilterConfig & {
    assignmentStatus?: string;
  };
  const assignmentIds = config.assignmentIds;
  delete config.assignmentIds;
  delete config.assignmentStatus;

  if (config.assignment) {
    return [
      {
        config,
        op: filter.op,
        type: filter.type,
      },
    ];
  }

  return (assignmentIds || []).map((assignment) => ({
    config: {
      ...config,
      assignment,
    },
    op: filter.op,
    type: filter.type,
  }));
}

const SmartSearch = ({
  hasSaveCancelButtons,
  onDialogClose,
  onOutputConfigured,
  onSave,
  query,
  readOnly,
}: SmartSearchDialogProps): JSX.Element => {
  const {
    filtersWithIds: filterArray,
    addFilter,
    editFilter,
    startsWithAll,
    setStartsWithAll,
    deleteFilter,
    update,
  } = useSmartSearch(query?.filter_spec);
  // TODO: Remove this after refactoring Smart Search / View connection
  const viewsMessages = useMessages(viewsMessageIds);
  const smartSearchMessages = useMessages(smartSearchMessageIds);

  const [selectedFilter, setSelectedFilter] =
    useState<SelectedSmartSearchFilter>(null);

  const [searchState, setSearchState] = useState(STATE.PREVIEW);

  const filtersForBackend = filterArray.flatMap(expandFilterForBackend);

  return (
    <>
      <Typography variant="h5">{smartSearchMessages.smartSearch()}</Typography>
      {searchState === STATE.PREVIEW && (
        <QueryOverview
          filters={filterArray}
          filtersForStats={filtersForBackend}
          hasSaveCancelButtons={hasSaveCancelButtons}
          onCloseDialog={onDialogClose}
          onDeleteFilter={(filter) => {
            setSearchState(STATE.PREVIEW);
            deleteFilter(filter.id);
          }}
          onEditFilter={(filter) => {
            setSelectedFilter(filter);
            setSearchState(STATE.EDIT);
          }}
          onOpenFilterGallery={() => setSearchState(STATE.GALLERY)}
          onOpenStartsWithEditor={() => setSearchState(STATE.START_WITH)}
          onReorderFilters={(filters) => update(filters)}
          onSaveQuery={() => {
            if (onSave) {
              onSave({
                filter_spec: filtersForBackend,
              });
            }
          }}
          readOnly={readOnly}
          startsWithAll={startsWithAll}
        />
      )}
      {searchState === STATE.GALLERY && (
        <FilterGallery
          onAddNewFilter={(type) => {
            setSelectedFilter({ type });
            setSearchState(STATE.EDIT);
          }}
          onCancelAddNewFilter={() => setSearchState(STATE.PREVIEW)}
        />
      )}
      {searchState === STATE.EDIT && selectedFilter && (
        <FilterEditor
          filter={selectedFilter}
          onCancelSubmitFilter={() => setSearchState(STATE.PREVIEW)}
          onSubmitFilter={(filter) => {
            const filterSpec =
              'id' in filter
                ? filterArray.flatMap((existingFilter) => {
                    if (existingFilter.id === filter.id) {
                      return expandFilterForBackend(filter);
                    }
                    return expandFilterForBackend(existingFilter);
                  })
                : filterArray
                    .flatMap(expandFilterForBackend)
                    .concat(expandFilterForBackend(filter));

            if (onOutputConfigured) {
              onOutputConfigured([
                {
                  config: {
                    filter_spec: filterSpec,
                  },
                  title:
                    viewsMessages.columnDialog.choices.localQuery.columnTitle(),
                  type: COLUMN_TYPE.LOCAL_QUERY,
                },
              ]);
            }
            setSearchState(STATE.PREVIEW);
            if ('id' in filter) {
              editFilter(filter.id, filter);
            } else {
              addFilter(filter);
            }
          }}
        />
      )}
      {searchState === STATE.START_WITH && (
        <StartsWith
          onCancel={() => setSearchState(STATE.PREVIEW)}
          onSubmit={(shouldStartWithAll) => {
            let filterSpec: ZetkinSmartSearchFilter<AnyFilterConfig>[] = [];

            if (startsWithAll && !shouldStartWithAll) {
              filterSpec = filtersForBackend.slice(1);
            } else if (!startsWithAll && shouldStartWithAll) {
              filterSpec = [
                {
                  config: {},
                  op: OPERATION.ADD,
                  type: FILTER_TYPE.ALL,
                },
                ...filtersForBackend,
              ];
            }

            if (onOutputConfigured) {
              onOutputConfigured([
                {
                  config: {
                    filter_spec: filterSpec,
                  },
                  title:
                    viewsMessages.columnDialog.choices.localQuery.columnTitle(),
                  type: COLUMN_TYPE.LOCAL_QUERY,
                },
              ]);
            }
            setSearchState(STATE.PREVIEW);
            setStartsWithAll(shouldStartWithAll);
          }}
          startsWithAll={startsWithAll}
        />
      )}
    </>
  );
};

export default SmartSearch;
