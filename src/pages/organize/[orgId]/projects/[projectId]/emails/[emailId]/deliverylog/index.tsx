import { Box, Tooltip } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { FormattedDate } from 'react-intl';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';

import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailRecipients from 'features/emails/hooks/useEmailRecipients';
import EmailLayout from 'features/emails/layout/EmailLayout';
import messageIds from 'features/emails/l10n/messageIds';
import { DeliveryLogRecipient } from 'features/emails/types';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

type DeliveryLogEntry = DeliveryLogRecipient & { timestamp: string | null };

function getDeliveryStatus(
  recipient: DeliveryLogRecipient
): Pick<DeliveryLogEntry, 'status' | 'timestamp'> {
  if (recipient.status === 'bounced' || recipient.status === 'failed') {
    return { status: recipient.status, timestamp: recipient.sent };
  }
  if (recipient.error) {
    return { status: 'failed', timestamp: recipient.sent };
  }
  if (recipient.opened) {
    return { status: 'opened', timestamp: recipient.opened };
  }
  if (recipient.delivered) {
    return { status: 'delivered', timestamp: recipient.delivered };
  }
  return { status: recipient.status, timestamp: recipient.sent };
}

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => ({ props: {} }),
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.email', 'pages.organizeEmail'],
  }
);

const EmailDeliveryLogPage: PageWithLayout = () => {
  const { orgId, emailId } = useNumericRouteParams();
  const { data: email } = useEmail(orgId, emailId);
  const recipientsFuture = useEmailRecipients(orgId, emailId);
  const messages = useMessages(messageIds);
  const recipients = (recipientsFuture.data || []).map((recipient) => ({
    ...recipient,
    ...getDeliveryStatus(recipient),
  }));

  if (recipientsFuture.error) {
    throw recipientsFuture.error;
  }

  const columns: GridColDef<DeliveryLogEntry>[] = [
    {
      disableColumnMenu: true,
      field: 'avatar',
      filterable: false,
      headerName: '',
      renderCell: ({ hasFocus, row }) => (
        <ZUIPersonHoverCard personId={row.person.id}>
          <NextLink
            aria-label={`${row.person.first_name} ${row.person.last_name}`}
            href={`/organize/${orgId}/people/${row.person.id}`}
            tabIndex={hasFocus ? 0 : -1}
          >
            <ZUIPersonAvatar orgId={orgId} personId={row.person.id} />
          </NextLink>
        </ZUIPersonHoverCard>
      ),
      resizable: false,
      sortable: false,
      width: 64,
    },
    {
      field: 'person',
      flex: 1,
      headerName: messages.deliveryLog.columns.person(),
      minWidth: 180,
      renderCell: ({ row }) =>
        `${row.person.first_name} ${row.person.last_name}`,
      valueGetter: (_, row) =>
        `${row.person.first_name} ${row.person.last_name}`,
    },
    {
      field: 'email_address',
      flex: 1.5,
      headerName: messages.deliveryLog.columns.emailAddress(),
      minWidth: 240,
      renderCell: ({ row }) => row.email_address || '—',
      valueGetter: (_, row) => row.email_address || '—',
    },
    {
      field: 'timestamp',
      headerName: messages.deliveryLog.columns.datetime(),
      minWidth: 220,
      renderCell: ({ row }) =>
        row.timestamp ? (
          <time dateTime={row.timestamp}>
            <FormattedDate
              day="numeric"
              hour="numeric"
              minute="2-digit"
              month="short"
              value={row.timestamp}
              year="numeric"
            />
          </time>
        ) : (
          '—'
        ),
      type: 'dateTime',
      valueGetter: (_, row) =>
        row.timestamp ? new Date(row.timestamp) : undefined,
    },
    {
      field: 'status',
      flex: 1,
      headerName: messages.deliveryLog.columns.status(),
      minWidth: 160,
      valueGetter: (_, row) => messages.deliveryLog.status[row.status](),
    },
    {
      field: 'error',
      flex: 1.5,
      headerName: messages.deliveryLog.columns.error(),
      minWidth: 240,
      renderCell: ({ hasFocus, row }) =>
        row.error ? (
          <Tooltip arrow describeChild title={row.error}>
            <Box
              component="span"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              tabIndex={hasFocus ? 0 : -1}
            >
              {row.error}
            </Box>
          </Tooltip>
        ) : (
          '—'
        ),
      valueGetter: (_, row) => row.error || '—',
    },
  ];

  return (
    <Box display="flex" flexDirection="column" height={1}>
      <Head>
        <title>{email?.title || messages.tabs.deliveryLog()}</title>
      </Head>
      <DataGridPro
        aria-label={messages.tabs.deliveryLog()}
        columns={columns}
        disableColumnPinning
        disableColumnReorder
        disableColumnSelector
        disableRowSelectionOnClick
        hideFooter
        initialState={{
          sorting: { sortModel: [{ field: 'timestamp', sort: 'desc' }] },
        }}
        loading={recipientsFuture.isLoading}
        localeText={{ noRowsLabel: messages.deliveryLog.empty() }}
        rowHeight={64}
        rows={recipients}
        sx={{ bgcolor: 'background.paper', border: 0, borderRadius: 0 }}
      />
    </Box>
  );
};

EmailDeliveryLogPage.getLayout = (page) => (
  <EmailLayout fixedHeight noPad>
    {page}
  </EmailLayout>
);

export default EmailDeliveryLogPage;
