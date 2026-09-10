'use client';

import { FC, useEffect, useState } from 'react';
import {
  Box,
  ButtonBase,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useMessages } from 'core/i18n';
import { ZetkinMetric } from 'features/areaAssignments/types';
import {
  METRIC_ICON_BORDER_RADIUS,
  MetricIcon,
} from 'features/canvass/components/MetricIcon';
import messageIds from 'features/canvass/l10n/messageIds';
import { FloorShare } from 'features/canvass/utils/floorShare';

type Props = {
  share: FloorShare;
};

// Scoped to the current URL so different shared floors don't collide in storage
function getHighlightedCellsStorageKey(): string {
  return `floorShare:highlightedCells:${window.location.pathname}${window.location.search}`;
}

function readStoredHighlightedCells(): Record<string, boolean> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.sessionStorage.getItem(
      getHighlightedCellsStorageKey()
    );
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

const FloorShareTable: FC<Props> = ({ share }) => {
  const messages = useMessages(messageIds);
  const [highlightedCells, setHighlightedCells] = useState<
    Record<string, boolean>
  >({});
  const [hydrated, setHydrated] = useState(false);

  // Loaded after mount (not during initial render) to avoid a hydration mismatch
  useEffect(() => {
    setHighlightedCells(readStoredHighlightedCells());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.sessionStorage.setItem(
        getHighlightedCellsStorageKey(),
        JSON.stringify(highlightedCells)
      );
    } catch {
      // Ignore storage errors (e.g. quota exceeded or disabled storage)
    }
  }, [hydrated, highlightedCells]);

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table sx={{ width: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={numberHeaderCellSx}>
              {messages.households.single.householdColumnHeader()}
            </TableCell>
            {share.questions.length > 0 &&
              share.questions.map((question, index) => (
                <TableCell key={index} sx={questionHeaderCellSx}>
                  {question}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {share.households.map((household, householdIndex) => {
            const householdName =
              household.name || messages.households.single.unknown();
            const lastVisitedHoursAgo =
              share.lastVisitedHoursAgo[householdIndex];

            return (
              <TableRow key={householdName}>
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ maxWidth: 240, wordBreak: 'break-word' }}>
                    {householdName}
                  </Box>
                  {lastVisitedHoursAgo !== null &&
                    lastVisitedHoursAgo !== undefined && (
                      <Typography sx={recentlyVisitedSx} variant="caption">
                        {lastVisitedHoursAgo < 24
                          ? messages.households.single.hoursAgo({
                              hours: lastVisitedHoursAgo,
                            })
                          : messages.households.single.daysAgo({
                              days: Math.floor(lastVisitedHoursAgo / 24),
                            })}
                      </Typography>
                    )}
                </TableCell>
                {share.questions.length > 0 &&
                  household.responses.map((response, questionIndex) => {
                    const cellKey = `${householdIndex}:${questionIndex}`;
                    const highlighted = !!highlightedCells[cellKey];
                    const success = !!(
                      share.successMask &
                      (1 << questionIndex)
                    );

                    // Minimal stand-in metric; MetricIcon only reads type/defines_success
                    const metric: ZetkinMetric = {
                      area_assignment_id: 0,
                      created: '',
                      defines_success: success,
                      id: questionIndex,
                      question: share.questions[questionIndex],
                      type: 'bool',
                    };

                    return (
                      <TableCell key={questionIndex} sx={bodyCellSx}>
                        <ButtonBase
                          aria-label={`${householdName}: ${share.questions[questionIndex]}`}
                          aria-pressed={highlighted}
                          onClick={() =>
                            setHighlightedCells((current) => ({
                              ...current,
                              [cellKey]: !current[cellKey],
                            }))
                          }
                          sx={{
                            borderRadius: `${METRIC_ICON_BORDER_RADIUS}px`,
                            outline: highlighted
                              ? '3px solid #ED1C24'
                              : `3px solid transparent`,
                            outlineOffset: highlighted ? '2px' : 0,
                            transition:
                              'outline-offset 120ms ease-out, outline-color 120ms ease-out',
                          }}
                        >
                          <MetricIcon
                            metric={metric}
                            response={response}
                            variant="small"
                          />
                        </ButtonBase>
                      </TableCell>
                    );
                  })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

const numberHeaderCellSx = {
  borderBottom: '1px solid #ddd',
  padding: '12px 16px',
  textAlign: 'center' as const,
  whiteSpace: 'nowrap' as const,
};

const questionHeaderCellSx = {
  borderBottom: '1px solid #ddd',
  fontSize: 12,
  lineHeight: 1.1,
  maxWidth: 200,
  padding: '12px 16px',
  textAlign: 'center' as const,
  whiteSpace: 'normal' as const,
  wordBreak: 'break-word' as const,
};

const bodyCellSx = {
  borderBottom: '1px solid #eee',
  padding: '8px 16px',
  textAlign: 'center' as const,
};

const recentlyVisitedSx = {
  color: '#757575',
  display: 'block',
  fontSize: 10,
  lineHeight: 1.1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
};

export default FloorShareTable;
