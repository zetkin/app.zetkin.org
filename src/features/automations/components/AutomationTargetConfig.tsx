import { FC, useState } from 'react';
import { Button } from '@mui/material';

import { ZetkinBulkAutomation } from '../types/api';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import useSmartSearchQuery from 'features/smartSearch/hooks/useSmartSearchQuery';
import useSmartSearchQueryMutations from 'features/smartSearch/hooks/useSmartSearchQueryMutations';
import ZUICard from 'zui/ZUICard';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useSmartSearchQueryStats from 'features/smartSearch/hooks/useSmartSearchQueryStats';
import ZUINumberChip from 'zui/ZUINumberChip';
import oldTheme from 'theme';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

type Props = {
  automation: ZetkinBulkAutomation;
};

const AutomationTargetConfig: FC<Props> = ({ automation }) => {
  const messages = useMessages(messageIds);
  const [dialogOpen, setDialogOpen] = useState(false);
  const query = useSmartSearchQuery(
    automation.organization_id,
    automation.query_id
  );
  const stats = useSmartSearchQueryStats(
    automation.organization_id,
    automation.query_id
  );
  const { updateQuery } = useSmartSearchQueryMutations(
    automation.organization_id,
    automation.query_id
  );

  return (
    <>
      <ZUICard
        header={messages.itemPage.targeting.header()}
        status={
          <ZUIAnimatedNumber
            value={stats.stats[stats.stats.length - 1]?.result ?? 0}
          >
            {(animatedValue) => (
              <ZUINumberChip
                color={oldTheme.palette.grey[200]}
                value={animatedValue}
              />
            )}
          </ZUIAnimatedNumber>
        }
        sx={{ width: '100%' }}
      >
        <Button onClick={() => setDialogOpen(true)} variant="outlined">
          <Msg id={messageIds.itemPage.targeting.smartSearchButton} />
        </Button>
      </ZUICard>
      {dialogOpen && query && (
        <SmartSearchDialog
          onDialogClose={() => setDialogOpen(false)}
          onSave={(data) => {
            updateQuery(data);
            setDialogOpen(false);
          }}
          query={query}
        />
      )}
    </>
  );
};

export default AutomationTargetConfig;
