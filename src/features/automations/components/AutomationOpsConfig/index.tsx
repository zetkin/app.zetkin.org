import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { ZetkinBulkAutomation } from '../../types/api';
import ZUICard from 'zui/ZUICard';
import { useMessages } from 'core/i18n';
import messageIds from '../../l10n/messageIds';
import AutomationOpSelect from '../AutomationOpSelect';
import OpConfigRow from './OpConfigRow';
import { AnyPendingSubOp } from './types';
import useAutomationMutations from 'features/automations/hooks/useAutomationMutations';
import { BulkSubOp } from 'features/import/types';

type Props = {
  automation: ZetkinBulkAutomation;
};

function makePending<SubOp extends BulkSubOp>(op: SubOp): AnyPendingSubOp {
  return {
    config: op,
    opType: op.op,
  } as AnyPendingSubOp;
}

const AutomationOpsConfig: FC<Props> = ({ automation }) => {
  const messages = useMessages(messageIds);
  const [pendingOps, setPendingOps] = useState<AnyPendingSubOp[]>([]);
  const { updateAutomation } = useAutomationMutations(
    automation.organization_id,
    automation.id
  );

  useEffect(() => {
    const x: AnyPendingSubOp[] = [];
    automation.bulk_ops.forEach((op) => {
      const y = makePending(op);
      x.push(y);
    });
    setPendingOps(x);
  }, [automation.bulk_ops]);

  return (
    <ZUICard header={messages.opConfig.header()} sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {pendingOps.map((op, index) => {
          return (
            <OpConfigRow
              key={index}
              onChange={(newOp) => {
                const newPendingOps = pendingOps.map((oldOp, oldIndex) =>
                  oldIndex == index ? newOp : oldOp
                );

                setPendingOps(newPendingOps);

                const outputOps: BulkSubOp[] = [];
                newPendingOps.forEach((op) => {
                  if (op.config) {
                    outputOps.push(op.config);
                  }
                });

                updateAutomation({ bulk_ops: outputOps });
              }}
              onDelete={() => {
                const newPendingOps = [
                  ...pendingOps.slice(0, index),
                  ...pendingOps.slice(index + 1),
                ];
                setPendingOps(newPendingOps);

                const outputOps: BulkSubOp[] = [];
                newPendingOps.forEach((op) => {
                  if (op.config) {
                    outputOps.push(op.config);
                  }
                });

                updateAutomation({ bulk_ops: outputOps });
              }}
              pendingOp={op}
            />
          );
        })}
        <Box sx={{ maxWidth: 300 }}>
          <AutomationOpSelect
            onChange={(newValue) => {
              setPendingOps([
                ...pendingOps,
                { config: null, opType: newValue },
              ]);
            }}
            value={null}
          />
        </Box>
      </Box>
    </ZUICard>
  );
};

export default AutomationOpsConfig;
