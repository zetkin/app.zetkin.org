import { useIntl } from 'react-intl';
import { useState } from 'react';

import FilterEditor from './FilterEditor';
import FilterGallery from './FilterGallery';
import QueryOverview from './QueryOverview';
import StartsWith from '../StartsWith';
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

export interface SmartSearchDialogProps {
  query?: ZetkinQuery | null;
  onDialogClose?: () => void;
  onOutputConfigured?: (columns: SelectedViewColumn[]) => void;
  onSave?: (query: Partial<ZetkinQuery>) => void;
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
  const intl = useIntl();

  const isEmptyQuery = !filterArray.length && !readOnly;

  const [selectedFilter, setSelectedFilter] =
    useState<SelectedSmartSearchFilter>(null);

  const [searchState, setSearchState] = useState(
    isEmptyQuery ? STATE.START_WITH : STATE.PREVIEW
  );

  return (
    <>
      {searchState === STATE.PREVIEW && (
        <QueryOverview
          filters={filterArray} // optional
          hasSaveCancelButtons={hasSaveCancelButtons}
          onCloseDialog={onDialogClose} //optional
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
                  title: intl.formatMessage({
                    id: 'misc.views.columnDialog.choices.localSmartSearch.columnTitle',
                  }),
                  type: COLUMN_TYPE.LOCAL_SMART_SEARCH,
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
                  title: intl.formatMessage({
                    id: 'misc.views.columnDialog.choices.localSmartSearch.columnTitle',
                  }),
                  type: COLUMN_TYPE.LOCAL_SMART_SEARCH,
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
