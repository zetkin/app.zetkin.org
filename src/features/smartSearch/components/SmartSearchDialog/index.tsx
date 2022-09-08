import { useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';

import FilterEditor from './FilterEditor';
import FilterGallery from './FilterGallery';
import QueryOverview from './QueryOverview';
import StartsWith from '../StartsWith';
import useSmartSearch from 'features/smartSearch/hooks/useSmartSearch';
import { ZetkinQuery } from 'utils/types/zetkin';
import {
  FILTER_TYPE,
  SelectedSmartSearchFilter,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/types';

export interface SmartSearchDialogProps {
  query?: ZetkinQuery | null;
  onDialogClose: () => void;
  onSave: (query: Partial<ZetkinQuery>) => void;
  readOnly?: boolean;
}

enum QUERY_DIALOG_STATE {
  PREVIEW = 'preview',
  EDIT = 'edit',
  GALLERY = 'gallery',
  START_WITH = 'start_with',
}

const SmartSearchDialog = ({
  onDialogClose,
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

  const isEmptyQuery = !filterArray.length && !readOnly;

  const [selectedFilter, setSelectedFilter] =
    useState<SelectedSmartSearchFilter>(null);
  const [dialogState, setDialogState] = useState(
    isEmptyQuery ? QUERY_DIALOG_STATE.START_WITH : QUERY_DIALOG_STATE.PREVIEW
  );

  // event handlers for query overview
  const handleOpenFilterGallery = () => {
    setDialogState(QUERY_DIALOG_STATE.GALLERY);
  };

  const handleEditStartsWith = () => {
    setDialogState(QUERY_DIALOG_STATE.START_WITH);
  };

  const handleDialogClose = () => {
    onDialogClose();
  };

  const handleSaveQuery = () => {
    onSave({
      filter_spec: filters,
    });
  };

  const handleDeleteFilter = (filter: SmartSearchFilterWithId) => {
    setDialogState(QUERY_DIALOG_STATE.PREVIEW);
    deleteFilter(filter.id);
  };

  const handleEditFilter = (filter: SmartSearchFilterWithId) => {
    setSelectedFilter(filter);
    setDialogState(QUERY_DIALOG_STATE.EDIT);
  };

  //event handlers for filter gallery
  const handleCancelAddNewFilter = () => {
    setDialogState(QUERY_DIALOG_STATE.PREVIEW);
  };

  const handleAddNewFilter = (type: FILTER_TYPE) => {
    setSelectedFilter({ type });
    setDialogState(QUERY_DIALOG_STATE.EDIT);
  };

  //event handlers for filter editor
  const handleCancelSubmitFilter = () => {
    setDialogState(QUERY_DIALOG_STATE.PREVIEW);
  };

  const handleSubmitStartsWith = (shouldStartWithAll: boolean) => {
    setDialogState(QUERY_DIALOG_STATE.PREVIEW);
    setStartsWithAll(shouldStartWithAll);
  };

  const handleSubmitFilter = (
    filter: ZetkinSmartSearchFilter | SmartSearchFilterWithId
  ) => {
    setDialogState(QUERY_DIALOG_STATE.PREVIEW);
    // If editing existing filter
    if ('id' in filter) {
      editFilter(filter.id, filter);
    } else {
      // If creating a new filter
      addFilter(filter);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xl" onClose={handleDialogClose} open>
      <DialogContent style={{ height: '85vh' }}>
        {dialogState === QUERY_DIALOG_STATE.PREVIEW && (
          <QueryOverview
            filters={filterArray}
            onCloseDialog={handleDialogClose}
            onDeleteFilter={handleDeleteFilter}
            onEditFilter={handleEditFilter}
            onOpenFilterGallery={handleOpenFilterGallery}
            onOpenStartsWithEditor={handleEditStartsWith}
            onSaveQuery={handleSaveQuery}
            readOnly={readOnly}
            startsWithAll={startsWithAll}
          />
        )}
        {dialogState === QUERY_DIALOG_STATE.GALLERY && (
          <FilterGallery
            onAddNewFilter={handleAddNewFilter}
            onCancelAddNewFilter={handleCancelAddNewFilter}
          />
        )}
        {dialogState === QUERY_DIALOG_STATE.EDIT && selectedFilter && (
          <FilterEditor
            filter={selectedFilter}
            onCancelSubmitFilter={handleCancelSubmitFilter}
            onSubmitFilter={handleSubmitFilter}
          />
        )}
        {dialogState === QUERY_DIALOG_STATE.START_WITH && (
          <StartsWith
            onCancel={handleCancelSubmitFilter}
            onSubmit={handleSubmitStartsWith}
            startsWithAll={startsWithAll}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SmartSearchDialog;
