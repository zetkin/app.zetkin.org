import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  Autocomplete,
  Box,
  Divider,
  Link,
  ListItem,
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
import { FormattedTime } from 'react-intl';

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
import ZUIFutures from 'zui/ZUIFutures';
import useSecondaryEmailInsights from 'features/emails/hooks/useSecondaryEmailInsights';
import getRelevantDataPoints from 'features/emails/utils/getRelevantDataPoints';
import useEmails from 'features/emails/hooks/useEmails';

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
  const [secondaryEmailId, setSecondaryEmailId] = useState(0);
  const [timeSpan, setTimeSpan] = useState<string>('first48');
  const messages = useMessages(messageIds);
  const { orgId, emailId } = useNumericRouteParams();
  const theme = useTheme();
  const { data: email } = useEmail(orgId, emailId);
  const stats = useEmailStats(orgId, emailId);
  const insightsFuture = useEmailInsights(orgId, emailId);
  const [selectedLinkTag, setSelectedLinkTag] = useState<string | null>(null);
  const emailsFuture = useEmails(orgId);
  const {
    emailFuture: secondaryEmailFuture,
    insightsFuture: secondaryInsightsFuture,
    statsFuture: secondaryStatsFuture,
  } = useSecondaryEmailInsights(orgId, secondaryEmailId);

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
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <ZUIFuture future={emailsFuture}>
          {(emails) => (
            <Autocomplete
              filterOptions={(options, state) =>
                options.filter(
                  (email) =>
                    email.title
                      ?.toLowerCase()
                      .includes(state.inputValue.toLowerCase()) ||
                    email.campaign?.title
                      .toLowerCase()
                      .includes(state.inputValue.toLowerCase())
                )
              }
              getOptionLabel={(option) => option.title || ''}
              onChange={(_, value) => setSecondaryEmailId(value?.id ?? 0)}
              onReset={() => setSecondaryEmailId(0)}
              options={emails.filter(
                // Can only compare with published emails, and not itself
                (email) => email.id != emailId && email.published
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={messages.insights.comparison.label()}
                  size="small"
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props}>
                  <Box
                    sx={{
                      alignItems: 'stretch',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography>{option.title}</Typography>
                    <Typography variant="body2">
                      {option.campaign?.title}
                    </Typography>
                  </Box>
                </ListItem>
              )}
              sx={{
                minWidth: 300,
              }}
              value={
                emails.find((email) => email.id == secondaryEmailId) || null
              }
            />
          )}
        </ZUIFuture>
      </Box>
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
            <ZUIFutures
              futures={{
                secondaryEmail: secondaryEmailFuture,
                secondaryStats: secondaryStatsFuture,
              }}
            >
              {({ data: { secondaryEmail, secondaryStats } }) => (
                <>
                  <EmailKPIChart
                    email={email}
                    secondaryEmail={secondaryEmail}
                    secondaryTotal={secondaryStats?.num_sent}
                    secondaryValue={secondaryStats?.num_opened}
                    title={messages.insights.opened.gauge.header()}
                    total={stats.numSent}
                    value={stats.numOpened}
                  />
                  <Typography mb={2} mt={1} variant="body2">
                    {messages.insights.opened.description()}
                  </Typography>
                </>
              )}
            </ZUIFutures>
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
            <ZUIFutures
              futures={{
                mainInsights: insightsFuture,
                secondaryEmail: secondaryEmailFuture,
                secondaryInsights: secondaryInsightsFuture,
                secondaryStats: secondaryStatsFuture,
              }}
            >
              {({
                data: {
                  mainInsights,
                  secondaryEmail,
                  secondaryInsights,
                  secondaryStats,
                },
              }) => {
                const lineData = [
                  {
                    data: mainInsights.opensByDate.map((openEvent) => ({
                      x:
                        (new Date(openEvent.date).getTime() -
                          new Date(
                            mainInsights.opensByDate[0].date
                          ).getTime()) /
                        1000,
                      y: openEvent.accumulatedOpens / stats.numSent,
                    })),
                    id: 'main',
                  },
                ];

                if (secondaryInsights && secondaryStats) {
                  lineData.push({
                    data: secondaryInsights.opensByDate.map((openEvent) => ({
                      x:
                        (new Date(openEvent.date).getTime() -
                          new Date(
                            secondaryInsights.opensByDate[0].date
                          ).getTime()) /
                        1000,
                      y: openEvent.accumulatedOpens / secondaryStats.num_sent,
                    })),
                    id: 'secondary',
                  });
                }

                return (
                  <ResponsiveLine
                    animate={false}
                    axisBottom={axisFromSpanValue(timeSpan)}
                    axisLeft={{
                      format: (val) => Math.round(val * 100) + '%',
                    }}
                    colors={[
                      theme.palette.primary.main,
                      theme.palette.secondary.dark,
                    ]}
                    curve="basis"
                    data={lineData}
                    defs={[
                      linearGradientDef('gradientA', [
                        { color: 'inherit', offset: 0 },
                        { color: 'inherit', offset: 100, opacity: 0 },
                      ]),
                      linearGradientDef('transparent', [
                        { color: 'white', offset: 0, opacity: 0 },
                        { color: 'white', offset: 100, opacity: 0 },
                      ]),
                    ]}
                    enableArea={true}
                    enableGridX={false}
                    enableGridY={false}
                    enablePoints={false}
                    enableSlices="x"
                    fill={[
                      { id: 'gradientA', match: { id: 'main' } },
                      { id: 'transparent', match: { id: 'secondary' } },
                    ]}
                    isInteractive={true}
                    lineWidth={3}
                    margin={{
                      bottom: 30,
                      // Calculate the left margin from the number of digits
                      // in the y axis labels, to make sure the labels will fit
                      // inside the clipping rectangle.
                      left:
                        15 +
                        mainInsights.opensByDate.length.toString().length * 8,
                      right: 8,
                      top: 20,
                    }}
                    sliceTooltip={(props) => {
                      const publishDate = new Date(email?.published || 0);
                      const { mainPoint, secondaryPoint } =
                        getRelevantDataPoints(
                          props.slice.points[0],
                          {
                            startDate: new Date(email.published!),
                            values: mainInsights.opensByDate,
                          },
                          secondaryInsights && secondaryEmail?.published
                            ? {
                                startDate: new Date(secondaryEmail.published),
                                values: secondaryInsights.opensByDate,
                              }
                            : null
                        );
                      const count = mainPoint.accumulatedOpens;
                      const date = new Date(mainPoint.date);

                      const secondsAfterPublish =
                        (date.getTime() - publishDate.getTime()) / 1000;

                      return (
                        <Paper sx={{ minWidth: 240 }}>
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
                          <Box p={2}>
                            <Box
                              alignItems="center"
                              display="flex"
                              gap={2}
                              justifyContent="space-between"
                            >
                              <Box>
                                <Typography variant="body2">
                                  <FormattedTime
                                    day="numeric"
                                    month="short"
                                    value={date}
                                  />
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
                            {secondaryPoint && secondaryStats && (
                              <>
                                <Divider sx={{ my: 1 }} />
                                <Box
                                  alignItems="center"
                                  display="flex"
                                  gap={2}
                                  justifyContent="space-between"
                                >
                                  <Box>
                                    <Typography variant="body2">
                                      <FormattedTime
                                        day="numeric"
                                        month="short"
                                        value={secondaryPoint.date}
                                      />
                                    </Typography>
                                    <Typography variant="body2">
                                      <Msg
                                        id={
                                          messageIds.insights.opened.chart
                                            .opened
                                        }
                                        values={{
                                          count:
                                            secondaryPoint.accumulatedOpens,
                                        }}
                                      />
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography color="secondary" variant="h5">
                                      {Math.round(
                                        (secondaryPoint.accumulatedOpens /
                                          secondaryStats.num_sent) *
                                          100
                                      )}
                                      %
                                    </Typography>
                                  </Box>
                                </Box>
                              </>
                            )}
                          </Box>
                        </Paper>
                      );
                    }}
                    xScale={{
                      max: timeSpanHours ? timeSpanHours * 60 * 60 : undefined,
                      type: 'linear',
                    }}
                  />
                );
              }}
            </ZUIFutures>
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
            <ZUIFutures
              futures={{
                secondaryEmail: secondaryEmailFuture,
                secondaryStats: secondaryStatsFuture,
              }}
            >
              {({ data: { secondaryEmail, secondaryStats } }) => (
                <>
                  <EmailKPIChart
                    email={email}
                    secondaryEmail={secondaryEmail}
                    secondaryTotal={secondaryStats?.num_sent ?? null}
                    secondaryValue={secondaryStats?.num_clicks ?? null}
                    title={messages.insights.clicked.gauge.header()}
                    total={stats.numSent}
                    value={stats.numClicked}
                  />
                  <Typography mb={2} mt={1} variant="body2">
                    {messages.insights.clicked.description()}
                  </Typography>
                </>
              )}
            </ZUIFutures>
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
