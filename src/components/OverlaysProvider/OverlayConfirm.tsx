/* eslint-disable @typescript-eslint/no-empty-function */
import { FormattedMessage } from 'react-intl';
import { Box, Button } from '@material-ui/core';
import React, { useContext } from 'react';

import { OverlayContext } from './index';
import ZetkinDialog from '../ZetkinDialog';

export interface ConfirmProps {
    actionText: string;
    onConfirm: <T>(t?: T) => void;
    open: boolean;
    title: string;
}

export const defaultConfirmProps = { actionText: '', onConfirm: (): void => {}, open: false, title: '' };

export default function OverlayConfirm(): JSX.Element {
    const overlay = useContext(OverlayContext);

    const onClickConfirm = () => {
        overlay.confirmProps.onConfirm();
        clear();
    };

    const clear = () => {
        overlay.setConfirmProps(defaultConfirmProps);
    };

    return (
        <ZetkinDialog
            onClose={ clear }
            open={ overlay.confirmProps.open }
            title={ overlay.confirmProps.title }>
            <Box>
                <p>{ overlay.confirmProps.actionText }</p>
                <Box display="flex" justifyContent="flex-end" py={ 2 }>
                    <Box mx={ 2 }>
                        <Button color="primary" onClick={ onClickConfirm } variant="contained">
                            <FormattedMessage id="misc.components.confirm.buttons.submit"/>
                        </Button>
                    </Box>
                    <Button color="default" onClick={ clear } variant="contained">
                        <FormattedMessage id="misc.components.confirm.buttons.cancel"/>
                    </Button>
                </Box>

            </Box>
        </ZetkinDialog>
    );
}
