import { FC } from 'react';
import { Box, Card, Divider } from '@mui/material';

import JoinFormListItem from './JoinFormListItem';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinJoinForm } from '../types';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUIInlineCopyToClipboard from 'zui/ZUIInlineCopyToClipBoard';

type Props = {
  forms: ZetkinJoinForm[];
  onItemClick: (form: ZetkinJoinForm) => void;
};

const JoinFormList: FC<Props> = ({ forms, onItemClick }) => {
  const messages = useMessages(messageIds);

  return (
    <Box m={2}>
      <Card>
        {forms.map((form, index) => (
          <Box key={form.id}>
            {index > 0 && <Divider />}
            <Box display="flex" justifyContent="space-between">
              <JoinFormListItem form={form} onClick={() => onItemClick(form)} />
              <ZUIEllipsisMenu
                items={[
                  {
                    label: (
                      <ZUIInlineCopyToClipboard
                        alwaysShowIcon
                        clickableChildren
                        copyText={form.submit_token}
                      >
                        {messages.formList.copyToken()}
                      </ZUIInlineCopyToClipboard>
                    ),
                  },
                ]}
              />
            </Box>
          </Box>
        ))}
      </Card>
    </Box>
  );
};

export default JoinFormList;
