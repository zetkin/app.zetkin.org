import DOMPurify from 'dompurify';
import { OpenInNew } from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  Box,
  Link,
  Table,
  TableCell,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';

import ZUICard from 'zui/newDesignSystem/ZUICard';
import ZUIFutures from 'zui/ZUIFutures';
import ZUINumberChip from 'zui/ZUINumberChip';
import EmailKPIChart from './EmailKPIChart';
import ZUIFuture from 'zui/ZUIFuture';
import EmailMiniature from './EmailMiniature';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useEmailStats from '../hooks/useEmailStats';
import useSecondaryEmailInsights from '../hooks/useSecondaryEmailInsights';
import { ZetkinEmail } from 'utils/types/zetkin';
import useEmailInsights from '../hooks/useEmailInsights';

type Props = {
  email: ZetkinEmail;
  secondaryEmailId: number;
};

const ClickedInsightsSection: FC<Props> = ({ email, secondaryEmailId }) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const stats = useEmailStats(email.organization.id, email.id);
  const [clickMetric, setClickMetric] = useState<'ctr' | 'ctor'>('ctr');
  const [selectedLinkTag, setSelectedLinkTag] = useState<string | null>(null);
  const insightsFuture = useEmailInsights(email.organization.id, email.id);
  const secondary = useSecondaryEmailInsights(
    email.organization.id,
    secondaryEmailId
  );

  const sanitizer = DOMPurify();

  return (
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
              secondaryEmail: secondary.emailFuture,
              secondaryStats: secondary.statsFuture,
            }}
          >
            {({ data: { secondaryEmail, secondaryStats } }) => (
              <>
                <EmailKPIChart
                  mainEmail={email}
                  mainTotal={
                    clickMetric == 'ctr' ? stats.numSent : stats.numOpened
                  }
                  mainValue={stats.numClicked}
                  secondaryEmail={secondaryEmail}
                  secondaryTotal={
                    clickMetric == 'ctr'
                      ? secondaryStats?.num_sent ?? null
                      : secondaryStats?.num_opened ?? null
                  }
                  secondaryValue={secondaryStats?.num_clicks ?? null}
                  title={messages.insights.clicked.gauge.headers[clickMetric]()}
                />
                <Box display="flex" justifyContent="center">
                  <ToggleButtonGroup
                    exclusive
                    onChange={(_, value) =>
                      setClickMetric(value || clickMetric)
                    }
                    size="small"
                    value={clickMetric}
                  >
                    <ToggleButton value="ctr">
                      {messages.insights.clicked.metrics.ctr()}
                    </ToggleButton>
                    <ToggleButton value="ctor">
                      {messages.insights.clicked.metrics.ctor()}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Typography mb={2} mt={1} variant="body2">
                  {messages.insights.clicked.descriptions[clickMetric]()}
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
                  emailId={email.id}
                  orgId={email.organization.id}
                  selectedTag={selectedLinkTag}
                  width={150}
                />
              </Box>
            )}
          </ZUIFuture>
        </Box>
      </Box>
    </ZUICard>
  );
};

export default ClickedInsightsSection;
