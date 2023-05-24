import { useState } from 'react';

import FilterEditor from './FilterEditor';
import FilterGallery from './FilterGallery';
import QueryOverview from './QueryOverview';
import StartsWith from '../StartsWith';
import { useMessages } from 'core/i18n';
import useSmartSearch from 'features/smartSearch/hooks/useSmartSearch';
import {
  AnyFilterConfig,
  FILTER_TYPE,
  OPERATION,
  SelectedSmartSearchFilter,
  ZetkinQuery,
  ZetkinSmartSearchFilter,
} from '../types';
import {
  COLUMN_TYPE,
  SelectedViewColumn,
} from 'features/views/components/types';

import viewsMessageIds from 'features/views/l10n/messageIds';

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
    filters,
    addFilter,
    editFilter,
    startsWithAll,
    setStartsWithAll,
    deleteFilter,
  } = useSmartSearch(query?.filter_spec);
  // TODO: Remove this after refactoring Smart Search / View connection
  const viewsMessages = useMessages(viewsMessageIds);

  const [selectedFilter, setSelectedFilter] =
    useState<SelectedSmartSearchFilter>(null);

  const [searchState, setSearchState] = useState(STATE.PREVIEW);

  return (
    <>
      {searchState === STATE.PREVIEW && (
        <QueryOverview
          filters={filterArray}
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
          onSaveQuery={() => {
            if (onSave) {
              onSave({
                filter_spec: filters,
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
            if (onOutputConfigured) {
              onOutputConfigured([
                {
                  config: {
                    filter_spec: [...filters, filter],
                  },
                  title:
                    viewsMessages.columnDialog.choices.localQuery.columnTitle(),
                  type: COLUMN_TYPE.LOCAL_QUERY,
                },
              ]);
            }
            setSearchState(STATE.PREVIEW);
            // If editing existing filter
            if ('id' in filter) {
              editFilter(filter.id, filter);
            } else {
              // If creating a new filter
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
              filterSpec = filters.slice(1);
            } else if (!startsWithAll && shouldStartWithAll) {
              filterSpec = [
                {
                  config: {},
                  op: OPERATION.ADD,
                  type: FILTER_TYPE.ALL,
                },
                ...filters,
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
