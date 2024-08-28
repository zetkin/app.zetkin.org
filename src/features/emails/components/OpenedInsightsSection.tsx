import { AxisProps } from '@nivo/axes';
import { ResponsiveLine } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import { FC, useState } from 'react';
import { Box, MenuItem, TextField, Typography, useTheme } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import ZUICard from 'zui/ZUICard';
import ZUINumberChip from 'zui/ZUINumberChip';
import messageIds from '../l10n/messageIds';
import ZUIFutures from 'zui/ZUIFutures';
import EmailKPIChart from './EmailKPIChart';
import { ZetkinEmail } from 'utils/types/zetkin';
import useEmailInsights from '../hooks/useEmailInsights';
import useEmailStats from '../hooks/useEmailStats';
import useSecondaryEmailInsights from '../hooks/useSecondaryEmailInsights';
import { EmailInsights } from '../types';
import EmailDiagramHoverCard from './EmailDiagramHoverCard';

type Props = {
  email: ZetkinEmail;
  secondaryEmailId: number;
};

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

function lineDataFromInsights(
  email: ZetkinEmail,
  insights: EmailInsights,
  numSent: number
): { x: number; y: number }[] {
  const startTime = email.published;
  if (!startTime) {
    return [];
  }

  return insights.opensByDate.map((openEvent) => ({
    x:
      (new Date(openEvent.date).getTime() - new Date(startTime).getTime()) /
      1000,
    y: openEvent.accumulatedOpens / numSent,
  }));
}

const OpenedInsightsSection: FC<Props> = ({ email, secondaryEmailId }) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [timeSpan, setTimeSpan] = useState<string>('first48');
  const stats = useEmailStats(email.organization.id, email.id);
  const insightsFuture = useEmailInsights(email.organization.id, email.id);
  const secondary = useSecondaryEmailInsights(
    email.organization.id,
    secondaryEmailId
  );

  const timeSpanHours = hoursFromSpanValue(timeSpan);

  const emailPublished = email.published;
  if (!emailPublished || !email.processed) {
    return null;
  }

  return (
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
              secondaryEmail: secondary.emailFuture,
              secondaryStats: secondary.statsFuture,
            }}
          >
            {({ data: { secondaryEmail, secondaryStats } }) => (
              <>
                <EmailKPIChart
                  mainEmail={email}
                  mainTotal={stats.numSent}
                  mainValue={stats.numOpened}
                  secondaryEmail={secondaryEmail}
                  secondaryTotal={secondaryStats?.num_sent}
                  secondaryValue={secondaryStats?.num_opened}
                  title={messages.insights.opened.gauge.header()}
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
              secondaryEmail: secondary.emailFuture,
              secondaryInsights: secondary.insightsFuture,
              secondaryStats: secondary.statsFuture,
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
                  data: lineDataFromInsights(
                    email,
                    mainInsights,
                    stats.numSent
                  ),
                  id: 'main',
                },
              ];

              if (secondaryEmail && secondaryInsights && secondaryStats) {
                lineData.push({
                  data: lineDataFromInsights(
                    secondaryEmail,
                    secondaryInsights,
                    secondaryStats.num_sent
                  ),
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
                  colors={[theme.palette.primary.main, theme.palette.grey[600]]}
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
                    left: 40,
                    right: 8,
                    top: 20,
                  }}
                  sliceTooltip={(props) => {
                    return (
                      <EmailDiagramHoverCard
                        mainInsights={mainInsights}
                        mainStats={stats.data}
                        pointId={props.slice.points[0].id}
                        publishDate={new Date(emailPublished)}
                        secondaryEmail={secondaryEmail}
                        secondaryInsights={secondaryInsights}
                        secondaryStats={secondaryStats}
                      />
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
  );
};

export default OpenedInsightsSection;
