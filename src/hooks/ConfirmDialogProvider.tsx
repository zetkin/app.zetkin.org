/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useState } from 'react';
import ZetkinConfirmDialog, { ZetkinConfirmDialogProps } from 'components/ZetkinConfirmDialog';

export const ConfirmDialogContext = React.createContext<{
    showConfirmDialog: (newProps: ZetkinConfirmDialogProps ) => void;
        }>({
            showConfirmDialog: () => null,
        });

const defaultConfirmDialogProps = {
    onCancel: (): void => {}, onSubmit: (): void => {}, open: false, title: '', warningText: '',
};

function ConfirmDialog(props: ZetkinConfirmDialogProps): JSX.Element {
    const overlay = useContext(ConfirmDialogContext);
    const { title, warningText } = props;

    const clear = () => {
        overlay.showConfirmDialog({ ...defaultConfirmDialogProps, title, warningText });
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
            value={{ showConfirmDialog: setConfirmDialogProps }}>
            <ConfirmDialog { ...confirmDialogProps } />
            { props.children }
        </ConfirmDialogContext.Provider>
    );
};
