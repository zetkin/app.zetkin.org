import { useIntl } from 'react-intl';
import { FunctionComponent, useState } from 'react';

import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { TextField } from '@material-ui/core';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinViewColumn } from 'types/views';


interface ViewRenameColumnDialogProps {
    column: Pick<ZetkinViewColumn, 'id' | 'title'>;
    onCancel: () => void;
    onSave: (column: Pick<ZetkinViewColumn, 'id' | 'title'>) => void;
}

const ViewRenameColumnDialog : FunctionComponent<ViewRenameColumnDialogProps> = ({ column, onCancel, onSave }) => {
    const intl = useIntl();
    const [title, setTitle] = useState(column.title);

    return (
        <ZetkinDialog onClose={ onCancel } open={ true }>
            <form onSubmit={ ev => {
                ev.preventDefault();
                onSave({
                    ...column,
                    title,
                });
            } }>
                <TextField
                    fullWidth
                    label={ intl.formatMessage({ id: 'misc.views.columnRenameDialog.title' }) }
                    onChange={ ev => setTitle(ev.target.value) }
                    value={ title }
                />
                <SubmitCancelButtons
                    onCancel={ onCancel }
                    submitText={ intl.formatMessage({ id: 'misc.views.columnRenameDialog.save' }) }
                />
            </form>
        </ZetkinDialog>
    );
};

export default ViewRenameColumnDialog;
