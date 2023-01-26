import { Box } from '@mui/material';
import { useIntl } from 'react-intl';
import { useState } from 'react';

import FilterEditor from 'features/smartSearch/components/SmartSearchDialog/FilterEditor';
import FilterGallery from 'features/smartSearch/components/SmartSearchDialog/FilterGallery';
import QueryOverview from 'features/smartSearch/components/SmartSearchDialog/QueryOverview';
import StartsWith from 'features/smartSearch/components/StartsWith';
import useSmartSearch from 'features/smartSearch/hooks/useSmartSearch';
import { COLUMN_TYPE, SelectedViewColumn } from '../types';
import {
  FILTER_TYPE,
  SelectedSmartSearchFilter,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

interface LocalSmartSearchConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

enum STATE {
  PREVIEW = 'preview',
  EDIT = 'edit',
  GALLERY = 'gallery',
  START_WITH = 'start_with',
}

const LocalSmartSearchConfig = ({
  onOutputConfigured,
}: LocalSmartSearchConfigProps) => {
  const intl = useIntl();

  const {
    filtersWithIds: filterArray,
    filters,
    addFilter,
    editFilter,
    startsWithAll,
    setStartsWithAll,
    deleteFilter,
  } = useSmartSearch();

  const isEmptyQuery = !filterArray.length;

  const [selectedFilter, setSelectedFilter] =
    useState<SelectedSmartSearchFilter>(null);
  const [searchState, setSearchState] = useState(
    isEmptyQuery ? STATE.START_WITH : STATE.PREVIEW
  );

  // event handlers for query overview
  const handleDeleteFilter = (filter: SmartSearchFilterWithId) => {
    setSearchState(STATE.PREVIEW);
    deleteFilter(filter.id);
  };

  const handleEditFilter = (filter: SmartSearchFilterWithId) => {
    setSelectedFilter(filter);
    setSearchState(STATE.EDIT);
  };

  //event handlers for filter gallery
  const handleAddNewFilter = (type: FILTER_TYPE) => {
    setSelectedFilter({ type });
    setSearchState(STATE.EDIT);
  };

  //event handlers for filter editor
  const handleCancelSubmitFilter = () => {
    setSearchState(STATE.PREVIEW);
  };

  const handleSubmitStartsWith = (shouldStartWithAll: boolean) => {
    onOutputConfigured([
      {
        config: {
          filters: filters,
        },
        title: intl.formatMessage({
          id: 'misc.views.columnDialog.localSmartSearch.title',
        }),
        type: COLUMN_TYPE.LOCAL_SMART_SEARCH,
      },
    ]);
    setSearchState(STATE.PREVIEW);
    setStartsWithAll(shouldStartWithAll);
  };

  const handleSubmitFilter = (
    filter: ZetkinSmartSearchFilter | SmartSearchFilterWithId
  ) => {
    onOutputConfigured([
      {
        config: {
          filters: filters,
        },
        title: intl.formatMessage({
          id: 'misc.views.columnDialog.localSmartSearch.title',
        }),
        type: COLUMN_TYPE.LOCAL_SMART_SEARCH,
      },
    ]);
    setSearchState(STATE.PREVIEW);
    // If editing existing filter
    if ('id' in filter) {
      editFilter(filter.id, filter);
    } else {
      // If creating a new filter
      addFilter(filter);
    }
  };

  return (
    <Box>
      {searchState === STATE.PREVIEW && (
        <QueryOverview
          filters={filterArray}
          hasSaveCancelButtons={false}
          onDeleteFilter={handleDeleteFilter}
          onEditFilter={handleEditFilter}
          onOpenFilterGallery={() => setSearchState(STATE.GALLERY)}
          onOpenStartsWithEditor={() => setSearchState(STATE.START_WITH)}
          startsWithAll={startsWithAll}
        />
      )}
      {searchState === STATE.GALLERY && (
        <FilterGallery
          onAddNewFilter={handleAddNewFilter}
          onCancelAddNewFilter={() => setSearchState(STATE.PREVIEW)}
        />
      )}
      {searchState === STATE.EDIT && selectedFilter && (
        <FilterEditor
          filter={selectedFilter}
          onCancelSubmitFilter={handleCancelSubmitFilter}
          onSubmitFilter={handleSubmitFilter}
        />
      )}
      {searchState === STATE.START_WITH && (
        <StartsWith
          onCancel={handleCancelSubmitFilter}
          onSubmit={handleSubmitStartsWith}
          startsWithAll={startsWithAll}
        />
      )}
    </Box>
  );
};

export default LocalSmartSearchConfig;
