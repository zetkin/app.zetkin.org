import {
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { FormattedDate } from 'react-intl';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { z } from 'zod';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ApiClientError } from 'core/api/errors';
import EmailLayout from 'features/emails/layout/EmailLayout';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonLink from 'zui/ZUIPersonLink';

const routeParamsSchema = z.object({
  emailId: z.coerce.number().int().positive(),
  orgId: z.coerce.number().int().positive(),
});

const emailBounceSchema = z.object({
  delivery_id: z.number().int().positive(),
  email_address: z.string(),
  id: z.number().int().positive(),
  person: z.object({
    first_name: z.string(),
    id: z.number().int().positive(),
    last_name: z.string(),
  }),
  reason: z.enum(['hard_bounce', 'soft_bounce']),
  timestamp: z.string().datetime({ offset: true }),
});

const emailSchema = z.object({
  organization: z.object({ title: z.string() }),
  title: z.string(),
});

type EmailBounce = z.infer<typeof emailBounceSchema>;

interface DeliveryLogProps {
  bounces: EmailBounce[];
  channel: string;
  emailTitle: string;
  orgId: number;
}

async function loadDeliveryLog(
  apiClient: BackendApiClient,
  { orgId, emailId }: z.infer<typeof routeParamsSchema>
): Promise<DeliveryLogProps> {
  const emailPath = `/api/orgs/${orgId}/emails/${emailId}`;
  const [emailResponse, bounceResponse] = await Promise.all([
    apiClient.get<unknown>(emailPath),
    apiClient.get<unknown>(`${emailPath}/bounces`),
  ]);
  const email = emailSchema.parse(emailResponse);

  return {
    bounces: emailBounceSchema.array().parse(bounceResponse),
    channel: email.organization.title,
    emailTitle: email.title,
    orgId,
  };
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

const DeliveryLogRow = ({
  bounce,
  channel,
  orgId,
}: Pick<DeliveryLogProps, 'channel' | 'orgId'> & { bounce: EmailBounce }) => (
  <TableRow sx={{ '& td': { py: 2 } }}>
    <TableCell>
      <ZUIPersonAvatar orgId={orgId} personId={bounce.person.id} />
    </TableCell>
    <TableCell>
      <ZUIPersonLink person={bounce.person} />
    </TableCell>
    <TableCell>{bounce.email_address}</TableCell>
    <TableCell sx={{ whiteSpace: 'nowrap' }}>
      <time dateTime={bounce.timestamp}>
        <FormattedDate
          day="numeric"
          hour="numeric"
          minute="2-digit"
          month="short"
          value={bounce.timestamp}
          year="numeric"
        />
      </time>
    </TableCell>
    <TableCell sx={{ whiteSpace: 'nowrap' }}>
      <Msg id={messageIds.deliveryLog.status[bounce.reason]} />
    </TableCell>
    <TableCell>{channel}</TableCell>
  </TableRow>
);

const DeliveryLogTable = ({
  bounces,
  channel,
  orgId,
}: Omit<DeliveryLogProps, 'emailTitle'>) => {
  const messages = useMessages(messageIds);
  const columns = messages.deliveryLog.columns;

  return (
    <TableContainer sx={{ bgcolor: 'background.paper' }}>
      <Table aria-label={messages.tabs.deliveryLog()} sx={{ minWidth: 1000 }}>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <TableRow>
            {[
              columns.avatar(),
              columns.person(),
              columns.emailAddress(),
              columns.datetime(),
              columns.status(),
              columns.channel(),
            ].map((heading) => (
              <TableCell key={heading} sx={{ fontWeight: 600, py: 2.5 }}>
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bounces.map((bounce) => (
            <DeliveryLogRow
              key={`${bounce.id}-${bounce.delivery_id}`}
              bounce={bounce}
              channel={channel}
              orgId={orgId}
            />
          ))}
          {!bounces.length && (
            <TableRow>
              <TableCell colSpan={6} sx={{ py: 5, textAlign: 'center' }}>
                <Msg id={messageIds.deliveryLog.empty} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const EmailDeliveryLogPage: PageWithLayout<DeliveryLogProps> = ({
  emailTitle,
  ...deliveryLog
}) => (
  <>
    <Head>
      <title>{emailTitle}</title>
    </Head>
    <Alert
      severity="info"
      sx={(theme) => ({
        bgcolor: blue[theme.palette.mode === 'dark' ? 900 : 50],
        borderRadius: 0,
        color: blue[theme.palette.mode === 'dark' ? 100 : 900],
        fontSize: '1rem',
        fontWeight: 600,
        px: 3,
        py: 1.5,
      })}
    >
      <Msg id={messageIds.deliveryLog.failedOnly} />
    </Alert>
    <DeliveryLogTable {...deliveryLog} />
  </>
);

EmailDeliveryLogPage.getLayout = (page) => (
  <EmailLayout noPad requireTheme={false}>
    {page}
  </EmailLayout>
);

export default EmailDeliveryLogPage;
