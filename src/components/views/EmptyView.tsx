import { Form } from 'react-final-form';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { defaultFetch } from 'fetching';
import PersonSelect from 'components/forms/common/PersonSelect';
import ViewSmartSearchDialog from './ViewSmartSearchDialog';
import { ZetkinPerson } from 'types/zetkin';
import { ZetkinView, ZetkinViewRow } from 'types/views';


export interface EmptyViewProps {
    orgId: string | number;
    view: ZetkinView;
}

const EmptyView: FunctionComponent<EmptyViewProps> = ({ orgId, view }) => {
    const queryClient = useQueryClient();
    const [queryDialogOpen, setQueryDialogOpen] = useState(false);

    const rowsKey = ['view', view.id.toString(), 'rows'];

    // TODO: Create mutation using new factory pattern
    const addRowMutation = useMutation(async (person: Partial<ZetkinPerson>) => {
        const res = await defaultFetch(`/orgs/${orgId}/people/views/${view.id}/rows/${person.id}`, {
            method: 'PUT',
        });
        const data = await res.json();
        return data.data;
    }, {
        onSuccess: (newRow) => {
            // Add created row directly to view, to avoid waiting for entire collection to reload
            const prevRows: ZetkinViewRow[] = queryClient.getQueryData<ZetkinViewRow[]>(rowsKey) || [];
            const allRows = prevRows.concat([newRow as ZetkinViewRow]);
            queryClient.setQueryData(rowsKey, allRows);

            // Invalidate to retrieve entire row collection (in case more were added elsewhere)
            queryClient.invalidateQueries(rowsKey);
        },
    });

    return (
        <Box m={ 2 }>
            <Grid container spacing={ 2 }>
                <Grid item md={ 6 }>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                <Msg id="misc.views.empty.static.headline"/>
                            </Typography>
                            <Typography variant="body1">
                                <Msg id="misc.views.empty.static.description"/>
                            </Typography>
                            <Form onSubmit={ () => undefined } render={ () => (
                                <PersonSelect
                                    name="person"
                                    onChange={ person => {
                                        addRowMutation.mutate(person);
                                    } }
                                    orgId={ 1 }
                                    selectedPerson={ null }
                                />
                            ) }
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={ 6 }>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                <Msg id="misc.views.empty.dynamic.headline"/>
                            </Typography>
                            <Typography variant="body1">
                                <Msg id="misc.views.empty.dynamic.description"/>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={ () => setQueryDialogOpen(true) }>
                                <Msg id="misc.views.empty.dynamic.configureButton"/>
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            { queryDialogOpen && (
                <ViewSmartSearchDialog
                    onDialogClose={ () => setQueryDialogOpen(false) }
                    orgId={ orgId }
                    view={ view }
                />
            ) }
        </Box>
    );
};

export default EmptyView;
