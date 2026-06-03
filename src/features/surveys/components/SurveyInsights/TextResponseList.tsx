import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Link,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { List } from 'react-window';
import { Check, ContentCopy } from '@mui/icons-material';

import ZUIFuture from 'zui/ZUIFuture';
import {
  isTextResponse,
  SubmissionStats,
  TextQuestionStats,
} from 'features/surveys/types';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import useSurveySubmission from 'features/surveys/hooks/useSurveySubmission';
import { useNumericRouteParams } from 'core/hooks';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import { usePanes } from 'utils/panes';
import { TEXT_RESPONSE_CARD_HEIGHT } from 'features/surveys/components/SurveyInsights/InsightsCard';

const TextResponseCard = ({
  questionId,
  submission,
}: {
  questionId: number;
  submission: SubmissionStats;
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const extendedSubmissionFuture = useSurveySubmission(
    orgId,
    submission.submissionId
  );
  const { openPane } = usePanes();
  const [hasCopiedResponse, setHasCopiedResponse] = useState(false);

  useEffect(() => {
    if (hasCopiedResponse === true) {
      setTimeout(() => {
        setHasCopiedResponse(false);
      }, 2000);
    }
  }, [hasCopiedResponse]);

  return (
    <ZUIFuture
      future={extendedSubmissionFuture}
      skeleton={<Skeleton height={'100%'} variant={'rounded'} width={'100%'} />}
    >
      {(extendedSubmission: ZetkinSurveySubmission) => {
        if (!extendedSubmission.responses) {
          return null;
        }

        const questionResponse = extendedSubmission.responses.find(
          (response) => response.question_id === questionId
        );

        if (!questionResponse || !isTextResponse(questionResponse)) {
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
              <CardContent sx={{ width: '100%' }}>
                <Typography
                  sx={{
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: '4',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                  }}
                >
                  <Box
                    justifyContent="flex-end"
                    sx={{
                      alignItems: 'center',
                      display: 'float',
                      float: 'right',
                    }}
                  >
                    <Tooltip
                      arrow={true}
                      title={
                        hasCopiedResponse
                          ? messages.insights.textFields.copyResponse.wasCopied()
                          : messages.insights.textFields.copyResponse.copy()
                      }
                    >
                      <span>
                        <IconButton
                          aria-label="previous"
                          disabled={hasCopiedResponse}
                          onClick={async (ev) => {
                            ev.stopPropagation();
                            await navigator.clipboard.writeText(
                              questionResponse.response
                            );

                            setHasCopiedResponse(true);
                          }}
                          sx={(theme) => ({
                            '&: hover, &.Mui-focusVisible': {
                              color: theme.palette.text.secondary,
                            },
                          })}
                        >
                          {hasCopiedResponse ? <Check /> : <ContentCopy />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                  {questionResponse.response}
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
  rows: SubmissionStats[][];
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
      {row.map((submission, colIndex) => {
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
            <TextResponseCard questionId={questionId} submission={submission} />
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
  submissionStats,
}: {
  questionStats: TextQuestionStats;
  submissionStats: SubmissionStats[];
}) => {
  const theme = useTheme();
  const singleColumnLayout = useMediaQuery(theme.breakpoints.down('lg'));

  const columnCount = singleColumnLayout ? 1 : 2;

  const rows = useMemo(
    () =>
      chunk(
        submissionStats.filter((submission) =>
          submission.answeredTextQuestions.some(
            (questionId) => questionId === questionStats.question.id
          )
        ),
        columnCount
      ),
    [submissionStats, columnCount, questionStats.question.id]
  );

  const rowProps = useMemo(
    () => ({
      columnCount,
      questionId: questionStats.question.id,
      rows,
    }),
    [columnCount, questionStats.question.id, rows]
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
      style={{
        height: TEXT_RESPONSE_CARD_HEIGHT * rows.length,
      }}
    />
  );
};
