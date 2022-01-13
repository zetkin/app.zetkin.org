import { Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';

import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import ZetkinDialog from 'components/ZetkinDialog';

interface ZetkinConfirmDialogProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    title?: string;
    warningText?: string;
    submitDisabled?: boolean;
}

const ZetkinConfirmDialog: React.FunctionComponent<ZetkinConfirmDialogProps> = ({
    open,
    onCancel,
    onSubmit,
    title,
    warningText,
    submitDisabled,
}) => {
    const intl = useIntl();
    return (
        <ZetkinDialog
            onClose={ () => onCancel() }
            open={ open }
            title={ title || intl.formatMessage({ id: 'misc.ConfirmDialog.defaultTitle' }) }>
            <Typography variant="body1">
                { warningText || intl.formatMessage({ id: 'misc.ConfirmDialog.defaultWarningText' }) }
            </Typography>
            <form onSubmit={ (ev) => {
                ev.preventDefault();
                onSubmit();
            } }>
                <SubmitCancelButtons
                    onCancel={ () => onCancel() }
                    submitDisabled={ submitDisabled }
                />
            </form>
        </ZetkinDialog>
    );
};

export default ZetkinConfirmDialog;