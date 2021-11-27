import { FormattedMessage as Msg } from 'react-intl';
import { Button, Dialog, DialogActions, Input } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';

import { ZetkinViewColumn } from 'types/views';


interface ViewRenameColumnDialogProps {
    column: Pick<ZetkinViewColumn, 'id' | 'title'>;
    onCancel: () => void;
    onSave: (column: Pick<ZetkinViewColumn, 'id' | 'title'>) => void;
}

const ViewRenameColumnDialog : FunctionComponent<ViewRenameColumnDialogProps> = ({ column, onCancel, onSave }) => {
    const [title, setTitle] = useState(column.title);

    return (
        <Dialog onClose={ onCancel } open={ true }>
            <Input
                onChange={ ev => setTitle(ev.target.value) }
                value={ title }
            />
            <DialogActions>
                <Button color="primary" onClick={ () => onSave({ ...column, title }) }>
                    <Msg id="misc.views.columnRenameDialog.save"/>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewRenameColumnDialog;
