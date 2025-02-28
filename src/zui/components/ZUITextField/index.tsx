import {
  InputAdornment,
  SvgIconTypeMap,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { ZUILarge, ZUIMedium } from '../types';

type ZUITextFieldProps = {
  disabled?: boolean;
  endIcon?: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  error?: boolean;
  helperText?: string;
  label: string;
  maxRows?: number;
  multiline?: boolean;
  onChange: (newValue: string) => void;
  placeholder?: string;
  size?: ZUILarge | ZUIMedium;
  startIcon?: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  value: string;
};

const ZUITextField: FC<ZUITextFieldProps> = ({
  disabled = false,
  endIcon: EndIcon,
  error = false,
  helperText,
  label,
  maxRows = 5,
  multiline = false,
  onChange,
  placeholder,
  size = 'medium',
  startIcon: StartIcon,
  value,
}) => {
  const theme = useTheme();

  return (
    <TextField
      disabled={disabled}
      error={error}
      helperText={helperText}
      inputProps={{
        sx: {
          fontFamily: theme.typography.fontFamily,
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '1%',
          lineHeight: '1.5rem',
        },
      }}
      InputProps={{
        endAdornment: EndIcon ? (
          <InputAdornment position="end">
            <EndIcon fontSize="small" />
          </InputAdornment>
        ) : (
          ''
        ),
        startAdornment: StartIcon ? (
          <InputAdornment position="start">
            <StartIcon fontSize="small" />
          </InputAdornment>
        ) : (
          ''
        ),
      }}
      label={<Typography variant="labelSmMedium">{label}</Typography>}
      maxRows={maxRows}
      multiline={multiline}
      onChange={(ev) => onChange(ev.target.value)}
      placeholder={placeholder}
      rows={maxRows < 5 ? maxRows : 5}
      size={size == 'medium' ? 'small' : 'medium'}
      sx={{
        '& >.MuiFormHelperText-root': {
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.813rem',
          fontWeight: 400,
          letterSpacing: '3%',
          lineHeight: '1.219rem',
        },
      }}
      value={value}
      variant="outlined"
    />
  );
};

export default ZUITextField;
