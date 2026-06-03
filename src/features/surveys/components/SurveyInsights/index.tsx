import React, { FC } from 'react';
import { Skeleton } from '@mui/material';

import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import { SurveyResponseStats } from 'features/surveys/types';
import range from 'utils/range';
import useSurveyResponseStats from 'features/surveys/hooks/useSurveyResponseStats';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import { OptionsStatsCard } from 'features/surveys/components/SurveyInsights/OptionsStatsCard';
import { TextStatsCard } from 'features/surveys/components/SurveyInsights/TextStatsCard';

const LoadingStatsCard = () => {
  return (
    <ZUICard
      header={<Skeleton height={'100%'} width={150} />}
      subheader={<Skeleton height={'100%'} width={300} />}
      sx={{
        width: '100%',
      }}
    >
      <Skeleton
        height={30}
        sx={{ marginBottom: '10px' }}
        variant={'rounded'}
        width={200}
      />
      <Skeleton height={200} variant={'rounded'} width={'100%'} />
    </ZUICard>
  );
};

type ResponseStatsChartCardProps = {
  orgId: number;
  surveyId: number;
};

const ResponseStatsCards: FC<ResponseStatsChartCardProps> = ({
  orgId,
  surveyId,
}) => {
  const responseStatsFuture = useSurveyResponseStats(orgId, surveyId);
  const messages = useMessages(messageIds);

  if (responseStatsFuture.error) {
    return <ZUIText variant="headingMd">{messages.insights.error()}</ZUIText>;
  }

  return (
    <ZUIFuture<SurveyResponseStats | null>
      future={responseStatsFuture}
      skeleton={
        <>
          {range(3).map((_, index) => (
            <LoadingStatsCard key={index} />
          ))}
        </>
      }
    >
      {(data: SurveyResponseStats | null) => {
        if (!data) {
          return null;
        }

        return (
          <>
            {data.questions.map((questionStats, index) =>
              'options' in questionStats ? (
                <OptionsStatsCard key={index} questionStats={questionStats} />
              ) : (
                <TextStatsCard
                  key={index}
                  questionStats={questionStats}
                  submissionStats={data.submissionStats}
                />
              )
            )}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default ResponseStatsCards;
