import { useIntl } from 'react-intl';
import { FunctionComponent, useState } from 'react';

import ColumnEditor from './ColumnEditor';
import ColumnGallery from './ColumnGallery';
import ZUIDialog from 'zui/ZUIDialog';
import {
  COLUMN_TYPE,
  SelectedViewColumn,
} from 'features/views/components/types';

// These column types will auto save and not open the ColumnEditor
export const AUTO_SAVE_TYPES = [
  COLUMN_TYPE.JOURNEY_ASSIGNEE,
  COLUMN_TYPE.LOCAL_BOOL,
  COLUMN_TYPE.LOCAL_PERSON,
  COLUMN_TYPE.PERSON_NOTES,
];

interface ViewColumnDialogProps {
  selectedColumn: SelectedViewColumn;
  onCancel: () => void;
  onSave: (colSpec: SelectedViewColumn) => Promise<void>;
}

const ViewColumnDialog: FunctionComponent<ViewColumnDialogProps> = ({
  selectedColumn,
  onCancel,
  onSave,
}) => {
  const intl = useIntl();
  const [column, setColumn] = useState<SelectedViewColumn>(
    selectedColumn || {}
  );

  const onSelectType = (type: COLUMN_TYPE) => {
    if (AUTO_SAVE_TYPES.includes(type)) {
      // Save column if no configuration needed
      onSave({
        title: intl.formatMessage({
          id: `misc.views.defaultColumnTitles.${type}`,
        }),
        type,
      });
      return;
    }
    // Create Pending state for column
    setColumn({
      config: {},
      title: '',
      type,
    });
  };

  return (
    <ZUIDialog maxWidth="lg" onClose={() => onCancel()} open>
      {column.type && (
        <ColumnEditor
          column={column}
          onCancel={onCancel}
          onChange={(column) => {
            setColumn(column);
          }}
          onSave={async () => {
            await onSave(column);
            setColumn({});
          }}
        />
      )}
      {!column.type && <ColumnGallery onSelectType={onSelectType} />}
    </ZUIDialog>
  );
};

export default ViewColumnDialog;
