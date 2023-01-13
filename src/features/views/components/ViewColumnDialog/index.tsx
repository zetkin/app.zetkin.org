import { useIntl } from 'react-intl';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import { FunctionComponent, useState } from 'react';

import { ColumnChoice } from './choices';
import ColumnEditor from './ColumnEditor';
import ColumnGallery from './ColumnGallery';
import {
  SelectedViewColumn,
  ZetkinViewColumn,
} from 'features/views/components/types';

interface ViewColumnDialogProps {
  columns: ZetkinViewColumn[];
  onCancel: () => void;
  onSave: (columns: SelectedViewColumn[]) => Promise<void>;
}

const ViewColumnDialog: FunctionComponent<ViewColumnDialogProps> = ({
  columns: existingColumns,
  onCancel,
  onSave,
}) => {
  const intl = useIntl();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [columnChoice, setColumnChoice] = useState<ColumnChoice | null>();

  const onConfigure = (choice: ColumnChoice) => {
    setColumnChoice(choice);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      onClose={() => onCancel()}
      open
    >
      {columnChoice && (
        <ColumnEditor
          choice={columnChoice}
          color="#234890"
          existingColumns={existingColumns}
          onCancel={() => setColumnChoice(null)}
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

            const columns = choice.defaultColumns(intl);
            await onSave(columns);
          }}
          onConfigure={onConfigure}
        />
      )}
    </Dialog>
  );
};

export default ViewColumnDialog;
