import { useContext } from 'react';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

import SnackbarContext from 'hooks/SnackbarContext';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { viewResource } from 'api/views';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinView } from 'types/views';

interface ViewDeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    view: ZetkinView;
}

const ViewDeleteConfirmDialog: React.FunctionComponent<ViewDeleteConfirmDialogProps> = ({ onClose, view, open }) => {
    const intl = useIntl();
    const router = useRouter();
    const { showSnackbar } = useContext(SnackbarContext);
    const deleteMutation = viewResource(view.organization.id.toString(), view.id.toString()).useDelete();

    return (
        <ZetkinDialog
            onClose={ () => onClose() }
            open={ open }
            title={ intl.formatMessage({ id: 'pages.people.views.layout.deleteDialog.title' }) }>
            <FormattedMessage id="pages.people.views.layout.deleteDialog.warningText" />
            <form onSubmit={ (ev) => {
                ev.preventDefault();
                deleteMutation.mutate(undefined, {
                    onError: () => {
                        showSnackbar('error', intl.formatMessage({ id: 'pages.people.views.layout.deleteDialog.error' }));
                    },
                    onSuccess: () => {
                        router.push(`/organize/${view.organization.id}/people/views`);
                    },
                });
            } }>
                <SubmitCancelButtons
                    onCancel={ () => onClose() }
                    submitDisabled={ deleteMutation.isLoading || deleteMutation.isSuccess }
                />
            </form>
        </ZetkinDialog>
    );
};

export default ViewDeleteConfirmDialog;