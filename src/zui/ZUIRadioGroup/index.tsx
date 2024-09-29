import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

type TButton = {
  name: string;
  value: string;
  disabled?: boolean;
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
  name: string;
  formLabel: string;
  options: TButton[];
  labelPlacement: TLabelPlacement;
  disabled: boolean;
  direction: TRadioGroupDirection;
  defaultValue: string;
  size: TButtonSize;
}

const ZUIRadioGroup = ({
  name,
  formLabel,
  options,
  labelPlacement,
  disabled,
  direction,
  defaultValue,
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
      </FormControl>
    </Typography>
  );
};

export default ZUIRadioGroup;
