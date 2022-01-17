/* eslint-disable @typescript-eslint/no-empty-function */
import { Box } from '@material-ui/core';
import { useIntl } from 'react-intl';
import React, { useContext } from 'react';

import { ConfirmDialogContext } from './index';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import ZetkinDialog from '../../components/ZetkinDialog';

export interface ConfirmDialogProps {
    actionText: string;
    onConfirm: <T>(t?: T) => void;
    open: boolean;
    title: string;
}

export const defaultConfirmDialogProps = { actionText: '', onConfirm: (): void => {}, open: false, title: '' };

export default function ConfirmDialog(props: ConfirmDialogProps): JSX.Element {
    const intl = useIntl();
    const overlay = useContext(ConfirmDialogContext);

    const onClickConfirm = () => {
        props.onConfirm();
        clear();
    };

    const clear = () => {
        overlay.setConfirmDialogProps(defaultConfirmDialogProps);
    };

    return (
        <ZetkinDialog
            onClose={ clear }
            open={ props.open }
            title={ props.title }>
            <Box>
                <p>{ props.actionText }</p>
                <form onSubmit={ (e) => {
                    e.preventDefault();
                    onClickConfirm();
                } }>
                    <SubmitCancelButtons
                        onCancel={ clear }
                        submitText={ intl.formatMessage({ id: 'misc.components.confirm.buttons.submit' }) }
                    />
                </form>
            </Box>
        </ZetkinDialog>
    );
}


