import { FC } from 'react';

import { Msg } from 'core/i18n';
import messageIds from 'features/import/l10n/messageIds';

type Props = {
  breakpoint?: number;
  percentage?: number;
  rows: number[];
};

const ProblemRowsText: FC<Props> = ({ breakpoint = 8, percentage, rows,  }) => {
  if (rows.length == 0) {
    return null;
  } else if (rows.length == 1) {
    return percentage ? (
      <Msg
        id={messageIds.preflight.messages.common.singleRowPerc}
        values={{ row: rows[0], percentage }}
      />
    ) : (
      <Msg
        id={messageIds.preflight.messages.common.singleRow}
        values={{ row: rows[0] }}
      />
    );
  } else if (rows.length <= breakpoint + 1) {
    const commaStr = rows.slice(0, -1).join(', ');
    const lastRow = rows[rows.length - 1];
    return percentage ? (
      <Msg
        id={messageIds.preflight.messages.common.fewRowsPerc}
        values={{ commaRows: commaStr, lastRow: lastRow, percentage }}
      />
    ) : (
      <Msg
        id={messageIds.preflight.messages.common.fewRows}
        values={{ commaRows: commaStr, lastRow: lastRow }}
      />
    );
  } else {
    const commaStr = rows.slice(0, breakpoint).join(', ');
    const additionalRows = rows.length - breakpoint;
    return percentage ? (
      <Msg
        id={messageIds.preflight.messages.common.manyRowsPerc}
        values={{
          additionalRows: additionalRows,
          commaRows: commaStr,
          percentage,
        }}
      />
    ) : (
      <Msg
        id={messageIds.preflight.messages.common.manyRows}
        values={{ additionalRows: additionalRows, commaRows: commaStr }}
      />
    );
  }
};

export default ProblemRowsText;
