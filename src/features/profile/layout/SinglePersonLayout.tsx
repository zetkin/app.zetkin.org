import { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useNumericRouteParams } from 'core/hooks';
import usePerson from '../hooks/usePerson';
import { Msg, useMessages } from 'core/i18n';

interface SinglePersonLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const SinglePersonLayout: FunctionComponent<SinglePersonLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, personId } = useNumericRouteParams();
  const { data: person } = usePerson(orgId, personId);

  if (!person) {
    return null;
  }

  return (
    <TabbedLayout
      avatar={`/api/orgs/${orgId}/people/${personId}/avatar`}
      baseHref={`/organize/${orgId}/people/${personId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      tabs={[
        { href: `/`, label: messages.tabs.profile() },
        {
          href: `/timeline`,
          label: messages.tabs.timeline(),
          tabProps: { disabled: true },
        },
        {
          href: `/manage`,
          label: messages.tabs.manage(),
        },
      ]}
      title={
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Box>
            <Typography variant="h3">
              {`${person?.first_name} ${person?.last_name}`}
            </Typography>
            {person?.ext_id && (
              <Typography
                color="secondary"
                variant="h3"
              >{`\u00A0#${person?.ext_id}`}</Typography>
            )}
          </Box>
          <Typography color="secondary" variant="body2">
            <Msg
              id={
                person?.is_user
                  ? messageIds.user.hasAccount
                  : messageIds.user.noAccount
              }
            />
          </Typography>
        </Box>
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default SinglePersonLayout;
