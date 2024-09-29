import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface ZUICheckboxProps {
  checked: boolean;
  size: TSize;
}

type TSize = 'small' | 'medium' | 'large';

// enum Size {
//   small,
//   medium,
//   large,
// }

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
