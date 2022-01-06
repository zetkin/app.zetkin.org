/* eslint-disable @typescript-eslint/no-empty-function */
import OverlayConfirm, { ConfirmProps, defaultConfirmProps } from './OverlayConfirm';
import React, { useState } from 'react';

interface OverlayContextProps {
    confirmProps: ConfirmProps;
    setConfirmProps: (newProps: ConfirmProps) => void;
}

const defaultValue = {
    confirmProps: defaultConfirmProps,
    setConfirmProps: () => null,
};

export const OverlayContext = React.createContext<OverlayContextProps>(defaultValue);

export const OverlaysProvider: React.FunctionComponent = (props) => {
    const [confirmProps, setConfirmProps] = useState(defaultConfirmProps);

    return (
        <OverlayContext.Provider
            value={{ confirmProps, setConfirmProps }}>
            <OverlayConfirm />
            { props.children }
        </OverlayContext.Provider>
    );
};
