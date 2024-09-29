import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

type TButton = {
  disabled?: boolean;
  name: string;
  value: string;
};

type TLabelPlacement = 'start' | 'end' | 'top' | 'bottom';
type TRadioGroupDirection = 'row' | 'column';
type TButtonSize = 'small' | 'medium' | 'large';

const sizes: Record<TButtonSize, number> = {
  large: 40,
  medium: 32,
  small: 24,
};

interface ZUIRadioButtonProps {
  defaultValue: TButton['value'];
  direction: TRadioGroupDirection;
  disabled: boolean;
  formLabel: string;
  helperText: string;
  labelPlacement: TLabelPlacement;
  onChange?: (newValue: TButton['value']) => void;
  options: TButton[];
  name: string;
  size: TButtonSize;
}

const ZUIRadioGroup = ({
  defaultValue,
  direction,
  disabled,
  formLabel,
  helperText,
  labelPlacement,
  name,
  onChange,
  options,
  size,
}: ZUIRadioButtonProps) => {
  return (
    <Typography variant="bodyMdSemiBold">
      <FormControl disabled={disabled}>
        <FormLabel>{formLabel}</FormLabel>
        <RadioGroup
          aria-labelledby={name}
          defaultValue={defaultValue}
          name={name}
          onChange={(e) => {
            onChange && onChange(e.target.value);
          }}
          row={direction === 'row'}
        >
          {options.map((button: TButton) => {
            return (
              <FormControlLabel
                key={button.name}
                control={<Radio />}
                disabled={button.disabled}
                label={button.name}
                labelPlacement={labelPlacement}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: sizes[size],
                  },
                }} //https://mui.com/material-ui/react-radio-button/#size
                value={button.value}
              />
            );
          })}
        </RadioGroup>
        <FormLabel>{helperText}</FormLabel>
      </FormControl>
    </Typography>
  );
};

export default ZUIRadioGroup;
