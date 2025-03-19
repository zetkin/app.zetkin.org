import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FilterOptionsState,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  SvgIconTypeMap,
  TextField,
  Typography,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC } from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type Option = {
  /**
   * The name of the option.
   */
  label: string;

  /**
   * Will render to the left of the option label.
   * Use an icon or a ZUIAvatar for example.
   */
  picture?: JSX.Element;

  /**
   * Subtitle of the option.
   */
  subtitle?: string;
};

type AutocompleteBaseProps = {
  /**
   * This renders an action below the list of options, always visible.
   */
  action?: {
    icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
    label: string;
    onClick: () => void;
  };

  /**
   * If true a checkbox will be rendered next to each option.
   */
  checkboxes?: boolean;

  /**
   * A function that performs custom logic when searching for options.
   */
  filterOptions?: (
    options: Option[],
    state: FilterOptionsState<Option>
  ) => Option[];

  /**
   * The label of the autocomplete.
   */
  label: string;

  /**
   * Custom message for the message that shows if the user types in a
   * search that does not match any option.
   */
  noOptionsText?: string;

  /**
   * The options the user can select from.
   */
  options: Option[];
};

type ValueProps<TValue, TMultiple> = {
  /**
   * If true, value must be an array, and then user can select multiple options.
   */
  multiple: TMultiple;

  /**
   * The function that runs when an option is selected.
   */
  onChange: (newValue: TValue) => void;

  /**
   * The value of the autocomplete.
   */
  value: TValue;
};

type Props = AutocompleteBaseProps &
  (ValueProps<Option[], true> | ValueProps<Option | null, false>);

const ZUIAutocomplete: FC<Props> = ({
  action,
  checkboxes,
  filterOptions,
  label,
  multiple,
  noOptionsText,
  onChange,
  options,
  value,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Autocomplete
      filterOptions={filterOptions}
      multiple={multiple}
      noOptionsText={
        <Typography sx={{ fontStyle: 'italic' }} variant="labelXlMedium">
          {noOptionsText || messages.autocomplete.noOptionsDefaultText()}
        </Typography>
      }
      onChange={(ev, newValue) => {
        if (Array.isArray(newValue) != multiple) {
          throw new Error(
            'When "multiple" is true, newValue must be an array.'
          );
        }

        if (multiple) {
          onChange(newValue as Option[]);
        } else {
          onChange(newValue as Option | null);
        }
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={(theme) => ({
            '& > label': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '1rem',
              fontWeight: '500',
              letterSpacing: '3%',
            },
            '& > label[data-shrink="true"]': {
              color: theme.palette.secondary.main,
              fontSize: '0.813rem',
              transform: 'translate(0.813rem, -0.625rem)',
            },
            '& >.MuiInputBase-root > .MuiAutocomplete-endAdornment': {
              top: multiple ? '1.75rem' : '48%',
            },
            '& >.MuiInputBase-root > fieldset > legend > span': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.813rem',
              fontWeight: '500',
              letterSpacing: '3%',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
            },
            '& >.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
              paddingY: '0.438rem',
            },
          })}
        />
      )}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <ListItem key={key} {...optionProps}>
            {(multiple || checkboxes) && (
              <Checkbox
                checked={selected}
                checkedIcon={<CheckBox fontSize="small" />}
                icon={<CheckBoxOutlineBlank fontSize="small" />}
              />
            )}
            {option.picture && (
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingRight: '0.5rem',
                }}
              >
                {option.picture}
              </Box>
            )}
            <ListItemText
              disableTypography
              primary={
                <Typography variant="labelXlMedium">{option.label}</Typography>
              }
              secondary={
                option.subtitle ? (
                  <Typography
                    sx={(theme) => ({
                      color: theme.palette.secondary.main,
                      fontFamily: theme.typography.fontFamily,
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      letterSpacing: '3%',
                    })}
                  >
                    {option.subtitle}
                  </Typography>
                ) : (
                  ''
                )
              }
            />
          </ListItem>
        );
      }}
      size={multiple ? 'medium' : 'small'}
      slots={{
        paper: ({ children }) => {
          return (
            <Paper
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {children}
              {action && [
                <Divider key="divider" />,
                <ListItem
                  key="action"
                  onClick={action.onClick}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemIcon>
                    <action.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="labelXlMedium">
                        {action.label}
                      </Typography>
                    }
                  />
                </ListItem>,
              ]}
            </Paper>
          );
        },
      }}
      sx={(theme) => ({
        '& .MuiChip-root': {
          color: theme.palette.text.primary,
        },
        '& .MuiFormControl-root.MuiFormControl-fullWidth div.MuiInputBase-root':
          {
            paddingLeft: '0.375rem',
            paddingRight:
              (Array.isArray(value) && value.length == 0) || !value
                ? '2.5rem'
                : '3.75rem',
          },
        '& .MuiFormControl-root.MuiFormControl-fullWidth div.MuiInputBase-root input':
          {
            paddingLeft: '0.375rem',
          },
        '& .MuiIconButton-root, .MuiIconButton-root * ': {
          height: '1.25rem',
          width: '1.25rem',
        },
        '& input': {
          fontFamily: theme.typography.fontFamily,
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '3%',
        },
      })}
      value={value}
    />
  );
};

export default ZUIAutocomplete;
