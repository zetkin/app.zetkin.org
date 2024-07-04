import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  Box,
  Divider,
  Link,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { AxisProps } from '@nivo/axes';
import { ResponsiveLine } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import { OpenInNew } from '@mui/icons-material';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { FormattedDate } from 'react-intl';

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
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import EmailMiniature from 'features/emails/components/EmailMiniature';
import ZUIDuration from 'zui/ZUIDuration';

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

const HOURS_BY_SPAN: Record<string, number> = {
  first24: 24,
  first48: 48,
  firstMonth: 24 * 30,
  firstWeek: 24 * 7,
};

function hoursFromSpanValue(value: string): number | undefined {
  return HOURS_BY_SPAN[value];
}

function axisFromSpanValue(value: string): AxisProps {
  if (value == 'first24' || value == 'first48') {
    const output: number[] = [];
    for (let i = 0; i < 48; i += 4) {
      output.push(i * 60 * 60);
    }

    return {
      format: (val) => Math.round(val / 60 / 60),
      tickValues: output,
    };
  } else {
    return {
      format: (val) => Math.round(val / 60 / 60 / 24),
      tickValues: value == 'firstWeek' ? 7 : 15,
    };
  }
}

const EmailPage: PageWithLayout = () => {
  const [timeSpan, setTimeSpan] = useState<string>('first48');
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

  const timeSpanHours = hoursFromSpanValue(timeSpan);

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
          <Box flexGrow={1} height={550} position="relative">
            <Box
              bgcolor={theme.palette.background.paper}
              bottom={40}
              position="absolute"
              right={0}
              width={160}
              zIndex={1000}
            >
              <TextField
                fullWidth
                onChange={(ev) => setTimeSpan(ev.target.value)}
                select
                size="small"
                value={timeSpan}
              >
                <MenuItem value="first24">
                  <Msg id={messageIds.insights.opened.chart.spans.first24} />
                </MenuItem>
                <MenuItem value="first48">
                  <Msg id={messageIds.insights.opened.chart.spans.first48} />
                </MenuItem>
                <MenuItem value="firstWeek">
                  <Msg id={messageIds.insights.opened.chart.spans.firstWeek} />
                </MenuItem>
                <MenuItem value="firstMonth">
                  <Msg id={messageIds.insights.opened.chart.spans.firstMonth} />
                </MenuItem>
                <MenuItem value="allTime">
                  <Msg id={messageIds.insights.opened.chart.spans.allTime} />
                </MenuItem>
              </TextField>
            </Box>
            <ZUIFuture future={insightsFuture}>
              {(insights) => (
                <ResponsiveLine
                  animate={false}
                  axisBottom={axisFromSpanValue(timeSpan)}
                  axisLeft={{
                    format: (val) => Math.round(val * 100) + '%',
                  }}
                  colors={[theme.palette.primary.main]}
                  curve="basis"
                  data={[
                    {
                      data: insights.opensByDate.map((openEvent) => ({
                        x:
                          (new Date(openEvent.date).getTime() -
                            new Date(insights.opensByDate[0].date).getTime()) /
                          1000,
                        y: openEvent.accumulatedOpens / stats.numSent,
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
                    right: 8,
                    top: 20,
                  }}
                  sliceTooltip={(props) => {
                    const publishDate = new Date(email.published || 0);
                    const index = props.slice.points[0].index;
                    const count = insights.opensByDate[index].accumulatedOpens;
                    const date = new Date(insights.opensByDate[index].date);
                    const secondsAfterPublish =
                      (date.getTime() - publishDate.getTime()) / 1000;

                    return (
                      <Paper sx={{ minWidth: 200 }}>
                        <Box p={2}>
                          <Typography variant="h6">
                            <ZUIDuration seconds={secondsAfterPublish} />
                          </Typography>
                          <Typography variant="body2">
                            <Msg
                              id={messageIds.insights.opened.chart.afterSend}
                            />
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          alignItems="center"
                          display="flex"
                          gap={2}
                          justifyContent="space-between"
                          p={2}
                        >
                          <Box>
                            <Typography variant="body2">
                              <FormattedDate value={date} />
                            </Typography>
                            <Typography variant="body2">
                              <Msg
                                id={messageIds.insights.opened.chart.opened}
                                values={{
                                  count: count,
                                }}
                              />
                            </Typography>
                          </Box>
                          <Box>
                            <Typography color="primary" variant="h5">
                              {Math.round((count / stats.numSent) * 100)}%
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    );
                  }}
                  xScale={{
                    max: timeSpanHours ? timeSpanHours * 60 * 60 : undefined,
                    type: 'linear',
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
