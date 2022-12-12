import { GridFilterInputValueProps } from '@mui/x-data-grid-pro';
import { JSXElementConstructor } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { FormControl, InputLabel, Select } from '@mui/material';

const FilterValueSelect: JSXElementConstructor<
  GridFilterInputValueProps & {
    labelMessageId?: string;
    options?: { id: number; title: string }[];
  }
> = ({ applyValue, item, labelMessageId, options }) => {
  return (
    <FormControl variant="standard">
      <InputLabel>
        <Msg id={labelMessageId} />
      </InputLabel>
      <Select
        native
        onChange={(event) => applyValue({ ...item, value: event.target.value })}
        value={item.value}
        variant="standard"
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
