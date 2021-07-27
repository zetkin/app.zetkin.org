import { FormattedMessage as Msg } from 'react-intl';
import { useState } from 'react';
import { Box, Button, ButtonBase, Card, CardContent, Dialog, DialogContent, Typography } from '@material-ui/core';

import All from './filters/All';
import DisplayFilter from './DisplayFilter';
import MostActive from './filters/MostActive';
import patchQuery from 'fetching/patchQuery';
import User from './filters/User';
import { useRouter } from 'next/router';
import { FILTER_TYPE, SelectedSmartSearchFilter, SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';
import { useMutation, useQueryClient } from 'react-query';

import useSmartSearch from 'hooks/useSmartSearch';
import { ZetkinQuery } from 'types/zetkin';

interface TaskAssigneesSmartSearchDialogProps {
    query?: ZetkinQuery;
    onDialogClose: () => void;
    open: boolean;
}

const TaskAssigneesSmartSearchDialog = ({ onDialogClose, open, query }: TaskAssigneesSmartSearchDialogProps) : JSX.Element => {
    const queryClient = useQueryClient();
    const { orgId, taskId } = useRouter().query;

    const { filtersWithIds: filterArray, filters, addFilter, editFilter, deleteFilter } = useSmartSearch(query?.filter_spec);
    const [selectedFilter, setSelectedFilter] = useState<SelectedSmartSearchFilter>(null);

    const taskMutation = useMutation(patchQuery(orgId as string, query?.id as number),{
        onSettled: () => queryClient.invalidateQueries(['task', orgId, taskId]),
    } );

    const handleDialogClose = () => {
        setSelectedFilter(null);
        onDialogClose();
    };

    const handleCancelFilter = () => setSelectedFilter(null);

    const handleSubmitFilter = (filter: ZetkinSmartSearchFilter | SmartSearchFilterWithId) => {
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
                { selectedFilter?.type === FILTER_TYPE.USER && <User filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
            </DialogContent>
        </Dialog>
    );
};

export default TaskAssigneesSmartSearchDialog;
