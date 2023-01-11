import { useIntl } from 'react-intl';
import { FunctionComponent, useState } from 'react';

import { ColumnChoice } from './choices';
import ColumnEditor from './ColumnEditor';
import ColumnGallery from './ColumnGallery';
import ZUIDialog from 'zui/ZUIDialog';
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
  const [columnChoice, setColumnChoice] = useState<ColumnChoice | null>();

  const onConfigure = (choice: ColumnChoice) => {
    setColumnChoice(choice);
  };

  return (
    <ZUIDialog maxWidth="lg" onClose={() => onCancel()} open>
      {columnChoice && (
        <ColumnEditor
          choice={columnChoice}
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
    </ZUIDialog>
  );
};

export default ViewColumnDialog;
