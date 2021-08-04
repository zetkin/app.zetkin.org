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
    open: boolean;
}

enum QUERY_DIALOG_STATE {
    PREVIEW='preview',
    EDIT='edit',
    GALLERY='gallery'
}

const QueryOverviewDialog = (
    { onDialogClose, open, query }: QueryOverviewDialogProps,
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
        setSelectedFilter(null);
        setDialogState(QUERY_DIALOG_STATE.PREVIEW);
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

    const handleSave = () => {
        taskMutation.mutate({ filter_spec: filters });
        onDialogClose();
    };

    const handleDeleteButtonClick = (filter: SmartSearchFilterWithId) => {
        deleteFilter(filter.id);
    };

    const handleEditButtonClick = (filter: SmartSearchFilterWithId) => {
        setSelectedFilter(filter);
    };

    return (
        <Dialog fullWidth maxWidth="xl" onClose={ handleDialogClose } open={ open }>
            <DialogContent>
                { !selectedFilter && (
                    <>
                        <Box p={ 1 }>
                            <Typography variant="h6">
                                <Msg id="misc.smartSearch.headers.current"/>
                            </Typography>
                            { filterArray.map(filter => {
                                return (
                                    <DisplayFilter key={ filter.id } filter={ filter } onDelete={ handleDeleteButtonClick } onEdit={ handleEditButtonClick } />
                                );
                            }) }
                        </Box>
                        <Box p={ 1 }>
                            <Typography variant="h6">
                                <Msg id="misc.smartSearch.headers.add"/>
                            </Typography>
                            { /* Buttons to add new filter */ }
                            { Object.values(FILTER_TYPE).map(value => (
                                <ButtonBase
                                    key={ value }
                                    disableRipple
                                    onClick={ () => setSelectedFilter({ type: value }) }>
                                    <Card style={{ margin: '1rem', width: '250px' }}>
                                        <CardContent>
                                            <Typography>
                                                <Msg id={ `misc.smartSearch.filterTitles.${value}` }/>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </ButtonBase>
                            )) }
                            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                                <Button color="primary" onClick={ handleDialogClose }>
                                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                                </Button>
                                <Button color="primary" onClick={ handleSave } variant="contained">
                                    <Msg id="misc.smartSearch.buttonLabels.save"/>
                                </Button>
                            </Box>
                        </Box>
                    </>
                ) }
                { selectedFilter?.type === FILTER_TYPE.ALL && <All onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.MOST_ACTIVE && <MostActive filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.RANDOM && <Random filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.SURVEY_SUBMISSION && <SurveySubmission filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.USER && <User filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.CAMPAIGN_PARTICIPATION && <CampaignParticipation filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.PERSON_DATA && <PersonData filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.PERSON_TAGS && <PersonTags filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.SURVEY_RESPONSE && <SurveyResponse filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedFilter?.type === FILTER_TYPE.CALL_HISTORY && <CallHistory filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
            </DialogContent>
        </Dialog>
    );
};

export default QueryOverviewDialog;
