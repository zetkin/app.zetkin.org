import { InputLabel, Select } from '@mui/material';
import {
  GridFilterInputValueProps,
  GridFilterOperator,
} from '@mui/x-data-grid-pro';
import { range } from 'lodash';

import { UseMessagesMap } from 'core/i18n';
import messageIds from '../../../l10n/messageIds';

const NONE = 'None';

const FilterSelect = ({
  item,
  label,
  items,
  applyValue,
}: {
  items: { label: string; value: string }[];
  label: string;
} & GridFilterInputValueProps) => {
  return (
    <>
      <InputLabel disableAnimation variant="standard">
        {label}
      </InputLabel>
      <Select
        label={label}
        native
        onChange={(evt) => applyValue({ ...item, value: evt.target.value })}
        value={item.value}
      >
        {items.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </>
  );
};

export const monthOperator = (
  messages: UseMessagesMap<typeof messageIds>['customFilters']
): GridFilterOperator<object, Date> => ({
  InputComponent: FilterSelect,
  InputComponentProps: {
    items: [
      { label: messages.choose(), value: NONE },
      { label: messages.date.month.months.January(), value: '1' },
      { label: messages.date.month.months.February(), value: '2' },
      { label: messages.date.month.months.March(), value: '3' },
      { label: messages.date.month.months.April(), value: '4' },
      { label: messages.date.month.months.May(), value: '5' },
      { label: messages.date.month.months.June(), value: '6' },
      { label: messages.date.month.months.July(), value: '7' },
      { label: messages.date.month.months.August(), value: '8' },
      { label: messages.date.month.months.September(), value: '9' },
      { label: messages.date.month.months.October(), value: '10' },
      { label: messages.date.month.months.November(), value: '11' },
      { label: messages.date.month.months.December(), value: '12' },
    ],
    label: messages.date.month.label(),
  },
  getApplyFilterFn: (filterItem) => {
    if (
      !filterItem.field ||
      !filterItem.value ||
      filterItem.value === NONE ||
      !filterItem.operator
    ) {
      return null;
    }
    return (value): boolean => {
      const itemMonth = value?.getMonth?.() ?? -1;
      const selectedMonth = parseInt(filterItem.value.toString(), 10) - 1;
      return itemMonth === selectedMonth;
    };
  },
  label: messages.date.month.label(),
  value: 'monthMatch',
});

export const dayOfMonthOperator = (
  messages: UseMessagesMap<typeof messageIds>['customFilters']
): GridFilterOperator<object, Date> => ({
  InputComponent: FilterSelect,
  InputComponentProps: {
    items: [
      { label: messages.choose(), value: NONE },
      ...range(1, 32).map((i) => ({
        label: i.toString(),
        value: i.toString(),
      })),
    ],
    label: messages.date.dayOfMonth.label(),
  },
  getApplyFilterFn: (filterItem) => {
    if (
      !filterItem.field ||
      !filterItem.value ||
      filterItem.value === NONE ||
      !filterItem.operator
    ) {
      return null;
    }
    return (value): boolean => {
      const itemDay = value?.getDate?.() ?? -1;
      const selectedDay = parseInt(filterItem.value.toString(), 10);
      return itemDay === selectedDay;
    };
  },
  label: messages.date.dayOfMonth.label(),
  value: 'dayOfMonthMatch',
});
