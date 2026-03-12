import React, { CSSProperties, useMemo } from 'react';
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

import ZUIFuture from 'zui/ZUIFuture';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import useSurveySubmission from 'features/surveys/hooks/useSurveySubmission';
import { useNumericRouteParams } from 'core/hooks';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import { usePanes } from 'utils/panes';
import {
  isTextResponse,
  Zetkin2TextAnswerListPerQuestion,
  Zetkin2TextQuestionStats,
} from 'features/surveys/types';
import { TEXT_RESPONSE_CARD_HEIGHT } from './InsightsCard';

const TextResponseCard = ({
  questionId,
  submissionId,
}: {
  questionId: number;
  submissionId: number;
}) => {
  const { orgId } = useNumericRouteParams();
  const extendedSubmissionFuture = useSurveySubmission(orgId, submissionId);
  const { openPane } = usePanes();

  return (
    <ZUIFuture
      future={extendedSubmissionFuture}
      skeleton={<Skeleton height={'100%'} variant={'rounded'} width={'100%'} />}
    >
      {(extendedSubmission: ZetkinSurveySubmission) => {
        if (!extendedSubmission.responses) {
          return null;
        }

        const submission = extendedSubmission.responses.find(
          (response) => response.question_id === questionId
        );

        if (!submission || !isTextResponse(submission)) {
          return null;
        }

        return (
          <Link
            onClick={() => {
              openPane({
                render() {
                  return (
                    <SurveySubmissionPane
                      id={extendedSubmission.id}
                      orgId={orgId}
                    />
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
                  {submission.response}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        );
      }}
    </ZUIFuture>
  );
};

type TextResponseListRowProps = {
  columnCount: number;
  questionId: number;
  rows: number[][];
};

const TextResponseListRow = ({
  columnCount,
  index: rowIndex,
  questionId,
  style,
  rows,
}: TextResponseListRowProps & {
  index: number;
  style: CSSProperties;
}) => {
  const row = rows[rowIndex];

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
      {row.map((submissionId, colIndex) => {
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
              questionId={questionId}
              submissionId={submissionId}
            />
          </Box>
        );
      })}
    </Box>
  );
};

function chunk<T>(xs: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < xs.length; i += size) {
    res.push(xs.slice(i, i + size));
  }
  return res;
}

export const TextResponseList = ({
  questionStats,
  responseStats,
}: {
  questionStats: Zetkin2TextQuestionStats;
  responseStats: Zetkin2TextAnswerListPerQuestion;
}) => {
  const theme = useTheme();
  const singleColumnLayout = useMediaQuery(theme.breakpoints.down('lg'));

  const columnCount = singleColumnLayout ? 1 : 2;

  const rows = useMemo(
    () =>
      chunk(responseStats[questionStats.question_id.toString()], columnCount),
    [responseStats, columnCount, questionStats.question_id]
  );

  const rowProps = useMemo(
    () => ({
      columnCount,
      questionId: questionStats.question_id,
      rows,
    }),
    [columnCount, questionStats.question_id, rows]
  );

  if (!rows) {
    return null;
  }

  return (
    <List<TextResponseListRowProps>
      rowComponent={TextResponseListRow}
      rowCount={rows.length}
      rowHeight={TEXT_RESPONSE_CARD_HEIGHT}
      rowProps={rowProps}
    />
  );
};
