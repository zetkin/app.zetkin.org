import { GridColDef } from '@mui/x-data-grid-pro';

import { getStaticColumns } from './getStaticColumns';
import getTagColumns from './getTagColumns';
import { JourneyTagColumnData } from 'features/journeys/utils/journeyInstanceUtils';
import { UseMessagesMap } from 'core/i18n';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import messageIds from 'features/journeys/l10n/messageIds';

const getColumns = (
  messages: UseMessagesMap<typeof messageIds>,
  journeyInstances: ZetkinJourneyInstance[],
  tagColumns: JourneyTagColumnData[]
): GridColDef[] => {
  const staticColumns = getStaticColumns(messages, journeyInstances);
  return (
    staticColumns
      .splice(0, 2)
      .concat(getTagColumns(messages, journeyInstances, tagColumns))
      // Add/override common props
      .concat(staticColumns)
      .map((col) => ({
        minWidth: 50,
        width: 200,
        ...col,
      }))
  );
};

export default getColumns;
