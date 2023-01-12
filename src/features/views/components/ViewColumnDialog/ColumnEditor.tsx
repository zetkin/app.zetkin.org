import { ChevronLeft } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { ColumnChoice } from './choices';
import { SelectedViewColumn } from '../types';

interface ColumnEditorProps {
  choice: ColumnChoice;
  color: string;
  onSave: (columns: SelectedViewColumn[]) => Promise<void>;
}

const ColumnEditor: FunctionComponent<ColumnEditorProps> = ({
  choice,
  color,
  onSave,
}) => {
  const intl = useIntl();
  const [columns, setColumns] = useState<SelectedViewColumn[]>([]);

  if (!choice.renderConfigForm) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box bgcolor={color} display="flex" flexDirection="column" padding={2}>
        <Box alignSelf="flex-start" display="flex" sx={{ cursor: 'pointer' }}>
          <ChevronLeft sx={{ color: 'white' }} />
          <Typography color="white" variant="h5">
            <Msg id="misc.views.columnDialog.editor.buttonLabels.change" />
          </Typography>
        </Box>

        <Box alignSelf="center" display="flex" flexDirection="column">
          <Box height={100} paddingBottom={1} width={100}>
            {choice.renderCardVisual(color)}
          </Box>
          <Typography color="white" variant="h5">
            <Msg id={`misc.views.columnDialog.choices.${choice.key}.title`} />
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow="1"
        justifyContent="center"
      >
        <Box alignSelf="center" maxWidth="md" padding={4}>
          {choice.renderConfigForm({
            onOutputConfigured: (columns) => {
              setColumns(columns);
            },
          })}
        </Box>
      </Box>
      <Box display="flex" flexGrow={0} justifyContent="flex-end" padding={2}>
        {!!columns.length && (
          <Button onClick={() => onSave(columns)} variant="contained">
            {intl.formatMessage(
              {
                id: 'misc.views.columnDialog.editor.buttonLabels.addColumns',
              },
              { columns: columns.length }
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ColumnEditor;
