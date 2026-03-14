import React, { CSSProperties, FC, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Link,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { List } from 'react-window';

import { useNumericRouteParams } from 'core/hooks';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import { usePanes } from 'utils/panes';
import {
  Zetkin2QuestionResponse,
  Zetkin2TextQuestionStats,
} from 'features/surveys/types';
import { TEXT_RESPONSE_CARD_HEIGHT } from './InsightsCard';
import usePaginatedList, { PaginatedList } from 'core/hooks/usePaginatedList';

const TextResponseCard = ({
  pageIndex,
  response,
  responses,
}: {
  pageIndex: number;
  response: Zetkin2QuestionResponse | null;
  responses: PaginatedList<Zetkin2QuestionResponse> & { status: 'loaded' };
}) => {
  const { orgId } = useNumericRouteParams();
  const { openPane } = usePanes();

  const hasLoaded = !!response;

  useEffect(() => {
    if (hasLoaded) {
      return;
    }

    const controller = new AbortController();

    responses.loadPage(pageIndex, controller.signal);

    return () => controller.abort();
  }, [hasLoaded, responses.loadPage, pageIndex]);

  if (!response) {
    return <Skeleton height={'100%'} variant={'rounded'} width={'100%'} />;
  }

  return (
    <Link
      onClick={() => {
        openPane({
          render() {
            return (
              <SurveySubmissionPane id={response.submission_id} orgId={orgId} />
            );
          },
          width: 400,
        });
      }}
      style={{
        cursor: 'pointer',
        display: 'flex',
        height: '100%',
        textDecoration: 'none',
        width: '100%',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
        }}
      >
        <CardContent>
          <Typography
            sx={{
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '4',
              display: '-webkit-box',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {response.response}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

type TextResponseListRowProps = {
  columnCount: number;
  responses: PaginatedList<Zetkin2QuestionResponse> & { status: 'loaded' };
};

const TextResponseListRow = ({
  columnCount,
  index: rowIndex,
  style,
  responses,
}: TextResponseListRowProps & {
  index: number;
  style: CSSProperties;
}) => {
  return (
    <Box
      style={style}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: TEXT_RESPONSE_CARD_HEIGHT,
        width: '100%',
      }}
    >
      {new Array(columnCount).fill(0).map((_, colIndex) => {
        const index = rowIndex * columnCount + colIndex;

        if (index >= responses.totalCount) {
          return null;
        }

        const pageIndex = Math.floor(index / responses.pageSize);
        const indexOnPage = index % responses.pageSize;
        const page = responses.pages[pageIndex];
        const response = page ? page[indexOnPage] : null;

        return (
          <Box
            key={colIndex}
            sx={{
              display: 'flex',
              height: TEXT_RESPONSE_CARD_HEIGHT,
              padding: '10px',
              width: `${100.0 / columnCount}%`,
            }}
          >
            <TextResponseCard
              pageIndex={pageIndex}
              response={response}
              responses={responses}
            />
          </Box>
        );
      })}
    </Box>
  );
};

const LoadedTextResponseList: FC<{
  columnCount: number;
  questionStats: Zetkin2TextQuestionStats;
  responses: PaginatedList<Zetkin2QuestionResponse> & { status: 'loaded' };
}> = ({ columnCount, questionStats, responses }) => {
  const rowProps = useMemo(
    () => ({
      columnCount,
      questionId: questionStats.question_id,
      responses,
    }),
    [columnCount, questionStats.question_id, responses]
  );

  return (
    <List<TextResponseListRowProps>
      rowComponent={TextResponseListRow}
      rowCount={Math.ceil(responses.totalCount / columnCount)}
      rowHeight={TEXT_RESPONSE_CARD_HEIGHT}
      rowProps={rowProps}
    />
  );
};

export const TextResponseList = ({
  questionStats,
  surveyId,
}: {
  questionStats: Zetkin2TextQuestionStats;
  surveyId: number;
}) => {
  const { orgId } = useNumericRouteParams();

  const theme = useTheme();
  const singleColumnLayout = useMediaQuery(theme.breakpoints.down('lg'));

  const columnCount = singleColumnLayout ? 1 : 2;

  const responses = usePaginatedList<Zetkin2QuestionResponse>(
    `/api2/orgs/${orgId}/surveys/${surveyId}/questions/${questionStats.question_id}/responses`
  );

  if (responses.status === 'error') {
    return <Typography>{(responses.error || '').toString()}</Typography>;
  }

  if (responses.status === 'loading') {
    return (
      <Box>
        {new Array(5).fill(0).map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              height: TEXT_RESPONSE_CARD_HEIGHT,
              width: '100%',
            }}
          >
            {new Array(columnCount).fill(0).map((_, colIndex) => (
              <Box
                key={colIndex}
                sx={{
                  display: 'flex',
                  height: TEXT_RESPONSE_CARD_HEIGHT,
                  padding: '10px',
                  width: `${100.0 / columnCount}%`,
                }}
              >
                <Skeleton height={'100%'} variant="rounded" width={'100%'} />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <LoadedTextResponseList
      columnCount={columnCount}
      questionStats={questionStats}
      responses={responses}
    />
  );
};
