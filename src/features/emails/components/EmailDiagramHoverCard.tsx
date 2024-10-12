import { FC } from 'react';
import { FormattedTime } from 'react-intl';
import { Box, Divider, Paper, Typography } from '@mui/material';

import { Msg } from 'core/i18n';
import ZUIDuration from 'zui/ZUIDuration';
import messageIds from '../l10n/messageIds';
import { EmailInsights, ZetkinEmailStats } from '../types';
import getRelevantDataPoints from '../utils/getRelevantDataPoints';
import { ZetkinEmail } from 'utils/types/zetkin';

type Props = {
  mainInsights: EmailInsights;
  mainStats: ZetkinEmailStats | null;
  pointId: string;
  publishDate: Date;
  secondaryEmail: ZetkinEmail | null;
  secondaryInsights: EmailInsights | null;
  secondaryStats: ZetkinEmailStats | null;
};

const EmailDiagramHoverCard: FC<Props> = ({
  mainInsights,
  mainStats,
  pointId,
  publishDate,
  secondaryEmail,
  secondaryInsights,
  secondaryStats,
}) => {
  const { mainPoint, secondaryPoint } = getRelevantDataPoints(
    { id: pointId },
    {
      startDate: publishDate,
      values: mainInsights.opensByDate,
    },
    secondaryInsights && secondaryEmail?.published
      ? {
          startDate: new Date(secondaryEmail.published),
          values: secondaryInsights.opensByDate,
        }
      : null
  );
  if (!mainPoint) {
    return null;
  }

  const count = mainPoint.accumulatedOpens;
  const date = new Date(mainPoint.date);

  const secondsAfterPublish = (date.getTime() - publishDate.getTime()) / 1000;
  return (
    <Paper sx={{ minWidth: 240 }}>
      <Box p={2}>
        <Typography variant="h6">
          <ZUIDuration seconds={secondsAfterPublish} />
        </Typography>
        <Typography variant="body2">
          <Msg id={messageIds.insights.opened.chart.afterSend} />
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
              <FormattedTime day="numeric" month="short" value={date} />
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
              {Math.round((count / (mainStats?.num_sent || 1)) * 100)}%
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
                    id={messageIds.insights.opened.chart.opened}
                    values={{
                      count: secondaryPoint.accumulatedOpens,
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
};

export default EmailDiagramHoverCard;
