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
                                column={ column as PersonFieldViewColumn }
                                onChange={ onChange }
                            />
                        ) }
                        { column.type == COLUMN_TYPE.PERSON_QUERY && (
                            <PersonQueryColumnConfigForm
                                column={ column as PersonQueryViewColumn }
                                onChange={ onChange }
                            />
                        ) }
                        { column.type == COLUMN_TYPE.PERSON_TAG && (
                            <PersonTagColumnConfigForm
                                column={ column as PersonTagViewColumn }
                                onChange={ onChange }
                            />
                        ) }
                        { column.type == COLUMN_TYPE.SURVEY_RESPONSE && (
                            <SurveyResponseColumnConfigForm
                                column={ column as SurveyResponseViewColumn  }
                                onChange={ onChange }
                            />
                        ) }
                        { column.type == COLUMN_TYPE.SURVEY_SUBMITTED && (
                            <SurveySubmittedColumnConfigForm
                                column={ column as SurveySubmittedViewColumn  }
                                onChange={ onChange }
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
