import { Box, Dialog, useMediaQuery, useTheme } from '@mui/material';
import { FunctionComponent, useState } from 'react';

import { ColumnChoiceWithKey } from './choices';
import ColumnEditor from './ColumnEditor';
import ColumnGallery from './ColumnGallery';
import { useMessages } from 'core/i18n';
import {
  SelectedViewColumn,
  ZetkinViewColumn,
} from 'features/views/components/types';
import messageIds from 'features/views/l10n/messageIds';

interface ViewColumnDialogProps {
  columns: ZetkinViewColumn[];
  onClose: () => void;
  onSave: (columns: SelectedViewColumn[]) => Promise<void>;
}

const ViewColumnDialog: FunctionComponent<ViewColumnDialogProps> = ({
  columns: existingColumns,
  onClose,
  onSave,
}) => {
  const messages = useMessages(messageIds);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [columnChoice, setColumnChoice] =
    useState<ColumnChoiceWithKey | null>();

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      onClose={() => onClose()}
      open
    >
      <Box height="90vh">
        {columnChoice && (
          <ColumnEditor
            choice={columnChoice}
            existingColumns={existingColumns}
            onCancel={() => setColumnChoice(null)}
            onClose={onClose}
            onSave={async (columns) => {
              await onSave(columns);
              setColumnChoice(null);
            }}
          />
        )}
        {!columnChoice && (
          <ColumnGallery
            existingColumns={existingColumns}
            onAdd={async (choice) => {
              if (!choice.defaultColumns) {
                return null;
              }

              const columns = choice.defaultColumns(messages, existingColumns);
              await onSave(columns);
            }}
            onClose={onClose}
            onConfigure={(choice) => setColumnChoice(choice)}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default ViewColumnDialog;
