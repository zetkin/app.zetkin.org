import { Box, Button, Input, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { FormEvent, FunctionComponent, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { COLUMN_TYPE } from 'types/views';
import { ColumnEditorColumnSpec } from '.';


interface ColumnEditorProps {
    onCancel: () => void;
    onSave: (colSpec: ColumnEditorColumnSpec) => void;
    type: COLUMN_TYPE;
}

const ColumnEditor : FunctionComponent<ColumnEditorProps> = ({ onCancel, onSave, type }) => {
    const intl = useIntl();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [title, setTitle] = useState<string>(intl.formatMessage({ id: 'misc.views.columnDialog.editor.defaultTitle' }));

    const onSubmit = (ev : FormEvent) => {
        ev.preventDefault();
        onSave({ title, type });
    };

    return (
        <Box display="flex" flexDirection="column" height="100%" pb={ 2 }>
            <Box display="flex"
                flexDirection={ isMobile ? 'column' : 'row' }
                justifyContent="space-between"
                mb={ 1 }>
                <Box flex={ 1 }>
                    <Typography align="center" variant="h5">
                        <Msg id={ `misc.views.columnDialog.types.${type}` }/>
                    </Typography>
                </Box>
            </Box>
            <form onSubmit={ onSubmit }
                style={{ height: '100%' }}>
                <Box display="flex" flexDirection="column" height="100%">
                    <Box flex={ 20 }>
                        <Input onChange={ (ev) => setTitle(ev.target.value) } value={ title } />
                    </Box>
                    <Box>
                        <Box
                            alignItems="flex-end"
                            display="flex"
                            justifyContent="flex-end"
                            m={ 1 }
                            style={{ gap: '1rem' }}>
                            <Button color="primary" onClick={ () => onCancel() } variant="outlined">
                                <Msg id="misc.views.columnDialog.editor.buttonLabels.cancel"/>
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                variant="contained">
                                <Msg id="misc.views.columnDialog.editor.buttonLabels.save"/>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </form>
        </Box>
    );
};

export default ColumnEditor;
