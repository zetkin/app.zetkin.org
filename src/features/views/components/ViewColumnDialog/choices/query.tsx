import { PersonSearch, Search } from '@mui/icons-material';

import { CHOICES } from './types';
import { ColumnChoice } from './types';
import LocalQueryConfig from '../LocalQueryConfig';
import SingleIconCardVisual from '../SingleIconCardVisual';
import theme from 'theme';
import { ZetkinQuery } from 'utils/types/zetkin';
import {
  CallHistoryFilterConfig,
  FILTER_TYPE,
  OPERATION,
} from 'features/smartSearch/components/types';
import { COLUMN_TYPE, SelectedViewColumn, ZetkinViewColumn } from '../../types';

const { blue } = theme.palette.viewColumnGallery;

export const customQuery: ColumnChoice = {
  color: blue,
  isRestricted: true,
  renderCardVisual: (color: string) => {
    return <SingleIconCardVisual color={color} icon={PersonSearch} />;
  },
  renderConfigForm: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => <LocalQueryConfig onOutputConfigured={props.onOutputConfigured} />,
};

function createQueryChoice(
  key: CHOICES,
  filterSpec: ZetkinQuery['filter_spec']
): ColumnChoice {
  return {
    color: blue,
    defaultColumns: (intl) => [
      {
        config: {
          filter_spec: filterSpec,
        },
        title: intl.formatMessage({
          id: `misc.views.columnDialog.choices.${key}.columnTitle`,
        }),
        type: COLUMN_TYPE.LOCAL_QUERY,
      },
    ],
    isRestricted: true,
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={Search} />;
    },
  };
}

export const booked = createQueryChoice(CHOICES.QUERY_BOOKED, [
  {
    config: {
      after: 'now',
      operator: 'in',
      state: 'booked',
    },
    op: OPERATION.ADD,
    type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
  },
  {
    config: {
      after: 'now',
      operator: 'in',
      state: 'booked',
    },
    op: OPERATION.ADD,
    type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
  },
]);

export const reached = createQueryChoice(CHOICES.QUERY_REACHED, [
  {
    config: {
      operator: 'reached',
    } as CallHistoryFilterConfig,
    op: OPERATION.ADD,
    type: FILTER_TYPE.CALL_HISTORY,
  },
]);

export const participated = createQueryChoice(CHOICES.QUERY_PARTICIPATED, [
  {
    config: {
      before: 'now',
      operator: 'in',
      state: 'booked',
    },
    op: OPERATION.ADD,
    type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
  },
]);
