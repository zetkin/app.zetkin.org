import { Form } from 'react-final-form';
import { FunctionComponent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';

import PersonSelect from 'components/forms/common/PersonSelect';
import { ZetkinView } from 'types/views';


export interface EmptyViewProps {
    view: ZetkinView;
}

const EmptyView: FunctionComponent<EmptyViewProps> = () => {
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
                                    onChange={ () => undefined }
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
                            <Button>
                                <Msg id="misc.views.empty.dynamic.configureButton"/>
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmptyView;
