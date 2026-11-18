import { Alert, Box, Button, Tooltip, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { blue } from '@mui/material/colors';
import { FormattedDate } from 'react-intl';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { z } from 'zod';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ApiClientError } from 'core/api/errors';
import EmailLayout from 'features/emails/layout/EmailLayout';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIPersonLink from 'zui/ZUIPersonLink';

const routeParamsSchema = z.object({
  emailId: z.coerce.number().int().positive(),
  orgId: z.coerce.number().int().positive(),
});

const timestampSchema = z.string().datetime({ offset: true });
const emailRecipientSchema = z.object({
  delivered: timestampSchema.nullable(),
  email_address: z.string().nullable(),
  error: z.string().nullable(),
  id: z.number().int().positive(),
  opened: timestampSchema.nullable(),
  person: z.object({
    first_name: z.string(),
    id: z.number().int().positive(),
    last_name: z.string(),
  }),
  sent: timestampSchema.nullable(),
  status: z.enum([
    'pending',
    'sent',
    'delivered',
    'opened',
    'failed',
    'bounced',
  ]),
});

const emailSchema = z.object({
  title: z.string(),
});

type EmailRecipient = z.infer<typeof emailRecipientSchema>;
type DeliveryLogEntry = EmailRecipient & { timestamp: string | null };

interface DeliveryLogProps {
  emailTitle: string;
  orgId: number;
  recipients: DeliveryLogEntry[];
}

async function loadDeliveryLog(
  apiClient: BackendApiClient,
  { orgId, emailId }: z.infer<typeof routeParamsSchema>
): Promise<DeliveryLogProps> {
  const emailPath = `/api/orgs/${orgId}/emails/${emailId}`;
  const [emailResponse, recipientResponse] = await Promise.all([
    apiClient.get<unknown>(emailPath),
    apiClient.get<unknown>(`${emailPath}/recipients`),
  ]);
  const email = emailSchema.parse(emailResponse);

  return {
    emailTitle: email.title,
    orgId,
    recipients: emailRecipientSchema
      .array()
      .parse(recipientResponse)
      .map((recipient) => ({ ...recipient, ...getDeliveryStatus(recipient) })),
  };
}

function getDeliveryStatus(
  recipient: EmailRecipient
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
  async (ctx) => {
    const routeParams = routeParamsSchema.safeParse(ctx.params);
    if (!routeParams.success) {
      return { notFound: true };
    }

    try {
      const apiClient = new BackendApiClient(ctx.req.headers);
      return { props: await loadDeliveryLog(apiClient, routeParams.data) };
    } catch (error) {
      if (
        error instanceof ApiClientError &&
        [403, 404].includes(error.status)
      ) {
        return { notFound: true };
      }
      throw error;
    }
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.email', 'pages.organizeEmail'],
  }
);

const DeliveryLogTable = ({
  recipients,
  orgId,
}: Omit<DeliveryLogProps, 'emailTitle'>) => {
  const messages = useMessages(messageIds);
  const columns: GridColDef<DeliveryLogEntry>[] = [
    {
      disableColumnMenu: true,
      disableExport: true,
      field: 'avatar',
      filterable: false,
      headerName: '',
      maxWidth: 64,
      minWidth: 64,
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
      renderCell: ({ row }) => <ZUIPersonLink person={row.person} />,
      valueGetter: (_, row) =>
        `${row.person.first_name} ${row.person.last_name}`,
    },
    {
      field: 'email_address',
      flex: 1.5,
      headerName: messages.deliveryLog.columns.emailAddress(),
      minWidth: 240,
      valueGetter: (_, row) => row.email_address ?? '—',
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
      valueGetter: (_, row) => row.error ?? '—',
    },
  ];

  return (
    <DataGridPro
      aria-label={messages.tabs.deliveryLog()}
      columns={columns}
      disableRowSelectionOnClick
      hideFooter
      initialState={{
        sorting: { sortModel: [{ field: 'timestamp', sort: 'desc' }] },
      }}
      localeText={{ noRowsLabel: messages.deliveryLog.empty() }}
      rowHeight={64}
      rows={recipients}
      sx={{ bgcolor: 'background.paper', border: 0, borderRadius: 0 }}
    />
  );
};

const EmailDeliveryLogPage: PageWithLayout<DeliveryLogProps> = ({
  emailTitle,
  ...deliveryLog
}) => (
  <Box display="flex" flexDirection="column" height={1}>
    <Head>
      <title>{emailTitle}</title>
    </Head>
    <Alert
      action={
        <Tooltip
          arrow
          describeChild
          title={
            <Box>
              <Typography variant="body2">
                <Msg
                  id={messageIds.deliveryLog.bounceExplanation.hard_bounce}
                />
              </Typography>
              <Typography sx={{ mt: 1 }} variant="body2">
                <Msg
                  id={messageIds.deliveryLog.bounceExplanation.soft_bounce}
                />
              </Typography>
            </Box>
          }
        >
          <Button color="inherit" size="small">
            <Msg id={messageIds.deliveryLog.aboutBounces} />
          </Button>
        </Tooltip>
      }
      severity="info"
      sx={(theme) => ({
        bgcolor: blue[theme.palette.mode === 'dark' ? 900 : 50],
        borderRadius: 0,
        color: blue[theme.palette.mode === 'dark' ? 100 : 900],
        flexShrink: 0,
        fontSize: '1rem',
        fontWeight: 600,
        px: 3,
        py: 1.5,
      })}
    >
      <Msg id={messageIds.deliveryLog.info} />
    </Alert>
    <DeliveryLogTable {...deliveryLog} />
  </Box>
);

EmailDeliveryLogPage.getLayout = (page) => (
  <EmailLayout fixedHeight noPad requireTheme={false}>
    {page}
  </EmailLayout>
);

export default EmailDeliveryLogPage;
