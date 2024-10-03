import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useId } from 'react';

// Infers type of value
type Option = {
  disabled?: boolean;
  label: string;
  value: string;
};

type LabelPlacement = 'start' | 'end' | 'top' | 'bottom';
type Direction = 'row' | 'column';
type Sizes = 'small' | 'medium' | 'large';

const sizes: Record<Sizes, number> = {
  large: 40,
  medium: 32,
  small: 24,
};

interface ZUIRadioButtonProps {
  defaultValue?: Option['value'];
  direction?: Direction;
  disabled?: boolean;
  label: string;
  helperText?: string;
  labelPlacement?: LabelPlacement;
  onChange?: (newValue: Option['value']) => void;
  options: Option[];
  size?: Sizes;
}

const ZUIRadioGroup = ({
  defaultValue,
  direction = 'column',
  disabled,
  label,
  helperText,
  labelPlacement = 'end',
  onChange,
  options,
  size = 'medium',
}: ZUIRadioButtonProps) => {
  const labelId = useId();
  const helperTextId = useId();

  return (
    <Typography variant="bodyMdSemiBold">
      <FormControl disabled={disabled}>
        <FormLabel id={labelId}>{label}</FormLabel>
        <RadioGroup
          aria-describedby={helperTextId}
          aria-labelledby={labelId}
          defaultValue={defaultValue}
          onChange={(e) => {
            onChange && onChange(e.target.value);
          }}
          row={direction === 'row'}
        >
          {options.map((option) => {
            return (
              <FormControlLabel
                key={option.label}
                control={<Radio />}
                disabled={option.disabled}
                label={option.label}
                labelPlacement={labelPlacement}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: sizes[size],
                  },
                }} //https://mui.com/material-ui/react-radio-button/#size
                value={option.value}
              />
            );
          })}
        </RadioGroup>
        <Typography color="GrayText" variant="labelSmMedium">
          {helperText}
        </Typography>
      </FormControl>
    </Typography>
  );
};

export default ZUIRadioGroup;
