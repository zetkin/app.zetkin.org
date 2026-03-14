import { Skeleton } from '@mui/material';
import { FC } from 'react';

import ZUIText from 'zui/components/ZUIText';
import ZUICard from 'zui/ZUICard';
import ZUIFutures from 'zui/ZUIFutures';
import range from 'utils/range';
import messageIds from 'features/surveys/l10n/messageIds';
import useSurveyInsights from 'features/surveys/hooks/useSurveyInsights';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';
import { useMessages } from 'core/i18n';
import { ELEMENT_TYPE } from 'utils/types/zetkin';
import { OptionsStatsCard } from './OptionStatsCard';
import { TextStatsCard } from './TextStatsCard';

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

const SurveyInsights: FC<ResponseStatsChartCardProps> = ({
  orgId,
  surveyId,
}) => {
  const insightsFuture = useSurveyInsights(orgId, surveyId);
  const elementsFuture = useSurveyElements(orgId, surveyId);
  const messages = useMessages(messageIds);

  if (insightsFuture.error || elementsFuture.error) {
    return <ZUIText variant="headingMd">{messages.insights.error()}</ZUIText>;
  }

  return (
    <ZUIFutures
      futures={{ elements: elementsFuture, insights: insightsFuture }}
      loadingIndicator={
        <>
          {range(3).map((_, index) => (
            <LoadingStatsCard key={index} />
          ))}
        </>
      }
    >
      {({ data: { elements, insights } }) => (
        <>
          {insights.questions.map((questionStats, index) => {
            const question = elements.find(
              (question) => question.id === questionStats.question_id
            );
            if (!question || question.type === ELEMENT_TYPE.TEXT) {
              return null;
            }

            return 'options' in questionStats ? (
              <OptionsStatsCard
                key={index}
                question={question}
                questionStats={questionStats}
              />
            ) : (
              <TextStatsCard
                key={index}
                question={question}
                questionStats={questionStats}
                surveyId={surveyId}
              />
            );
          })}
        </>
      )}
    </ZUIFutures>
  );
};

export default SurveyInsights;
