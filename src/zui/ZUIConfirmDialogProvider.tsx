/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useState } from 'react';
import ZUIConfirmDialog, { ZUIConfirmDialogProps } from 'zui/ZUIConfirmDialog';

export const ZUIConfirmDialogContext = React.createContext<{
  showConfirmDialog: (newProps: Partial<ZUIConfirmDialogProps>) => void;
}>({
  showConfirmDialog: () => null,
});

const defaultConfirmDialogProps = {
  onCancel: (): void => {},
  onSubmit: (): void => {},
  open: false,
  title: '',
  warningText: '',
};

function ConfirmDialog(props: ZUIConfirmDialogProps): JSX.Element {
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const clear = () => {
    const { title, warningText } = props;
    showConfirmDialog({ ...defaultConfirmDialogProps, title, warningText });
  };

  return (
    <ZUIConfirmDialog
      {...{
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
      }}
    />
  );
}

interface ZUIConfirmDialogProviderProps {
  children: React.ReactNode;
}

export const ZUIConfirmDialogProvider: React.FunctionComponent<
  ZUIConfirmDialogProviderProps
> = (props) => {
  const [confirmDialogProps, setConfirmDialogProps] = useState<
    Partial<ZUIConfirmDialogProps>
  >(defaultConfirmDialogProps);
  const showConfirmDialog = (newProps: Partial<ZUIConfirmDialogProps>) => {
    setConfirmDialogProps({ open: true, ...newProps });
  };

  return (
    <ZUIConfirmDialogContext.Provider value={{ showConfirmDialog }}>
      <ConfirmDialog
        {...{ ...defaultConfirmDialogProps, ...confirmDialogProps }}
      />
      {props.children}
    </ZUIConfirmDialogContext.Provider>
  );
};
