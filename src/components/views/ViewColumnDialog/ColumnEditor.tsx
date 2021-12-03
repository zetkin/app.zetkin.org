import { Box, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { FormEvent, FunctionComponent, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import PersonFieldColumnConfigForm from './config/PersonFieldColumnConfigForm';
import PersonQueryColumnConfigForm from './config/PersonQueryColumnConfigForm';
import PersonTagColumnConfigForm from './config/PersonTagColumnConfigForm';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import SurveyResponseColumnConfigForm from './config/SurveyResponseColumnConfigForm';
import SurveySubmittedColumnConfigForm from './config/SurveySubmittedColumnConfigForm';
import { COLUMN_TYPE, PersonFieldViewColumn, PersonQueryViewColumn, PersonTagViewColumn, SelectedViewColumn, SurveyResponseViewColumn, SurveySubmittedViewColumn, ZetkinViewColumn } from 'types/views';
import { getDefaultTitle, getDefaultViewColumnConfig, isColumnConfigValid } from './utils';


interface ColumnEditorProps {
    column: SelectedViewColumn | null;
    onCancel: () => void;
    onSave: (colSpec: SelectedViewColumn) => void;
    type: COLUMN_TYPE;
}

const ColumnEditor : FunctionComponent<ColumnEditorProps> = ({ column, onCancel, onSave, type }) => {
    const intl = useIntl();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [config, setConfig] = useState(column?.config || getDefaultViewColumnConfig(type));

    const onSubmit = (ev : FormEvent) => {
        ev.preventDefault();
        onSave({
            config,
            title: column?.title || getDefaultTitle({ config, type } as ZetkinViewColumn, intl),
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
                        { type == COLUMN_TYPE.PERSON_FIELD && (
                            <PersonFieldColumnConfigForm
                                config={ config as PersonFieldViewColumn['config'] }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                        { type == COLUMN_TYPE.PERSON_QUERY && (
                            <PersonQueryColumnConfigForm
                                config={ config as PersonQueryViewColumn['config'] }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                        { type == COLUMN_TYPE.PERSON_TAG && (
                            <PersonTagColumnConfigForm
                                config={ config as PersonTagViewColumn['config'] }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                        { type == COLUMN_TYPE.SURVEY_RESPONSE && (
                            <SurveyResponseColumnConfigForm
                                config={ config as SurveyResponseViewColumn['config'] }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                        { type == COLUMN_TYPE.SURVEY_SUBMITTED && (
                            <SurveySubmittedColumnConfigForm
                                config={ config as SurveySubmittedViewColumn['config'] }
                                onChange={ config => setConfig(config) }
                            />
                        ) }
                    </Box>
                    <Box>
                        <SubmitCancelButtons
                            onCancel={ onCancel }
                            submitDisabled={ !isColumnConfigValid(type, config) }
                            submitText={ intl.formatMessage({ id: 'misc.views.columnDialog.editor.buttonLabels.save' }) }
                        />
                    </Box>
                </Box>
            </form>
        </Box>
    );
};

export default ColumnEditor;
