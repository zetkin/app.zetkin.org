import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, List, ListItem } from '@material-ui/core';

import All from './filters/All';
import CallHistory from './filters/CallHistory';
import CampaignParticipation from './filters/CampaignParticipation';
import FilterGallery from './FilterGallery';
import FilterPreview from './FilterPreview';
import MostActive from './filters/MostActive';
import patchQuery from 'fetching/patchQuery';
import PersonData from './filters/PersonData';
import PersonTags from './filters/PersonTags';
import Random from './filters/Random';
import SurveyResponse from './filters/SurveyResponse';
import SurveySubmission from './filters/SurveySubmission';
import User from './filters/User';
import useSmartSearch from 'hooks/useSmartSearch';
import { ZetkinQuery } from 'types/zetkin';
import { FILTER_TYPE, SelectedSmartSearchFilter, SmartSearchFilterWithId,
    ZetkinSmartSearchFilter } from 'types/smartSearch';
import { useMutation, useQueryClient } from 'react-query';

interface QueryOverviewDialogProps {
    query?: ZetkinQuery;
    onDialogClose: () => void;
}

enum QUERY_DIALOG_STATE {
    PREVIEW='preview',
    EDIT='edit',
    GALLERY='gallery'
}

const QueryOverviewDialog = (
    { onDialogClose, query }: QueryOverviewDialogProps,
) : JSX.Element => {
    const queryClient = useQueryClient();
    const { orgId, taskId } = useRouter().query;

    const { filtersWithIds: filterArray,filters, addFilter, editFilter, deleteFilter } = useSmartSearch(query?.filter_spec);
    const [selectedFilter, setSelectedFilter] = useState<SelectedSmartSearchFilter>(null);
    const [dialogState, setDialogState] = useState(QUERY_DIALOG_STATE.PREVIEW);

    const taskMutation = useMutation(patchQuery(orgId as string, query?.id as number),{
        onSettled: () => queryClient.invalidateQueries(['task', orgId, taskId]),
    } );

    // event handlers for preview mode
    const handleOpenFilterGallery = () => {
        setDialogState(QUERY_DIALOG_STATE.GALLERY);
    };

    const handleDialogClose = () => {
        onDialogClose();
    };

    const handleSaveQuery = () => {
        taskMutation.mutate({ filter_spec: filters });
        onDialogClose();
    };

    const handleDeleteFilter = (filter: SmartSearchFilterWithId) => {
        deleteFilter(filter.id);
    };

    const handleEditFilter = (filter: SmartSearchFilterWithId) => {
        setSelectedFilter(filter);
        setDialogState(QUERY_DIALOG_STATE.EDIT);
    };

    //event handlers for gallery mode
    const handleCancelAddNewFilter = () => {
        setDialogState(QUERY_DIALOG_STATE.PREVIEW);
    };

    const handleAddNewFilter = (type: FILTER_TYPE) => {
        setSelectedFilter({ type });
        setDialogState(QUERY_DIALOG_STATE.EDIT);
    };

    //event handlers for edit view
    const handleCancelFilter = () => {
        setSelectedFilter(null);
        setDialogState(QUERY_DIALOG_STATE.PREVIEW);
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
        setSelectedFilter(null);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            onClose={ handleDialogClose }
            open>
            <DialogContent>
                { dialogState === QUERY_DIALOG_STATE.PREVIEW && (
                    <>
                        <Box margin="auto" maxWidth="500px" minWidth={ 0.5 }>
                            <List disablePadding>
                                { filterArray.map(filter => (
                                    <ListItem key={ filter.id }
                                        style={{ paddingBottom: '1rem' }}>
                                        <FilterPreview
                                            filter={ filter }
                                            onDeleteFilter={ handleDeleteFilter }
                                            onEditFilter={ handleEditFilter }
                                        />
                                    </ListItem>
                                )) }
                            </List>
                            <Box display="flex" justifyContent="center">
                                <Button
                                    color="primary"
                                    onClick={ handleOpenFilterGallery }
                                    variant="contained">
                                    <Msg id="misc.smartSearch.buttonLabels.addNewFilter"/>
                                </Button>
                            </Box>
                        </Box>
                        <DialogActions>
                            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                                <Button color="primary" onClick={ handleDialogClose } variant="outlined">
                                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                                </Button>
                                <Button color="primary" onClick={ handleSaveQuery } variant="contained">
                                    <Msg id="misc.smartSearch.buttonLabels.save"/>
                                </Button>
                            </Box>
                        </DialogActions>
                    </>
                ) }
                { dialogState === QUERY_DIALOG_STATE.GALLERY && (
                    <FilterGallery
                        onAddNewFilter={ handleAddNewFilter }
                        onCancelAddNewFilter={ handleCancelAddNewFilter }
                    />
                ) }
                { dialogState === QUERY_DIALOG_STATE.EDIT && (
                    <>
                        { selectedFilter?.type === FILTER_TYPE.ALL && <All onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.CALL_HISTORY && <CallHistory filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.CAMPAIGN_PARTICIPATION && <CampaignParticipation filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.MOST_ACTIVE && <MostActive filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.PERSON_DATA && <PersonData filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.PERSON_TAGS && <PersonTags filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.RANDOM && <Random filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.SURVEY_RESPONSE && <SurveyResponse filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.SURVEY_SUBMISSION && <SurveySubmission filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                        { selectedFilter?.type === FILTER_TYPE.USER && <User filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                    </>
                ) }
            </DialogContent>
        </Dialog>
    );
};

export default QueryOverviewDialog;
