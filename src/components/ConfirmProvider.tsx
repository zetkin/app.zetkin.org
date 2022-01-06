/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, Button } from '@material-ui/core';
import React, { useContext, useState } from 'react';

import ZetkinDialog from './ZetkinDialog';

interface ConfirmProps {
    actionText: string;
    title: string;
    onConfirm: <T>(t?: T) => void;
}

interface ContextProps {
    confirmProps: ConfirmProps;
    open: boolean;
    reset: () => void;
    setConfirmProps: (newProps: ConfirmProps) => void;
    setOpen: (newValue: boolean) => void;
}

const defaultValue = {
    confirmProps: { actionText: '', onConfirm: () => {} , title: '' },
    open: false,
    reset: () => null,
    setConfirmProps: () => null,
    setOpen: () => null,
};

export const ConfirmContext = React.createContext<ContextProps>(defaultValue);

const ConfirmModal = () => {
    const confirm = useContext(ConfirmContext);

    const onClick = () => {
        confirm.confirmProps.onConfirm();
        clear();
    };

    const clear = () => {
        confirm.setOpen(false);
        confirm.reset();
    };

    return (
        <ZetkinDialog
            onClose={ clear }
            open={ confirm.open }
            title={ confirm.confirmProps.title }>
            <Box>
                <p>{ confirm.confirmProps.actionText }</p>
                <Box display="flex" justifyContent="flex-end" py={ 2 }>
                    <Box mx={ 1 }><Button color="primary" onClick={ onClick } variant="contained">Confirm</Button></Box>
                    <Button color="default" onClick={ () => confirm.setOpen(false) } variant="contained">Cancel</Button>
                </Box>

            </Box>
        </ZetkinDialog>
    );
};

export const ConfirmProvider: React.FunctionComponent = (props) => {
    const [open, setOpen] = useState(false);
    const [confirmProps, setConfirmProps] = useState(defaultValue.confirmProps);
    const reset = () => setConfirmProps(defaultValue.confirmProps);

    return (
        <ConfirmContext.Provider value={{ confirmProps, open, reset, setConfirmProps, setOpen  }}>
            <ConfirmModal />
            { props.children }
        </ConfirmContext.Provider>
    );
};
