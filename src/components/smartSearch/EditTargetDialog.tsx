import { FormattedMessage as Msg } from 'react-intl';
import { useState } from 'react';
import { Box, Button, ButtonBase, Card, CardContent, Dialog, DialogContent, Typography } from '@material-ui/core';

import All from './filters/All';
import Filter from './Filter';
import { isFilterWithId } from './utils';
import MostActive from './filters/MostActive';
import patchTaskItem from 'fetching/tasks/patchTaskItem';
import { useRouter } from 'next/router';
import { ZetkinSmartSearchFilter } from 'types/zetkin';
import { FILTER_TYPE, ZetkinSmartSearchFilterWithId } from 'types/smartSearch';
import { useMutation, useQueryClient } from 'react-query';

interface EditTargetDialogProps {
    filterSpec: ZetkinSmartSearchFilter[];
    onDialogClose: () => void;
    open: boolean;
}

const EditTargetDialog = ({ onDialogClose, open, filterSpec }: EditTargetDialogProps) : JSX.Element => {
    const queryClient = useQueryClient();
    const { orgId, taskId } = useRouter().query;
    const filtersWithIds = filterSpec.map((filter, index) => ({ ...filter, id: index }));
    const [filterArray, setFilterArray] = useState<ZetkinSmartSearchFilterWithId[]>(filtersWithIds);
    const [selectedType, setSelectedType] = useState<FILTER_TYPE | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<ZetkinSmartSearchFilterWithId| null>(null);

    const taskMutation = useMutation(patchTaskItem(orgId as string, taskId as string),{
        onSettled: () => queryClient.invalidateQueries('tasks'),
    } );

    const handleDialogClose = () => {
        setSelectedType(null);
        onDialogClose();
    };

    const handleCancelFilter = () => setSelectedType(null);

    const handleSubmitFilter = (filter:ZetkinSmartSearchFilterWithId | ZetkinSmartSearchFilter) => {
        if (isFilterWithId(filter)) {
            setFilterArray(filterArray.map(f => {
                if (f.id === filter.id) {
                    return filter;
                }
                else {
                    return f;
                }
            }));
        }
        else {
            const newId = 1 + (filterArray.length ? Math.max(...filterArray.map(f => f.id)) : 0);
            setFilterArray(filterArray.concat({ ...filter, id: newId }));
        }
        setSelectedFilter(null);
        setSelectedType(null);
    };

    const handleSelectedTypeChange = (type: FILTER_TYPE) => setSelectedType(type);

    const handleSave = () => {
        taskMutation.mutate(filterArray.map(filter => ({
            config: filter.config, op: filter.op, type: filter.type,
        })));
        onDialogClose();
    };

    const handleDeleteButtonClick = (filter: ZetkinSmartSearchFilterWithId) => {
        setFilterArray(filterArray.filter(f => f.id !== filter.id));
    };

    const handleEditButtonClick = (filter: ZetkinSmartSearchFilterWithId) => {
        setSelectedFilter(filter);
        setSelectedType(filter.type as FILTER_TYPE);
    };

    return (
        <Dialog fullWidth maxWidth="xl" onClose={ handleDialogClose } open={ open }>
            <DialogContent>
                { !selectedType && (
                    <>
                        <Box p={ 1 }>
                            <Typography variant="h6">
                                <Msg id="misc.smartSearch.headers.current"/>
                            </Typography>
                            { filterArray.map(filter => {
                                return (
                                    <Filter key={ filter.id } filter={ filter } onDelete={ handleDeleteButtonClick } onEdit={ handleEditButtonClick } />
                                );
                            }) }
                        </Box>
                        <Box p={ 1 }>
                            <Typography variant="h6">
                                <Msg id="misc.smartSearch.headers.add"/>
                            </Typography>
                            { Object.values(FILTER_TYPE).map(value => (
                                <ButtonBase
                                    key={ value }
                                    disableRipple
                                    onClick={ () => handleSelectedTypeChange(value) }>
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
                { selectedType === FILTER_TYPE.ALL && <All onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
                { selectedType === FILTER_TYPE.MOST_ACTIVE && <MostActive filter={ selectedFilter } onCancel={ handleCancelFilter } onSubmit={ handleSubmitFilter }/> }
            </DialogContent>
        </Dialog>
    );
};

export default EditTargetDialog;
