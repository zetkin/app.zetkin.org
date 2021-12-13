import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';

import ZetkinDialog from 'components/ZetkinDialog';

interface ViewErrorDialogProps {
    // failedMutation: UseMutationResult;
    open: boolean;
    onClose: () => void;
}

const ViewErrorDialog: React.FunctionComponent<ViewErrorDialogProps> = ({ open, onClose }) => {
    // const intl = useIntl();

    return (
        <ZetkinDialog
            onClose={ onClose }
            open={ open }>
            <div data-testid="view-column-config-error-dialog">
                <Typography variant="body1">
                    <FormattedMessage id="misc.views.columnConfigError" />
                </Typography>
            </div>
        </ZetkinDialog>
    );
};

export default ViewErrorDialog;