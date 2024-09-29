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
  defaultValue: string;
  direction: TRadioGroupDirection;
  disabled: boolean;
  formLabel: string;
  helperText: string;
  labelPlacement: TLabelPlacement;
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
  options,
  size,
}: ZUIRadioButtonProps) => {
  return (
    <Typography variant="bodyMdSemiBold">
      <FormControl disabled={disabled}>
        <FormLabel>{formLabel}</FormLabel>
        <RadioGroup
          row={direction === 'row'}
          aria-labelledby={name}
          defaultValue={defaultValue}
          name={name}
        >
          {options.map((button: TButton) => {
            return (
              <FormControlLabel
                key={button.name}
                disabled={button.disabled}
                value={button.value}
                control={<Radio />}
                label={button.name}
                labelPlacement={labelPlacement}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: sizes[size],
                  },
                }} //https://mui.com/material-ui/react-radio-button/#size
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
