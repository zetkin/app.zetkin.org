import { Box, Button, Link, Typography } from '@mui/material';
import { ChevronLeft, Close } from '@mui/icons-material';
import { FunctionComponent, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { ColumnChoice } from './choices';
import { SelectedViewColumn, ZetkinViewColumn } from '../types';

interface ColumnEditorProps {
  choice: ColumnChoice;
  existingColumns: ZetkinViewColumn[];
  onCancel: () => void;
  onClose: () => void;
  onSave: (columns: SelectedViewColumn[]) => Promise<void>;
}

const ColumnEditor: FunctionComponent<ColumnEditorProps> = ({
  choice,
  existingColumns,
  onCancel,
  onClose,
  onSave,
}) => {
  const intl = useIntl();
  const [columns, setColumns] = useState<SelectedViewColumn[]>([]);

  if (!choice.renderConfigForm) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        bgcolor={choice.color}
        display="flex"
        flexDirection="column"
        padding={2}
      >
        <Box display="flex">
          <Box
            alignSelf="flex-start"
            display="flex"
            sx={{ cursor: 'pointer' }}
            width="100%"
          >
            <Link
              component="div"
              onClick={() => onCancel()}
              sx={{
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                fontFamily: 'inherit',
                justifyContent: 'center',
              }}
              underline="none"
              variant="h5"
            >
              <ChevronLeft sx={{ color: 'white' }} />
              <Msg id="misc.views.columnDialog.editor.buttonLabels.change" />
            </Link>
          </Box>
          <Box alignSelf="flex-end" display="flex" sx={{ cursor: 'pointer' }}>
            <Close
              fontSize="medium"
              onClick={() => onClose()}
              sx={{
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                fontFamily: 'inherit',
                justifyContent: 'center',
              }}
            />
          </Box>
        </Box>

        <Box alignSelf="center" display="flex" flexDirection="column">
          <Box height={100} paddingBottom={1} width={100}>
            {choice.renderCardVisual(choice.color)}
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
        <Box
          alignItems="center"
          alignSelf="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          maxWidth="md"
          padding={2}
        >
          {choice.renderConfigForm({
            existingColumns: existingColumns,
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
