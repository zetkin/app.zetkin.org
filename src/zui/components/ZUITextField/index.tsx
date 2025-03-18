import {
  IconButton,
  InputAdornment,
  SvgIconTypeMap,
  TextField,
} from '@mui/material';
import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { ZUILarge, ZUIMedium } from '../types';

type ZUITextFieldProps = {
  /**
   * If the textfield is disabled or not.
   */
  disabled?: boolean;

  /**
   * An icon to be displayed at the end of the textfield.
   */
  endIcon?: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;

  /**
   * If there is an error in the texfield.
   */
  error?: boolean;

  /**
   * Text that displays below the textfield, used
   * to help the user.
   */
  helperText?: string;

  /**
   * The label of the textfield
   */
  label: string;

  /**
   * How many rows a multiline textfield can be before it starts scrolling.
   * This does not limit the length of text that can be input.
   *
   * Height of multiline textfield defaults to 5. If maxRows is set to a number
   * lower than 5, the height will adjust to that number of rows.
   */
  maxRows?: number;

  /**
   * If the textfield is for mutli line input.
   */
  multiline?: boolean;

  /**
   * Function that runs when the content of the textfield changes.
   */
  onChange: (newValue: string) => void;

  /**
   * Function that runs when clicking the end icon.
   */
  onEndIconClick?: () => void;

  /**
   * Text to display inside the textfield when it is empty.
   */
  placeholder?: string;

  /**
   * The height of the textfield. Defaults to 'medium'.
   */
  size?: ZUILarge | ZUIMedium;

  /**
   * An icon to be displayed at the start of the textfield.
   */
  startIcon?: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;

  /**
   * The value of the textfield.
   */
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
  onEndIconClick,
  placeholder,
  size = 'medium',
  startIcon: StartIcon,
  value,
}) => (
  <TextField
    disabled={disabled}
    error={error}
    helperText={helperText}
    label={label}
    maxRows={maxRows}
    multiline={multiline}
    onChange={(ev) => onChange(ev.target.value)}
    placeholder={placeholder}
    rows={maxRows < 5 ? maxRows : 5}
    size={size == 'medium' ? 'small' : 'medium'}
    slotProps={{
      htmlInput: {
        sx: (theme) => ({
          fontFamily: theme.typography.fontFamily,
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '1%',
          lineHeight: '1.5rem',
        }),
      },
      input: {
        endAdornment: EndIcon ? (
          <InputAdornment position="end">
            {onEndIconClick ? (
              <IconButton onClick={onEndIconClick}>
                <EndIcon />
              </IconButton>
            ) : (
              <EndIcon fontSize="small" />
            )}
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
      },
    }}
    sx={(theme) => ({
      '& > label': {
        fontFamily: theme.typography.fontFamily,
        fontSize: '1rem',
        fontWeight: '500',
        letterSpacing: '3%',
        transform: `translate(0.875rem, ${
          size == 'medium' ? '0.563rem' : '1rem'
        })`,
      },
      '& > label[data-shrink="true"]': {
        color: error ? theme.palette.error.main : theme.palette.secondary.main,
        fontSize: '0.813rem',
        transform: 'translate(0.813rem, -0.625rem)',
      },
      '& >.MuiFormHelperText-root': {
        fontFamily: theme.typography.fontFamily,
        fontSize: '0.813rem',
        fontWeight: 400,
        letterSpacing: '3%',
        lineHeight: '1.219rem',
      },
      '& >.MuiInputBase-root > fieldset > legend > span': {
        fontFamily: theme.typography.fontFamily,
        fontSize: '0.813rem',
        fontWeight: '500',
        letterSpacing: '3%',
        paddingLeft: '0.25rem',
        paddingRight: '0.25rem',
      },
      '& >.MuiInputBase-root > input': {
        paddingY: size == 'medium' ? '0.594rem' : '',
      },
    })}
    value={value}
    variant="outlined"
  />
);

export default ZUITextField;
