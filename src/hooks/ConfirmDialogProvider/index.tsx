/* eslint-disable @typescript-eslint/no-empty-function */
import ConfirmDialog, { ConfirmDialogProps, defaultConfirmDialogProps } from './ConfirmDialog';
import React, { useState } from 'react';

interface ConfirmContextProps {
    setConfirmDialogProps: (newProps: ConfirmDialogProps) => void;
}

export const ConfirmDialogContext = React.createContext<ConfirmContextProps>({
    setConfirmDialogProps: () => null,
});

export const ConfirmDialogProvider: React.FunctionComponent = (props) => {
    const [confirmDialogProps, setConfirmDialogProps] = useState(defaultConfirmDialogProps);

    return (
        <ConfirmDialogContext.Provider
            value={{ setConfirmDialogProps }}>
            <ConfirmDialog { ...confirmDialogProps } />
            { props.children }
        </ConfirmDialogContext.Provider>
    );
};
