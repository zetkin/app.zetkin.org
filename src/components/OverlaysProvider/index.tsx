/* eslint-disable @typescript-eslint/no-empty-function */
import OverlayConfirm, { ConfirmProps, defaultConfirmProps } from './OverlayConfirm';
import React, { useState } from 'react';

interface OverlayContextProps {
    setConfirmProps: (newProps: ConfirmProps) => void;
}

const defaultValue = {
    setConfirmProps: () => null,
};

export const OverlayContext = React.createContext<OverlayContextProps>(defaultValue);

export const OverlaysProvider: React.FunctionComponent = (props) => {
    const [confirmProps, setConfirmProps] = useState(defaultConfirmProps);

    return (
        <OverlayContext.Provider
            value={{ setConfirmProps }}>
            <OverlayConfirm { ...confirmProps } />
            { props.children }
        </OverlayContext.Provider>
    );
};
