import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface ZUICheckboxProps {
  checked: boolean;
  size: Size;
}

enum Size {
  small,
  medium,
  large,
}

const ZUICheckbox: React.FunctionComponent<ZUICheckboxProps> = (
  { checked },
  { size }
) => {
  if (checked) {
    return (
      <div>
        <Checkbox {...label} checked={checked} size={size} />
        <Checkbox {...label} checked disabled size={size} />
      </div>
    );
  } else {
    return (
      <div>
        <Checkbox {...label} checked={checked} size={size} />
        <Checkbox {...label} disabled size={size} />
      </div>
    );
  }
};

export default ZUICheckbox;

/*
import { FormattedDate } from 'react-intl';

interface ZUIDateProps {
  datetime: string; // iso datetime string
}

const ZUIDate: React.FunctionComponent<ZUIDateProps> = ({ datetime }) => {
  return (
    <FormattedDate day="numeric" month="long" value={datetime} year="numeric" />
  );
};

export default ZUIDate;
*/
