import { Box, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { FormEvent, FunctionComponent } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { isColumnConfigValid } from './utils';
import PersonFieldColumnConfigForm from './config/PersonFieldColumnConfigForm';
import PersonQueryColumnConfigForm from './config/PersonQueryColumnConfigForm';
import PersonTagColumnConfigForm from './config/PersonTagColumnConfigForm';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import SurveyResponseColumnConfigForm from './config/SurveyResponseColumnConfigForm';
import SurveySubmittedColumnConfigForm from './config/SurveySubmittedColumnConfigForm';
import { COLUMN_TYPE, PendingZetkinViewColumn, PersonFieldViewColumn, PersonQueryViewColumn, PersonTagViewColumn, SelectedViewColumn, SurveyResponseViewColumn, SurveySubmittedViewColumn, ZetkinViewColumn } from 'types/views';


interface ColumnEditorProps {
    column: ZetkinViewColumn | PendingZetkinViewColumn;
    onCancel: () => void;
    onChange: (colSpec: SelectedViewColumn) => void;
    onSave: () => void;
}

const ColumnEditor : FunctionComponent<ColumnEditorProps> = ({ column, onCancel, onChange, onSave }) => {
    const intl = useIntl();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const onSubmit = (e : FormEvent) => {
        e.preventDefault();
        onSave();
    };

    return (
        <Box display="flex" flexDirection="column" height="100%" pb={ 2 }>
            <Box display="flex"
                flexDirection={ isMobile ? 'column' : 'row' }
                justifyContent="space-between"
                mb={ 1 }>
                <Box flex={ 1 }>
                    <Typography align="center" variant="h5">
                        <Msg id={ `misc.views.columnDialog.types.${column.type}` }/>
                    </Typography>
                </Box>
            </Box>
            <form onSubmit={ onSubmit }
                style={{ height: '100%' }}>
                <Box display="flex" flexDirection="column" height="100%">
                    <Box flex={ 20 }>
                        { column.type == COLUMN_TYPE.PERSON_FIELD && (
                            <PersonFieldColumnConfigForm
                                config={ column.config as PersonFieldViewColumn['config'] | undefined }
                                onChange={ config => {
                                    onChange({
                                        ...column,
                                        config },
                                    );
                                } }
                            />
                        ) }
                        { column.type == COLUMN_TYPE.PERSON_QUERY && (
                            <PersonQueryColumnConfigForm
                                config={ column.config as PersonQueryViewColumn['config'] | undefined }
                                onChange={ config => onChange({
                                    ...column,
                                    config },
                                ) }
                            />
                        ) }
                        { column.type == COLUMN_TYPE.PERSON_TAG && (
                            <PersonTagColumnConfigForm
                                config={ column.config as PersonTagViewColumn['config'] | undefined  }
                                onChange={ config => onChange({
                                    ...column,
                                    config },
                                ) }
                            />
                        ) }
                        { column.type == COLUMN_TYPE.SURVEY_RESPONSE && (
                            <SurveyResponseColumnConfigForm
                                column={ column as SurveyResponseViewColumn  }
                                onChange={ (column) => {
                                    onChange(column);
                                } }
                            />
                        ) }
                        { column.type == COLUMN_TYPE.SURVEY_SUBMITTED && (
                            <SurveySubmittedColumnConfigForm
                                config={ column.config  as SurveySubmittedViewColumn['config'] | undefined  }
                                onChange={ config => onChange({
                                    ...column,
                                    config },
                                ) }
                            />
                        ) }
                    </Box>
                    <Box>
                        <SubmitCancelButtons
                            onCancel={ onCancel }
                            submitDisabled={ !isColumnConfigValid(column) }
                            submitText={ intl.formatMessage({ id: 'misc.views.columnDialog.editor.buttonLabels.save' }) }
                        />
                    </Box>
                </Box>
            </form>
        </Box>
    );
};

export default ColumnEditor;
