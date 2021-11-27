import { Box, Button, Input, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { FormEvent, FunctionComponent, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { ColumnEditorColumnSpec } from '.';
import PersonFieldColumnConfigForm from './config/PersonFieldColumnConfigForm';
import PersonQueryColumnConfigForm from './config/PersonQueryColumnConfigForm';
import PersonTagColumnConfigForm from './config/PersonTagColumnConfigForm';
import SurveyResponseColumnConfigForm from './config/SurveyResponseColumnConfigForm';
import SurveySubmittedColumnConfigForm from './config/SurveySubmittedColumnConfigForm';
import {
    COLUMN_TYPE,
    PersonFieldViewColumnConfig,
    PersonQueryViewColumnConfig,
    PersonTagViewColumnConfig,
    SurveyResponseViewColumnConfig,
    SurveySubmittedViewColumnConfig,
} from 'types/views';
import { getDefaultViewColumnConfig, isColumnConfigValid } from './utils';


interface ColumnEditorProps {
    column: ColumnEditorColumnSpec | null;
    onCancel: () => void;
    onSave: (colSpec: ColumnEditorColumnSpec) => void;
    type: COLUMN_TYPE;
}

const ColumnEditor : FunctionComponent<ColumnEditorProps> = ({ column, onCancel, onSave, type }) => {
    const intl = useIntl();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [title, setTitle] = useState<string>(
        column?.title || intl.formatMessage({ id: 'misc.views.columnDialog.editor.defaultTitle' }));
    const [config, setConfig] = useState(column?.config || getDefaultViewColumnConfig(type));

    const onSubmit = (ev : FormEvent) => {
        ev.preventDefault();
        onSave({
            config: config,
            title,
            type,
        });
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
                        { type == COLUMN_TYPE.PERSON_FIELD && (
                            <PersonFieldColumnConfigForm
                                config={ config as PersonFieldViewColumnConfig }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                        { type == COLUMN_TYPE.PERSON_QUERY && (
                            <PersonQueryColumnConfigForm
                                config={ config as PersonQueryViewColumnConfig }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                        { type == COLUMN_TYPE.PERSON_TAG && (
                            <PersonTagColumnConfigForm
                                config={ config as PersonTagViewColumnConfig }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                        { type == COLUMN_TYPE.SURVEY_RESPONSE && (
                            <SurveyResponseColumnConfigForm
                                config={ config as SurveyResponseViewColumnConfig }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                        { type == COLUMN_TYPE.SURVEY_SUBMITTED && (
                            <SurveySubmittedColumnConfigForm
                                config={ config as SurveySubmittedViewColumnConfig }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
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
                                disabled={ !isColumnConfigValid(type, config) }
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
