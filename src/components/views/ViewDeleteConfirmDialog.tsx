import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { viewResource } from 'api/views';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinView } from 'types/views';

interface ViewDeleteConfirmDialogProps {
    onClose: () => void;
    view: ZetkinView;
}

const ViewDeleteConfirmDialog: React.FunctionComponent<ViewDeleteConfirmDialogProps> = ({ onClose, view }) => {
    const intl = useIntl();
    const router = useRouter();
    const deleteMutation = viewResource(view.organization.id.toString(), view.id.toString()).useDelete();

    return (
        <ZetkinDialog
            onClose={ () => onClose() }
            open
            title={ intl.formatMessage({ id: 'pages.people.views.layout.deleteDialog.warningText' }) }>
            <FormattedMessage id="pages.people.views.layout.deleteDialog.warningText" />
            <form onSubmit={ (ev) => {
                ev.preventDefault();
                deleteMutation.mutate(undefined, {
                    onSuccess: () => {
                        router.push(`/organize/${view.organization.id}/people/views`);
                    },
                });
            } }>
                <SubmitCancelButtons onCancel={ () => onClose() }/>
            </form>
        </ZetkinDialog>
    );
};

export default ViewDeleteConfirmDialog;