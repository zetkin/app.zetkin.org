import { useIntl } from 'react-intl';
import { Dialog, DialogContent } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';

import ColumnEditor from './ColumnEditor';
import ColumnGallery from './ColumnGallery';
import { getDefaultViewColumnConfig } from './utils';
import { COLUMN_TYPE, SelectedViewColumn } from 'types/views';

interface ViewColumnDialogProps {
    selectedColumn: SelectedViewColumn;
    onCancel: () => void;
    onSave: (colSpec: SelectedViewColumn) => void;
}

const AUTO_SAVE_TYPES = [
    COLUMN_TYPE.LOCAL_BOOL,
    COLUMN_TYPE.LOCAL_PERSON,
    COLUMN_TYPE.PERSON_NOTES,
];

const ViewColumnDialog : FunctionComponent<ViewColumnDialogProps> = ({ selectedColumn, onCancel, onSave }) => {
    const intl = useIntl();
    const [column, setColumn] = useState<SelectedViewColumn>(selectedColumn || {});

    const onSelectType = (type: COLUMN_TYPE) => {
        if (AUTO_SAVE_TYPES.includes(type)) {
            // Save column if no configuration needed
            onSave({
                title: intl.formatMessage({ id: `misc.views.defaultColumnTitles.${type}` }),
                type,
            });
            return;
        }
        // Create Pending state for column
        setColumn({
            config: getDefaultViewColumnConfig(type),
            title: '',
            type,
        });
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            onClose={ () => onCancel() }
            open>
            <DialogContent
                style={{ height: '85vh' }}>
                { column.type && (
                    <ColumnEditor
                        column={ column }
                        onCancel={ onCancel }
                        onChange={ column => {
                            setColumn(column);
                        } }
                        onSave={ () => {
                            onSave(column);
                        } }
                    />
                ) }
                { !column.type && (
                    <ColumnGallery onSelectType={ onSelectType } />
                ) }
            </DialogContent>
        </Dialog>
    );
};

export default ViewColumnDialog;
