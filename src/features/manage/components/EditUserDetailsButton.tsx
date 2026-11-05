'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

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

export const languageOptions: Record<SupportedLanguage, string> = {
  da: 'Dansk',
  de: 'Deutsch',
  en: 'English',
  nl: 'Nederlands',
  nn: 'Norsk',
  sv: 'Svenska',
};

const EditDetailsButton = ({
  updateUser,
  user,
  userUpdating,
}: {
  updateUser: (newUser: ZetkinUser) => Promise<void>;
  user: ZetkinUser;
  userUpdating?: boolean;
}) => {
  const messages = useMessages(messageIds);

  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

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
              onClick={(e) => {
                e.preventDefault();
                updateUser(editedUser).then(() => {
                  setEditDetailsOpen(false);
                });
              }}
              variant="primary"
            />
          </Box>
        </Box>
      </ZUIModal>
    </>
  );
};

export default EditDetailsButton;
