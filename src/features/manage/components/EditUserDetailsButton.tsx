'use client';

import { Box } from '@mui/material';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
  MouseEvent,
} from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinUser } from 'utils/types/zetkin';
import ZUIModal from 'zui/components/ZUIModal';
import ZUISwitch from 'zui/components/ZUISwitch';
import ZUITextField from 'zui/components/ZUITextField';
import ZUISelect from 'zui/components/ZUISelect';
import { SupportedLanguage } from 'core/i18n/languages';
import {
  detailsCheckboxesKeys,
  detailsFieldKeys,
} from 'features/manage/utils/fieldKeys';
import useUserActions from 'features/manage/hooks/useUserActions';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

export const languageOptions: Record<SupportedLanguage, string> = {
  da: 'Dansk',
  de: 'Deutsch',
  en: 'English',
  nl: 'Nederlands',
  nn: 'Norsk',
  sv: 'Svenska',
};

const EditDetailsButton = ({ user }: { user: ZetkinUser }) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const { updateUser } = useUserActions(user.id);

  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [userUpdating, setUserUpdating] = useState(false);

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const onClickUpdateUser = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();

      const diffUser: Partial<ZetkinUser> = {};

      const copyIfChanged = <K extends keyof ZetkinUser>(key: K) => {
        if (user[key] !== editedUser[key]) {
          diffUser[key] = editedUser[key];
        }
      };

      for (const key of Object.keys(editedUser)) {
        copyIfChanged(key as keyof ZetkinUser);
      }

      try {
        if (typeof diffUser.id !== 'undefined') {
          throw new Error('Cannot update id');
        }

        await updateUser(diffUser);
        showSnackbar('success', messages.users.details.edit.updateSuccess());
        setEditDetailsOpen(false);
      } catch (err) {
        showSnackbar('error', messages.users.details.edit.updateError());
      }

      setUserUpdating(false);
    },
    [editedUser, messages.users.details.edit, showSnackbar, updateUser, user]
  );

  return (
    <>
      <ZUIButton
        label={messages.users.details.edit.button()}
        onClick={() => setEditDetailsOpen(true)}
      />

      <ZUIModal
        keepMounted={true}
        onClose={() => setEditDetailsOpen(false)}
        open={editDetailsOpen}
        size={'medium'}
        title={messages.users.details.edit.title()}
      >
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
          <Box
            display="flex"
            flexDirection="row"
            gap="0.5rem"
            justifyContent="flex-end"
          >
            <ZUIButton
              label={messages.users.details.edit.cancel()}
              onClick={() => {
                setEditedUser({ ...user });
                setEditDetailsOpen(false);
              }}
              variant="secondary"
            />
            <ZUIButton
              actionType="submit"
              isLoading={userUpdating}
              label={messages.users.details.edit.save()}
              onClick={onClickUpdateUser}
              variant="primary"
            />
          </Box>
        </Box>
      </ZUIModal>
    </>
  );
};

export default EditDetailsButton;
