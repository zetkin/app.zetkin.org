import { Dialog, DialogContent } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';

import ColumnEditor from './ColumnEditor';
import ColumnGallery from './ColumnGallery';
import { COLUMN_TYPE, SelectedViewColumn } from 'types/views';


interface ViewColumnDialogProps {
    column: SelectedViewColumn;
    onCancel: () => void;
    onSave: (colSpec: SelectedViewColumn) => void;
}

const ViewColumnDialog : FunctionComponent<ViewColumnDialogProps> = ({ column, onCancel, onSave }) => {
    const [selectedType, setSelectedType] = useState<COLUMN_TYPE | null>(column?.type || null);

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            onClose={ () => onCancel() }
            open>
            <DialogContent
                style={{ height: '85vh' }}>
                { selectedType && (
                    <ColumnEditor
                        column={ column }
                        onCancel={ onCancel }
                        onSave={ onSave }
                        type={ selectedType }
                    />
                ) }
                { !selectedType && (
                    <ColumnGallery onSelectType={ (type) => setSelectedType(type) } />
                ) }
            </DialogContent>
        </Dialog>
    );
};

export default ViewColumnDialog;
