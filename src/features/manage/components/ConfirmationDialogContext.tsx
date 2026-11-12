'use client';

import {
  createContext,
  Dispatch,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Box } from '@mui/material';

import ZUIModal from 'zui/components/ZUIModal';
import ZUIButton from 'zui/components/ZUIButton';
import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

export type ConfirmationDialogProps = {
  content?: (props: {
    setSubmitDisabled: Dispatch<SetStateAction<boolean>>;
    submitDisabled: boolean;
  }) => ReactNode;
  errorMessage: string;
  submit: () => Promise<unknown>;
  successMessage: string;
  title: string;
  type: 'save' | 'send';
};

export const ConfirmationDialogContext = createContext({
  openConfirmationDialog: (() => {}) as (
    props: ConfirmationDialogProps
  ) => void,
});

export const ConfirmationDialogProvider = ({ children }: PropsWithChildren) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const [confirmationDialogProps, setConfirmationDialogProps] =
    useState<ConfirmationDialogProps | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const confirmationDialogCtx = useMemo(
    () => ({
      openConfirmationDialog: (props: ConfirmationDialogProps) => {
        setSubmitDisabled(false);
        setConfirmationDialogProps(props);
      },
    }),
    []
  );

  const onConfirmClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();

      try {
        setSubmitting(true);
        await confirmationDialogProps?.submit();
        showSnackbar('success', confirmationDialogProps?.successMessage);
      } catch (err) {
        showSnackbar('error', confirmationDialogProps?.errorMessage);
      }

      setConfirmationDialogProps(null);
      setSubmitting(false);
    },
    [confirmationDialogProps, showSnackbar]
  );

  return (
    <ConfirmationDialogContext.Provider value={confirmationDialogCtx}>
      <ZUIModal
        keepMounted={true}
        onClose={() => {
          setConfirmationDialogProps(null);
        }}
        open={!!confirmationDialogProps}
        size={'medium'}
        title={confirmationDialogProps?.title || ''}
      >
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap="1rem"
          pt="1rem"
          width="100%"
        >
          {confirmationDialogProps?.content?.({
            setSubmitDisabled,
            submitDisabled,
          })}

          <Box
            display="flex"
            flexDirection="row"
            gap="0.5rem"
            justifyContent="flex-end"
          >
            <ZUIButton
              label={messages.dialog.cancel()}
              onClick={() => {
                setConfirmationDialogProps(null);
              }}
              variant="secondary"
            />
            <ZUIButton
              actionType="submit"
              disabled={submitDisabled}
              isLoading={submitting}
              label={
                confirmationDialogProps?.type === 'send'
                  ? messages.dialog.send()
                  : messages.dialog.save()
              }
              onClick={onConfirmClick}
              variant="primary"
            />
          </Box>
        </Box>
      </ZUIModal>
      {children}
    </ConfirmationDialogContext.Provider>
  );
};
