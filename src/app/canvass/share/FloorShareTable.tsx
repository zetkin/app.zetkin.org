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

// A manual override cycled by clicking a cell: 'yes' -> 'no' -> reset (undefined)
type CellOverride = 'yes' | 'no';

function nextOverride(
  current: CellOverride | undefined
): CellOverride | undefined {
  if (current === undefined) {
    return 'yes';
  }
  if (current === 'yes') {
    return 'no';
  }
  return undefined;
}

// Scoped to the current URL so different shared floors don't collide in storage
function getCellOverridesStorageKey(): string {
  return `floorShare:cellOverrides:${window.location.pathname}${window.location.search}`;
}

function readStoredCellOverrides(): Record<string, CellOverride> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.sessionStorage.getItem(getCellOverridesStorageKey());
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

const FloorShareTable: FC<Props> = ({ share }) => {
  const messages = useMessages(messageIds);
  const [cellOverrides, setCellOverrides] = useState<
    Record<string, CellOverride>
  >({});
  const [hydrated, setHydrated] = useState(false);

  // Loaded after mount (not during initial render) to avoid a hydration mismatch
  useEffect(() => {
    setCellOverrides(readStoredCellOverrides());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.sessionStorage.setItem(
        getCellOverridesStorageKey(),
        JSON.stringify(cellOverrides)
      );
    } catch {
      // Ignore storage errors (e.g. quota exceeded or disabled storage)
    }
  }, [hydrated, cellOverrides]);

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
                    const override = cellOverrides[cellKey];
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
                          aria-pressed={!!override}
                          onClick={() =>
                            setCellOverrides((current) => {
                              const updated = { ...current };
                              const next = nextOverride(current[cellKey]);
                              if (next) {
                                updated[cellKey] = next;
                              } else {
                                delete updated[cellKey];
                              }
                              return updated;
                            })
                          }
                          sx={{
                            borderRadius: `${METRIC_ICON_BORDER_RADIUS}px`,
                            outline: override
                              ? '3px solid #000'
                              : '3px solid transparent',
                            transition: 'outline-color 120ms ease-out',
                          }}
                        >
                          <MetricIcon
                            forceIconColor={
                              override
                                ? success
                                  ? 'white'
                                  : 'black'
                                : undefined
                            }
                            metric={metric}
                            response={override ?? response}
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
