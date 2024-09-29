import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface ZUICheckboxProps {
  checked: boolean;
  size: TSize;
}

// TODO: fix that MUI checkbox does not allow large out of the box
type TSize = 'small' | 'medium';

const ZUICheckbox: React.FunctionComponent<ZUICheckboxProps> = ({
  checked,
  size,
}) => {
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
