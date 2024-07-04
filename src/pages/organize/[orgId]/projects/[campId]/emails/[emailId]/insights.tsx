import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  Link,
  Paper,
  Table,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { Box, useTheme } from '@mui/system';
import { ResponsiveLine } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import { FormattedTime } from 'react-intl';
import { OpenInNew } from '@mui/icons-material';
import DOMPurify from 'dompurify';
import { useState } from 'react';

import EmailLayout from 'features/emails/layout/EmailLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailStats from 'features/emails/hooks/useEmailStats';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import ZUICard from 'zui/ZUICard';
import ZUINumberChip from 'zui/ZUINumberChip';
import EmailKPIChart from 'features/emails/components/EmailKPIChart';
import useEmailInsights from 'features/emails/hooks/useEmailInsights';
import ZUIFuture from 'zui/ZUIFuture';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import EmailMiniature from 'features/emails/components/EmailMiniature';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.email', 'pages.organizeEmail'],
  }
);

const EmailPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const { orgId, emailId } = useNumericRouteParams();
  const theme = useTheme();
  const { data: email } = useEmail(orgId, emailId);
  const stats = useEmailStats(orgId, emailId);
  const insightsFuture = useEmailInsights(orgId, emailId);
  const [selectedLinkTag, setSelectedLinkTag] = useState<string | null>(null);

  const onServer = useServerSide();

  if (onServer || !email) {
    return null;
  }

  const sanitizer = DOMPurify();

  return (
    <>
      <Head>
        <title>{email.title}</title>
      </Head>
      <ZUICard
        header={messages.insights.opened.header()}
        status={
          <ZUINumberChip
            color={theme.palette.grey[200]}
            value={stats.numOpened}
          />
        }
        sx={{ mb: 2 }}
      >
        <Box display="flex" gap={2}>
          <Box flexGrow={0} maxWidth={300}>
            <EmailKPIChart
              email={email}
              title={messages.insights.opened.gauge.header()}
              total={stats.numSent}
              value={stats.numOpened}
            />
            <Typography mb={2} mt={1} variant="body2">
              {messages.insights.opened.description()}
            </Typography>
          </Box>
          <Box flexGrow={1} height={550}>
            <ZUIFuture future={insightsFuture}>
              {(insights) => (
                <ResponsiveLine
                  animate={false}
                  axisBottom={{
                    format: '%b %d',
                  }}
                  colors={[theme.palette.primary.main]}
                  curve="basis"
                  data={[
                    {
                      data: insights.opensByDate.map((openEvent) => ({
                        x: new Date(openEvent.date),
                        y: openEvent.accumulatedOpens,
                      })),
                      id: email.title || '',
                    },
                  ]}
                  defs={[
                    linearGradientDef('gradientA', [
                      { color: 'inherit', offset: 0 },
                      { color: 'inherit', offset: 100, opacity: 0 },
                    ]),
                  ]}
                  enableArea={true}
                  enableGridX={false}
                  enableGridY={false}
                  enablePoints={false}
                  enableSlices="x"
                  fill={[{ id: 'gradientA', match: '*' }]}
                  isInteractive={true}
                  lineWidth={3}
                  margin={{
                    bottom: 30,
                    // Calculate the left margin from the number of digits
                    // in the y axis labels, to make sure the labels will fit
                    // inside the clipping rectangle.
                    left:
                      15 + insights.opensByDate.length.toString().length * 8,
                    top: 20,
                  }}
                  sliceTooltip={(props) => {
                    const dataPoint = props.slice.points[0];
                    const date = new Date(dataPoint.data.xFormatted);

                    return (
                      <Paper>
                        <Box p={1}>
                          <Typography variant="h6">
                            <FormattedTime value={date} />
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  }}
                  xFormat="time:%Y-%m-%d %H:%M:%S.%L"
                  xScale={{
                    format: '%Y-%m-%d %H:%M:%S.%L',
                    precision: 'minute',
                    type: 'time',
                    useUTC: false,
                  }}
                />
              )}
            </ZUIFuture>
          </Box>
        </Box>
      </ZUICard>
      <ZUICard
        header={messages.insights.clicked.header()}
        status={
          <ZUINumberChip
            color={theme.palette.grey[200]}
            value={stats.numClicked}
          />
        }
      >
        <Box display="flex" gap={2}>
          <Box flexGrow={0} maxWidth={300}>
            <EmailKPIChart
              email={email}
              title={messages.insights.clicked.gauge.header()}
              total={stats.numSent}
              value={stats.numClicked}
            />
            <Typography mb={2} mt={1} variant="body2">
              {messages.insights.clicked.description()}
            </Typography>
          </Box>
          <Box flexGrow={1} minHeight={500}>
            <ZUIFuture future={insightsFuture}>
              {(insights) => (
                <Box alignItems="flex-start" display="flex">
                  <Table>
                    {insights.links
                      .concat()
                      .sort((a, b) => b.clicks - a.clicks)
                      .map((link) => (
                        <TableRow
                          key={link.id}
                          onMouseEnter={() => setSelectedLinkTag(link.tag)}
                          onMouseLeave={() => setSelectedLinkTag(null)}
                        >
                          <TableCell>{link.clicks}</TableCell>
                          <TableCell>
                            {sanitizer.sanitize(link.text, {
                              // Remove all inline tags that may exist here
                              ALLOWED_TAGS: ['#text'],
                            })}
                          </TableCell>
                          <TableCell>
                            <Link
                              display="flex"
                              gap={1}
                              href={link.url}
                              target="_blank"
                            >
                              {link.url}
                              <OpenInNew fontSize="small" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                  </Table>
                  <EmailMiniature
                    emailId={emailId}
                    orgId={orgId}
                    selectedTag={selectedLinkTag}
                    width={150}
                  />
                </Box>
              )}
            </ZUIFuture>
          </Box>
        </Box>
      </ZUICard>
    </>
  );
};

EmailPage.getLayout = function getLayout(page) {
  return <EmailLayout>{page}</EmailLayout>;
};

export default EmailPage;
