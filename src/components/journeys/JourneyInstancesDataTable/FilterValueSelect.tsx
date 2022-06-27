import { GridFilterInputValueProps } from '@mui/x-data-grid-pro';
import { JSXElementConstructor } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { FormControl, InputLabel, Select } from '@material-ui/core';

import { ZetkinPerson } from 'types/zetkin';

const FilterValueSelect: JSXElementConstructor<
  GridFilterInputValueProps & { subjects?: ZetkinPerson[] }
> = ({ applyValue, item, subjects }) => {
  return (
    <FormControl>
      <InputLabel>
        <Msg id="misc.journeys.journeyInstancesFilters.personLabel" />
      </InputLabel>
      <Select
        native
        onChange={(event) => applyValue({ ...item, value: event.target.value })}
        value={item.value}
      >
        <option value=""></option>
        {subjects?.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {`${subject.first_name} ${subject.last_name}`}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterValueSelect;
