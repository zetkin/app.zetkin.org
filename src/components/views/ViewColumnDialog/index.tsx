import { Dialog, DialogContent } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';

import ColumnEditor from './ColumnEditor';
import ColumnGallery from './ColumnGallery';
import { COLUMN_TYPE, ZetkinViewColumn } from 'types/views';


export type ColumnEditorColumnSpec = Pick<ZetkinViewColumn, 'title' | 'type' | 'config'>;


interface ViewColumnDialogProps {
    onCancel: () => void;
    onSave: (colSpec: ColumnEditorColumnSpec) => void;
}

const ViewColumnDialog : FunctionComponent<ViewColumnDialogProps> = ({ onCancel, onSave }) => {
    const [selectedType, setSelectedType] = useState<COLUMN_TYPE | null>(null);

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            onClose={ () => onCancel() }
            open>
            <DialogContent
                style={{ height: '85vh' }}>
                { selectedType && (
                    <ColumnEditor onCancel={ onCancel } onSave={ onSave } type={ selectedType }/>
                ) }
                { !selectedType && (
                    <ColumnGallery onSelectType={ (type) => setSelectedType(type) } />
                ) }
            </DialogContent>
        </Dialog>
    );
};

export default ViewColumnDialog;
