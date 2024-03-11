import { Box, Typography } from '@mui/material';
import { Msg } from 'core/i18n';
import useOrganization from 'features/organizations/hooks/useOrganization';
import { FC } from 'react';
import messageIds from 'zui/l10n/messageIds';

interface CreatingSummaryProps {
  orgId: number;
}
const CreatingSummary: FC<CreatingSummaryProps> = ({ orgId }) => {
  const org = useOrganization(orgId).data;

  return (
    <Box sx={{ maxWidth: '280px' }}>
      <Msg
        id={messageIds.createPerson.personWillBe}
        values={{
          addedToOrg: (
            <Typography
              sx={{
                fontWeight: 'bold',
                display: 'inline',
              }}
            >
              <Msg id={messageIds.createPerson.addedToOrg} />
            </Typography>
          ),
          orgName: org?.title || '',
        }}
      />
    </Box>
  );
};

export default CreatingSummary;
