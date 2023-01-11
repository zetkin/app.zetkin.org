import { useIntl } from 'react-intl';
import { Box, Button, Container } from '@mui/material';
import { FunctionComponent, useState } from 'react';

import { ColumnChoice } from './choices';
import { SelectedViewColumn } from '../types';

interface ColumnEditorProps {
  choice: ColumnChoice;
  onSave: (columns: SelectedViewColumn[]) => Promise<void>;
}

const ColumnEditor: FunctionComponent<ColumnEditorProps> = ({
  choice,
  onSave,
}) => {
  const [columns, setColumns] = useState<SelectedViewColumn[]>([]);
  const intl = useIntl();

  if (!choice.renderConfigForm) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" pb={2}>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow="1"
        justifyContent="center"
      >
        <Container maxWidth="md">
          {choice.renderConfigForm({
            onOutputConfigured(columns) {
              setColumns(columns);
            },
          })}
        </Container>
      </Box>
      <Box flexGrow={0}>
        {columns && (
          <Button onClick={() => onSave(columns)}>
            {intl.formatMessage({
              id: 'misc.views.columnDialog.editor.buttonLabels.save',
            })}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ColumnEditor;
