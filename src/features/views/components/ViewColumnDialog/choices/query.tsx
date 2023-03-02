import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import {
  Event,
  EventAvailable,
  PersonSearch,
  PhoneInTalk,
} from '@mui/icons-material';

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
  renderCardVisual: (color: string) => {
    return <SingleIconCardVisual color={color} icon={PersonSearch} />;
  },
  renderConfigForm: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => <LocalQueryConfig onOutputConfigured={props.onOutputConfigured} />,
};

function createQueryChoice(
  key:
    | CHOICES.QUERY_BOOKED
    | CHOICES.QUERY_REACHED
    | CHOICES.QUERY_PARTICIPATED,
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>,
  filterSpec: ZetkinQuery['filter_spec']
): ColumnChoice {
  return {
    color: blue,
    defaultColumns: (intl) => [
      {
        config: {
          filter_spec: filterSpec,
        },
        title: intl.columnDialog.choices[key].columnTitle(),
        type: COLUMN_TYPE.LOCAL_QUERY,
      },
    ],
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={icon} />;
    },
  };
}

export const booked = createQueryChoice(CHOICES.QUERY_BOOKED, Event, [
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

export const reached = createQueryChoice(CHOICES.QUERY_REACHED, PhoneInTalk, [
  {
    config: {
      operator: 'reached',
    } as CallHistoryFilterConfig,
    op: OPERATION.ADD,
    type: FILTER_TYPE.CALL_HISTORY,
  },
]);

export const participated = createQueryChoice(
  CHOICES.QUERY_PARTICIPATED,
  EventAvailable,
  [
    {
      config: {
        before: 'now',
        operator: 'in',
        state: 'booked',
      },
      op: OPERATION.ADD,
      type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
    },
  ]
);
