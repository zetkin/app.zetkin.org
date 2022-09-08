import { useIntl } from 'react-intl';
import { Box, Container } from '@material-ui/core';
import { FormEvent, FunctionComponent } from 'react';

import { isColumnConfigValid } from './utils';
import PersonFieldColumnConfigForm from './config/PersonFieldColumnConfigForm';
import PersonQueryColumnConfigForm from './config/PersonQueryColumnConfigForm';
import PersonTagColumnConfigForm from './config/PersonTagColumnConfigForm';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import SurveyResponseColumnConfigForm from './config/SurveyResponseColumnConfigForm';
import SurveySubmittedColumnConfigForm from './config/SurveySubmittedColumnConfigForm';
import {
  COLUMN_TYPE,
  PendingZetkinViewColumn,
  PersonFieldViewColumn,
  PersonQueryViewColumn,
  PersonTagViewColumn,
  SelectedViewColumn,
  SurveyResponseViewColumn,
  SurveySubmittedViewColumn,
  ZetkinViewColumn,
} from 'features/views/components/types';

interface ColumnEditorProps {
  column: ZetkinViewColumn | PendingZetkinViewColumn;
  onCancel: () => void;
  onChange: (colSpec: SelectedViewColumn) => void;
  onSave: () => Promise<void>;
}

const ColumnEditor: FunctionComponent<ColumnEditorProps> = ({
  column,
  onCancel,
  onChange,
  onSave,
}) => {
  const intl = useIntl();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const onCancelButtonPress = () => {
    // If is existing column, close config
    if ('id' in column) {
      onCancel();
    }
    // If is new column, go back to gallery
    if (!('id' in column)) {
      onChange({});
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Box display="flex" flexDirection="column" height="100%" pb={2}>
        <Box
          display="flex"
          flexDirection="column"
          flexGrow="1"
          justifyContent="center"
        >
          <Container maxWidth="md">
            {column.type == COLUMN_TYPE.PERSON_FIELD && (
              <PersonFieldColumnConfigForm
                column={column as PersonFieldViewColumn}
                onChange={onChange}
              />
            )}
            {column.type == COLUMN_TYPE.PERSON_QUERY && (
              <PersonQueryColumnConfigForm
                column={column as PersonQueryViewColumn}
                onChange={onChange}
              />
            )}
            {column.type == COLUMN_TYPE.PERSON_TAG && (
              <PersonTagColumnConfigForm
                column={column as PersonTagViewColumn}
                onChange={onChange}
              />
            )}
            {column.type == COLUMN_TYPE.SURVEY_RESPONSE && (
              <SurveyResponseColumnConfigForm
                column={column as SurveyResponseViewColumn}
                onChange={onChange}
              />
            )}
            {column.type == COLUMN_TYPE.SURVEY_SUBMITTED && (
              <SurveySubmittedColumnConfigForm
                column={column as SurveySubmittedViewColumn}
                onChange={onChange}
              />
            )}
          </Container>
        </Box>
        <Box flexGrow={0}>
          <SubmitCancelButtons
            onCancel={onCancelButtonPress}
            submitDisabled={!isColumnConfigValid(column)}
            submitText={intl.formatMessage({
              id: 'misc.views.columnDialog.editor.buttonLabels.save',
            })}
          />
        </Box>
      </Box>
    </form>
  );
};

export default ColumnEditor;
