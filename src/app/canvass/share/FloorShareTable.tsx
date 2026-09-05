'use client';

import { FC, useState } from 'react';

import {
  FloorShare,
  formatFloorShareHouseholdName,
} from 'features/canvass/utils/floorShare';

type Props = {
  recentlyVisitedLabel: string;
  share: FloorShare;
};

const FloorShareTable: FC<Props> = ({ recentlyVisitedLabel, share }) => {
  const [highlightedCells, setHighlightedCells] = useState<
    Record<string, boolean>
  >({});

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          minWidth: '100%',
          tableLayout: 'fixed',
        }}
      >
        <thead>
          <tr>
            <th style={numberHeaderCellStyle}>Nr</th>
            {share.questions.map((question, index) => (
              <th key={index} style={questionHeaderCellStyle}>
                {question}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {share.households.map((household, householdIndex) => {
            const householdName = formatFloorShareHouseholdName(
              share.floor,
              householdIndex + 1
            );

            return (
              <tr key={householdName}>
                <td style={bodyCellStyle}>
                  <div>{householdName}</div>
                  {share.recentlyVisited[householdIndex] && (
                    <small style={recentlyVisitedStyle}>
                      {recentlyVisitedLabel}
                    </small>
                  )}
                </td>
                {household.responses.map((response, questionIndex) => {
                  const cellKey = `${householdIndex}:${questionIndex}`;
                  const highlighted = !!highlightedCells[cellKey];

                  return (
                    <td key={questionIndex} style={bodyCellStyle}>
                      <button
                        aria-label={`${householdName}: ${share.questions[questionIndex]}`}
                        aria-pressed={highlighted}
                        onClick={() =>
                          setHighlightedCells((current) => ({
                            ...current,
                            [cellKey]: !current[cellKey],
                          }))
                        }
                        style={buttonStyle}
                        type="button"
                      >
                        {highlighted ? (
                          <span style={highlightedMarkStyle}>{'\u2713'}</span>
                        ) : (
                          <ResponseMark
                            response={response}
                            success={
                              !!(share.successMask & (1 << questionIndex))
                            }
                          />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

type ResponseMarkProps = {
  response: 'no' | 'yes' | null;
  success: boolean;
};

const ResponseMark: FC<ResponseMarkProps> = ({ response, success }) => (
  <span
    aria-hidden="true"
    style={{
      alignItems: 'center',
      backgroundColor: success && response === 'yes' ? '#00838f' : '#e0e0e0',
      borderRadius: 5,
      color: success && response === 'yes' ? '#fff' : '#757575',
      display: 'inline-flex',
      fontSize: 18,
      fontWeight: 'bold',
      height: 20,
      justifyContent: 'center',
      lineHeight: 1,
      width: 20,
    }}
  >
    {response === 'yes' ? '\u2713' : response === 'no' ? '\u00d7' : '\u2212'}
  </span>
);

const highlightedMarkStyle = {
  alignItems: 'center',
  backgroundColor: '#2e7d32',
  borderRadius: 6,
  boxShadow: '0 0 0 4px rgba(46, 125, 50, 0.25)',
  color: '#fff',
  display: 'inline-flex',
  fontSize: 24,
  fontWeight: 'bold',
  height: 28,
  justifyContent: 'center',
  lineHeight: 1,
  transform: 'scale(1.05)',
  transition: 'transform 120ms ease-out',
  width: 28,
};

const headerCellStyle = {
  borderBottom: '1px solid #ddd',
  padding: '12px 16px',
  textAlign: 'center' as const,
};

const questionHeaderCellStyle = {
  ...headerCellStyle,
  fontSize: 12,
  lineHeight: 1.1,
  whiteSpace: 'normal' as const,
  wordBreak: 'normal' as const,
};

const numberHeaderCellStyle = {
  ...headerCellStyle,
  width: 56,
};

const bodyCellStyle = {
  borderBottom: '1px solid #eee',
  padding: '8px 16px',
  textAlign: 'center' as const,
};

const recentlyVisitedStyle = {
  color: '#757575',
  display: 'block',
  fontSize: 10,
  lineHeight: 1.1,
};

const buttonStyle = {
  alignItems: 'center',
  background: 'none',
  border: 0,
  cursor: 'pointer',
  display: 'inline-flex',
  height: 32,
  justifyContent: 'center',
  padding: 0,
  width: 32,
};

export default FloorShareTable;
