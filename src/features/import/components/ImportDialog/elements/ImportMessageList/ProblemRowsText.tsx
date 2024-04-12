import { FC } from 'react';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';

type Props = {
  breakpoint?: number;
  rows: number[];
};

const ProblemRowsText: FC<Props> = ({ breakpoint = 8, rows }) => {
  if (rows.length == 0) {
    return null;
  } else if (rows.length == 1) {
    return (
      <Msg
        id={messageIds.preflight.messages.common.singleRow}
        values={{ row: rows[0] }}
      />
    );
  } else if (rows.length <= breakpoint) {
    const commaStr = rows.slice(0, -1).join(', ');
    const lastRow = rows[rows.length - 1];
    return (
      <Msg
        id={messageIds.preflight.messages.common.fewRows}
        values={{ commaRows: commaStr, lastRow: lastRow }}
      />
    );
  } else {
    const commaStr = rows.slice(0, breakpoint).join(', ');
    const additionalRows = rows.length - breakpoint;
    return (
      <Msg
        id={messageIds.preflight.messages.common.manyRows}
        values={{ additionalRows: additionalRows, commaRows: commaStr }}
      />
    );
  }
};

export default ProblemRowsText;
