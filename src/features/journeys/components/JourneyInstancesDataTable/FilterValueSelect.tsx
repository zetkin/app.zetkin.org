import { GridFilterInputValueProps } from '@mui/x-data-grid-pro';
import { JSXElementConstructor } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { FormControl, InputLabel, Select } from '@material-ui/core';

const FilterValueSelect: JSXElementConstructor<
  GridFilterInputValueProps & {
    labelMessageId?: string;
    options?: { id: number; title: string }[];
  }
> = ({ applyValue, item, labelMessageId, options }) => {
  return (
    <FormControl>
      <InputLabel>
        <Msg id={labelMessageId} />
      </InputLabel>
      <Select
        native
        onChange={(event) => applyValue({ ...item, value: event.target.value })}
        value={item.value}
      >
        <option value=""></option>
        {options?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterValueSelect;
