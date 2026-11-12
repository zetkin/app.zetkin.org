'use client';

import { Box } from '@mui/material';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinUser } from 'utils/types/zetkin';
import ZUISwitch from 'zui/components/ZUISwitch';
import ZUITextField from 'zui/components/ZUITextField';
import ZUISelect from 'zui/components/ZUISelect';
import { SupportedLanguage } from 'core/i18n/languages';
import {
  detailsCheckboxesKeys,
  detailsFieldKeys,
} from 'features/manage/utils/fieldKeys';
import useUserActions from 'features/manage/hooks/useUserActions';
import { ConfirmationDialogContext } from 'features/manage/components/ConfirmationDialogContext';

export const languageOptions: Record<SupportedLanguage, string> = {
  da: 'Dansk',
  de: 'Deutsch',
  en: 'English',
  nl: 'Nederlands',
  nn: 'Norsk',
  sv: 'Svenska',
};

const EditDetailsForm = ({
  diffUserRef,
  setSubmitDisabled,
  user,
}: {
  diffUserRef: MutableRefObject<Partial<ZetkinUser> | null>;
  setSubmitDisabled: Dispatch<SetStateAction<boolean>>;
  user: ZetkinUser;
}) => {
  const messages = useMessages(messageIds);
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const diffUser = useMemo(() => {
    const diffUser: Partial<ZetkinUser> = {};

    const copyIfChanged = <K extends keyof ZetkinUser>(key: K) => {
      if (user[key] !== editedUser[key]) {
        diffUser[key] = editedUser[key];
      }
    };

    for (const key of Object.keys(editedUser)) {
      copyIfChanged(key as keyof ZetkinUser);
    }

    return diffUser;
  }, [editedUser, user]);

  useEffect(() => {
    diffUserRef.current = diffUser;
    setSubmitDisabled(Object.keys(diffUser).length === 0);
  }, [diffUser, diffUserRef, setSubmitDisabled]);

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap="1rem"
      width="100%"
    >
      <Box display="flex" flexDirection="row" gap="1rem">
        {detailsCheckboxesKeys.map((key) => (
          <ZUISwitch
            key={key}
            checked={editedUser[key]}
            label={messages.users.details.checkboxes[key]()}
            onChange={(newVal) => {
              setEditedUser((current) => ({ ...current, [key]: newVal }));
            }}
          />
        ))}
      </Box>
      {detailsFieldKeys.map((key) => {
        if (key === 'lang') {
          return (
            <ZUISelect
              key={key}
              items={[
                {
                  label: messages.users.details.autoLanguage(),
                  value: 'auto',
                },
                ...Object.entries(languageOptions).map(([code, label]) => ({
                  label,
                  value: code,
                })),
              ]}
              label={messages.users.details.fields[key]()}
              onChange={(newVal) => {
                setEditedUser((current) => ({
                  ...current,
                  [key]: newVal === 'auto' ? null : newVal,
                }));
              }}
              selectedOption={editedUser[key] || 'auto'}
            />
          );
        }

        return (
          <ZUITextField
            key={key}
            label={messages.users.details.fields[key]()}
            onChange={(newVal) => {
              setEditedUser((current) => ({ ...current, [key]: newVal }));
            }}
            value={editedUser[key] || ''}
          />
        );
      })}
    </Box>
  );
};

const EditDetailsButton = ({ user }: { user: ZetkinUser }) => {
  const messages = useMessages(messageIds);
  const { openConfirmationDialog } = useContext(ConfirmationDialogContext);

  const { updateUser } = useUserActions(user);
  const diffUserRef = useRef<ZetkinUser | null>(null);

  const openEditDialog = useCallback(() => {
    diffUserRef.current = null;
    openConfirmationDialog({
      content: ({ setSubmitDisabled }) => (
        <EditDetailsForm
          diffUserRef={diffUserRef}
          setSubmitDisabled={setSubmitDisabled}
          user={user}
        />
      ),
      errorMessage: messages.users.details.edit.updateError(),
      submit: async () => {
        const diffUser = diffUserRef.current;
        if (!diffUser) {
          throw new Error('Missing diff');
        }

        if (typeof diffUser.id !== 'undefined') {
          throw new Error('Cannot update id');
        }

        if (Object.keys(diffUser).length === 0) {
          throw new Error('Diff is empty');
        }

        await updateUser(diffUser);
      },
      successMessage: messages.users.details.edit.updateSuccess(),
      title: messages.users.details.edit.title(),
      type: 'save',
    });
  }, [messages.users.details.edit, openConfirmationDialog, updateUser, user]);

  return (
    <ZUIButton
      label={messages.users.details.edit.button()}
      onClick={openEditDialog}
    />
  );
};

export default EditDetailsButton;
