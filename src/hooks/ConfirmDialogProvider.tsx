/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useState } from 'react';
import ZetkinConfirmDialog, { ZetkinConfirmDialogProps } from 'components/ZetkinConfirmDialog';

export const ConfirmDialogContext = React.createContext<{
    showConfirmDialog: (newProps: Partial<ZetkinConfirmDialogProps> ) => void;
        }>({
            showConfirmDialog: () => null,
        });

const defaultConfirmDialogProps = {
    onCancel: (): void => {}, onSubmit: (): void => {}, open: false, title: '', warningText: '',
};

function ConfirmDialog(props: ZetkinConfirmDialogProps): JSX.Element {
    const { showConfirmDialog } = useContext(ConfirmDialogContext);

    const clear = () => {
        const { title, warningText } = props;
        showConfirmDialog({ ...defaultConfirmDialogProps, title, warningText });
    };

    return (
        <ZetkinConfirmDialog { ...{
            ...props,
            ...{
                onCancel: () => {
                    props.onCancel();
                    clear();
                },
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
    const [confirmDialogProps, setConfirmDialogProps] = useState<Partial<ZetkinConfirmDialogProps>>(defaultConfirmDialogProps);
    const showConfirmDialog = (newProps: Partial<ZetkinConfirmDialogProps>) => {
        setConfirmDialogProps({ open: true, ...newProps });
    };

    return (
        <ConfirmDialogContext.Provider
            value={{ showConfirmDialog }}>
            <ConfirmDialog { ...{ ...defaultConfirmDialogProps, ...confirmDialogProps } } />
            { props.children }
        </ConfirmDialogContext.Provider>
    );
};
