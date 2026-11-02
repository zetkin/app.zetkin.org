import {
  CallMissedOutgoing,
  Check,
  Notifications,
  VolumeOff,
} from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { FC } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import { ChannelSubscriptionViewColumn, ZetkinViewRow } from '../../types';
import { MUIIcon } from 'zui/components/types';
import messageIds from 'features/views/l10n/messageIds';
import newTheme from 'zui/theme';
import { useMessages } from 'core/i18n';

type ChannelSubscriptionStatus =
  | 'received'
  | 'subscribed'
  | 'muted'
  | 'soft_bounce'
  | 'hard_bounce'
  | 'org_muted';

type ChannelSubscriptionViewCell = null | {
  status: ChannelSubscriptionStatus;
};

const { swatches } = newTheme.palette;

const statusConfig: Record<
  ChannelSubscriptionStatus,
  {
    background?: string;
    color: string;
    icon: MUIIcon;
    messageKey: keyof typeof messageIds.cells.channelSubscription;
  }
> = {
  hard_bounce: {
    background: swatches.red[400],
    color: swatches.red[900],
    icon: CallMissedOutgoing,
    messageKey: 'hardBounce',
  },
  muted: {
    background: swatches.yellow[200],
    color: swatches.yellow[900],
    icon: VolumeOff,
    messageKey: 'muted',
  },
  org_muted: {
    background: swatches.red[400],
    color: swatches.red[900],
    icon: VolumeOff,
    messageKey: 'orgMuted',
  },
  received: {
    color: swatches.grey[700],
    icon: Check,
    messageKey: 'received',
  },
  soft_bounce: {
    background: swatches.yellow[200],
    color: swatches.yellow[900],
    icon: CallMissedOutgoing,
    messageKey: 'softBounce',
  },
  subscribed: {
    background: swatches.green[400],
    color: swatches.green[900],
    icon: Notifications,
    messageKey: 'subscribed',
  },
};

const statusOrder: (ChannelSubscriptionStatus | null)[] = [
  null,
  'received',
  'subscribed',
  'muted',
  'soft_bounce',
  'hard_bounce',
  'org_muted',
];

export default class ChannelSubscriptionColumnType implements IColumnType<
  ChannelSubscriptionViewColumn,
  ChannelSubscriptionViewCell
> {
  cellToString(cell: ChannelSubscriptionViewCell): string {
    return cell?.status ?? '';
  }

  getColDef(): Omit<GridColDef<ZetkinViewRow>, 'field'> {
    return {
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return <Cell cell={params.row[params.field]} />;
      },
      type: 'number',
      valueGetter: (cell: ChannelSubscriptionViewCell) =>
        statusOrder.indexOf(cell?.status ?? null),
    };
  }

  getSearchableStrings(): string[] {
    return [];
  }
}

const Cell: FC<{ cell: ChannelSubscriptionViewCell | undefined }> = ({
  cell,
}) => {
  const messages = useMessages(messageIds);

  if (!cell) {
    return null;
  }

  const {
    background,
    color,
    icon: Icon,
    messageKey,
  } = statusConfig[cell.status];

  return (
    <Tooltip title={messages.cells.channelSubscription[messageKey]()}>
      <Box
        alignItems="center"
        display="flex"
        height="100%"
        justifyContent="center"
        sx={{
          backgroundColor: background,
          marginX: '-10px',
          width: 'calc(100% + 20px)',
        }}
      >
        <Icon sx={{ color }} />
      </Box>
    </Tooltip>
  );
};
