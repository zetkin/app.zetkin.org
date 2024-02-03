import { GridFilterInputValueProps } from '@mui/x-data-grid-pro';
import { JSXElementConstructor } from 'react';
import { FormControl, InputLabel, Select } from '@mui/material';

const FilterValueSelect: JSXElementConstructor<
  GridFilterInputValueProps & {
    label?: string;
    options?: { id: number; title: string }[];
  }
> = ({ applyValue, item, label, options }) => {
  return (
    <FormControl variant="standard">
      <InputLabel>{label}</InputLabel>
      <Select
        native
        onChange={(event) => applyValue({ ...item, value: event.target.value })}
        value={item.value}
        variant="standard"
      >
        <option value="" />
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
