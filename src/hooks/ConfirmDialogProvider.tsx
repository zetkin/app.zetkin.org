/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useState } from 'react';
import ZetkinConfirmDialog, { ZetkinConfirmDialogProps } from 'components/ZetkinConfirmDialog';

export const ConfirmDialogContext = React.createContext<{
    setConfirmDialogProps: ( newProps: ZetkinConfirmDialogProps ) => void;
        }>({
            setConfirmDialogProps: () => null,
        });

const defaultConfirmDialogProps = {
    onCancel: (): void => {}, onSubmit: (): void => {}, open: false, title: '', warningText: '',
};

function ConfirmDialog(props: ZetkinConfirmDialogProps): JSX.Element {
    const overlay = useContext(ConfirmDialogContext);

    const clear = () => {
        overlay.setConfirmDialogProps(defaultConfirmDialogProps);
    };

    return (
        <ZetkinConfirmDialog { ...{
            ...props,
            ...{
                onCancel: clear,
                onSubmit: () => {
                    props.onSubmit();
                    clear();
                },
            },
        } }
        />
    );
}

export const ConfirmDialogProvider: React.FunctionComponent = (props) => {
    const [confirmDialogProps, setConfirmDialogProps] = useState<ZetkinConfirmDialogProps>(defaultConfirmDialogProps);

    return (
        <ConfirmDialogContext.Provider
            value={{ setConfirmDialogProps }}>
            <ConfirmDialog { ...confirmDialogProps } />
            { props.children }
        </ConfirmDialogContext.Provider>
    );
};
