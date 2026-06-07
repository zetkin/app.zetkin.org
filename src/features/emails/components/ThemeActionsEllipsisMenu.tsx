import React, { useState } from 'react';
import { ContentCopy, Delete } from '@mui/icons-material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ZUIConfirmDialog from 'zui/ZUIConfirmDialog';

enum THEME_ACTIONS_MENU_ITEMS {
  DUPLICATE_THEME = 'duplicateTheme',
  DELETE_THEME = 'deleteTheme',
}

interface ThemeActionsEllipsisMenuProps {
  orgId: number;
  themeId: number;
}

const ThemeActionsEllipsisMenu: React.FC<ThemeActionsEllipsisMenuProps> = (
  props
) => {
  const messages = useMessages(messageIds);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { deleteEmailTheme, duplicateEmailTheme } = useEmailTheme(
    props.orgId,
    props.themeId
  );

  return (
    <>
      <ZUIEllipsisMenu
        items={[
          {
            id: THEME_ACTIONS_MENU_ITEMS.DUPLICATE_THEME,
            label: (
              <>
                <ContentCopy />
                <Msg id={messageIds.themes.themeCard.duplicate} />
              </>
            ),
            onSelect: () => duplicateEmailTheme(),
          },
          {
            id: THEME_ACTIONS_MENU_ITEMS.DELETE_THEME,
            label: (
              <>
                <Delete />
                <Msg id={messageIds.themes.themeCard.delete} />
              </>
            ),
            onSelect: () => setConfirmOpen(true),
          },
        ]}
      />
      <ZUIConfirmDialog
        onCancel={() => setConfirmOpen(false)}
        onSubmit={() => {
          deleteEmailTheme(props.themeId);
          setConfirmOpen(false);
        }}
        open={confirmOpen}
        warningText={messages.themes.themeCard.deleteWarning({
          themeId: props.themeId,
        })}
      />
    </>
  );
};

export default ThemeActionsEllipsisMenu;
