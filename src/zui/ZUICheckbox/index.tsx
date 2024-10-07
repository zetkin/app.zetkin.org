import { FormControlLabel, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { FC } from 'react';

type Sizes = 'small' | 'medium' | 'large';

const sizes: Record<Sizes, string> = {
  large: '1.75rem',
  medium: '1.5rem',
  small: '1.25rem',
};

interface ZUICheckboxProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  labelPlacement?: 'bottom' | 'end' | 'start' | 'top';
  onChange: (newCheckedState: boolean) => void;
  size: Sizes;
}

const ZUICheckbox: FC<ZUICheckboxProps> = ({
  checked,
  disabled = false,
  onChange,
  label,
  labelPlacement = 'end',
  size = 'medium',
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(ev, newCheckedState) => onChange(newCheckedState)}
        />
      }
      disabled={disabled}
      label={
        <Typography
          sx={(theme) => ({
            color: disabled ? theme.palette.text.disabled : '',
          })}
          variant="labelXlMedium"
        >
          {label}
        </Typography>
      }
      labelPlacement={labelPlacement}
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: sizes[size],
        },
      }}
    />
  );
};

export default ZUICheckbox;
