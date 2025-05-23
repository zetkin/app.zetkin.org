import {
  IconButton,
  InputAdornment,
  SvgIconTypeMap,
  TextField,
} from '@mui/material';
import { FC, HTMLInputTypeAttribute } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { ZUILarge, ZUIMedium } from '../types';

type ZUITextFieldProps = {
  /**
   * Identifies the element (or elements) that describes the object.
   */
  ariaDescribedBy?: string;

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
   * If the text field should be full width.
   *
   * Defaults to "false".
   */
  fullWidth?: boolean;

  /**
   * Text that displays below the textfield, used
   * to help the user.
   */
  helperText?: string;

  /**
   * The id of the text field.
   * Use this prop to make label and helperText readable
   * for screen readers.
   */
  id?: string;

  /**
   * If the text field should be initiated with a specific value.
   * Only use when component is uncontrolled.
   */
  initialValue?: string;

  /**
   * The label of the textfield
   */
  label?: string;

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
   * The name of the html input element.
   */
  name?: string;

  /**
   * Function that runs when the content of the textfield changes.
   */
  onChange?: (newValue: string) => void;

  /**
   * Function that runs when clicking the end icon.
   */
  onEndIconClick?: () => void;

  /**
   * Text to display inside the textfield when it is empty.
   */
  placeholder?: string;

  /**
   * If the text field is required. Used in forms.
   *
   * Defaults to "false".
   */
  required?: boolean;

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
   * The type of the input field.
   */
  type?: HTMLInputTypeAttribute;

  /**
   * The value of the textfield.
   */
  value?: string;
};

const ZUITextField: FC<ZUITextFieldProps> = ({
  ariaDescribedBy,
  disabled = false,
  endIcon: EndIcon,
  error = false,
  fullWidth = false,
  helperText,
  id,
  initialValue,
  label,
  maxRows = 5,
  multiline = false,
  name,
  onChange,
  onEndIconClick,
  placeholder,
  required = false,
  size = 'medium',
  startIcon: StartIcon,
  type,
  value,
}) => (
  <TextField
    defaultValue={initialValue}
    disabled={disabled}
    error={error}
    fullWidth={fullWidth}
    helperText={helperText}
    id={id}
    label={label}
    maxRows={maxRows}
    multiline={multiline}
    name={name}
    onChange={(ev) => {
      if (onChange) {
        onChange(ev.target.value);
      }
    }}
    placeholder={placeholder}
    required={required}
    rows={maxRows < 5 ? maxRows : 5}
    size={size == 'medium' ? 'small' : 'medium'}
    slotProps={{
      htmlInput: {
        'aria-describedby': ariaDescribedBy,
        sx: (theme) => ({
          fontFamily: theme.typography.fontFamily,
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '1%',
          lineHeight: '1.5rem',
          paddingX: '0.75rem',
          paddingY: size == 'medium' ? '0.594rem' : '',
        }),
      },
      input: {
        endAdornment: EndIcon ? (
          <InputAdornment position="end">
            {onEndIconClick ? (
              <IconButton onClick={onEndIconClick}>
                <EndIcon fontSize="small" />
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
      ' textarea': {
        paddingX: 0,
      },
      '& .MuiFormHelperText-root': {
        marginX: '0.75rem',
      },
      '& > label': {
        fontFamily: theme.typography.fontFamily,
        fontSize: '1rem',
        fontWeight: '500',
        letterSpacing: '3%',
        transform: `translate(0.688rem, ${
          size == 'medium' ? '0.563rem' : '1rem'
        })`,
      },
      '& > label[data-shrink="true"]': {
        color: error ? theme.palette.error.main : theme.palette.secondary.main,
        fontSize: '0.813rem',
        transform: 'translate(0.688rem, -0.625rem)',
      },
      '& >.MuiFormHelperText-root': {
        fontFamily: theme.typography.fontFamily,
        fontSize: '0.813rem',
        fontWeight: 400,
        letterSpacing: '3%',
        lineHeight: '1.219rem',
      },
      '& >.MuiInputBase-root > fieldset > legend > span': label
        ? {
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.813rem',
            fontWeight: '500',
            letterSpacing: '3%',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
          }
        : '',
      '& fieldset': {
        paddingLeft: '0.375rem',
      },
    })}
    type={type}
    value={value}
    variant="outlined"
  />
);

export default ZUITextField;
