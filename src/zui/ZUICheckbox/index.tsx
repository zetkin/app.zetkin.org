import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface ZUICheckboxProps {
  checked: boolean;
  size: TSize;
}

// Todo: MUI checkbox doesn't allow size large. Use fontsize pixels instead
// see https://mui.com/material-ui/react-checkbox/#size
type TSize = 'small' | 'medium' | 'large';

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
