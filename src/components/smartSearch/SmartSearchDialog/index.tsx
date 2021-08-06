import { useRouter } from 'next/router';
import { useState } from 'react';
import { Dialog,  DialogContent } from '@material-ui/core';
import { useMutation, useQueryClient } from 'react-query';

import FilterEditor from './FilterEditor';
import FilterGallery from './FilterGallery';
import patchQuery from 'fetching/patchQuery';
import QueryOverview from './QueryOverview';
import StartsWith from '../filters/All';
import useSmartSearch from 'hooks/useSmartSearch';
import { ZetkinQuery } from 'types/zetkin';
import { FILTER_TYPE, SelectedSmartSearchFilter, SmartSearchFilterWithId,
    ZetkinSmartSearchFilter } from 'types/smartSearch';

interface SmartSearchDialog {
    query?: ZetkinQuery;
    onDialogClose: () => void;
}

enum QUERY_DIALOG_STATE {
    PREVIEW='preview',
    EDIT='edit',
    GALLERY='gallery',
    START_WITH='start_with'
}

const SmartSearchDialog = (
    { onDialogClose, query }: SmartSearchDialog,
) : JSX.Element => {
    const queryClient = useQueryClient();
    const { orgId, taskId } = useRouter().query;

    const {
        filtersWithIds: filterArray,
        filters,
        addFilter,
        editFilter,
        startsWithAll,
        setStartsWithAll,
        deleteFilter } = useSmartSearch(query?.filter_spec);

    const isEmptyQuery = !filterArray.length;

    const [selectedFilter, setSelectedFilter] = useState<SelectedSmartSearchFilter>(null);
    const [dialogState, setDialogState] = useState(
        isEmptyQuery ? QUERY_DIALOG_STATE.START_WITH : QUERY_DIALOG_STATE.PREVIEW,
    );

    const taskMutation = useMutation(patchQuery(orgId as string, query?.id as number),{
        onSettled: () => queryClient.invalidateQueries(['task', orgId, taskId]),
    } );

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
        taskMutation.mutate({ filter_spec: filters });
        onDialogClose();
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

    const handleSubmitFilter = (filter: ZetkinSmartSearchFilter | SmartSearchFilterWithId) => {
        setDialogState(QUERY_DIALOG_STATE.PREVIEW);
        // If editing existing filter
        if ('id' in filter) {
            editFilter(filter.id, filter);
        }
        // If creating a new filter
        else {
            addFilter(filter);
        }
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            onClose={ handleDialogClose }
            open>
            <DialogContent>
                { dialogState === QUERY_DIALOG_STATE.PREVIEW && (
                    <QueryOverview
                        filters={ filterArray }
                        onCloseDialog={ handleDialogClose }
                        onDeleteFilter={ handleDeleteFilter }
                        onEditFilter={ handleEditFilter }
                        onOpenFilterGallery={ handleOpenFilterGallery }
                        onOpenStartsWithEditor={ handleEditStartsWith }
                        onSaveQuery={ handleSaveQuery }
                        startsWithAll={ startsWithAll }
                    />
                ) }
                { dialogState === QUERY_DIALOG_STATE.GALLERY && (
                    <FilterGallery
                        onAddNewFilter={ handleAddNewFilter }
                        onCancelAddNewFilter={ handleCancelAddNewFilter }
                    />
                ) }
                { dialogState === QUERY_DIALOG_STATE.EDIT && selectedFilter && (
                    <FilterEditor
                        filter={ selectedFilter }
                        onCancelSubmitFilter={ handleCancelSubmitFilter }
                        onSubmitFilter={ handleSubmitFilter }
                    />
                ) }
                { dialogState === QUERY_DIALOG_STATE.START_WITH && (
                    <StartsWith
                        onCancel={ handleCancelSubmitFilter }
                        onSubmit={ handleSubmitStartsWith }
                        startsWithAll={ startsWithAll }
                    />
                ) }
            </DialogContent>
        </Dialog>
    );
};

export default SmartSearchDialog;
