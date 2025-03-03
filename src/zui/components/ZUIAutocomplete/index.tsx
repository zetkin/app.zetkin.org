import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
  Autocomplete,
  Checkbox,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  SvgIconTypeMap,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC, HTMLAttributes } from 'react';

type Option = {
  label: string;
  subtitle?: string;
};

type ZUIAutocompleteProps = {
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
   * If true, user can select multiple options.
   */
  multiple?: boolean;

  /**
   * The function that runs when an option is selected.
   * If the multiple property is "true" the newValue will be an array,
   * otherwise a single object.
   */
  onChange: (newValue: Option | Option[]) => void;

  /**
   * The options the user can select from.
   */
  options: Option[];

  /**
   * The value of the autoselect.
   * If the multiple property is "true" value should be an array,
   * otherwise a single object.
   */
  value: Option | Option[] | null;
};

const ZUIAutocomplete: FC<ZUIAutocompleteProps> = ({
  action,
  checkboxes,
  multiple,
  onChange,
  options,
  value,
}) => {
  const theme = useTheme();

  return (
    <Autocomplete
      multiple={multiple}
      onChange={(ev, newValue) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      options={options}
      PaperComponent={({ children }) => {
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
      }}
      renderInput={(params) => <TextField {...params} />}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } =
          props as HTMLAttributes<HTMLLIElement> & { key: string };
        return (
          <ListItem key={key} {...optionProps}>
            {checkboxes && (
              <Checkbox
                checked={selected}
                checkedIcon={<CheckBox fontSize="small" />}
                icon={<CheckBoxOutlineBlank fontSize="small" />}
              />
            )}
            <ListItemText
              disableTypography
              primary={
                <Typography variant="labelXlMedium">{option.label}</Typography>
              }
              secondary={
                option.subtitle ? (
                  <Typography
                    color="secondary"
                    fontFamily={theme.typography.fontFamily}
                    fontSize="0.875rem"
                    fontWeight={400}
                    letterSpacing="3%"
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
      size="small"
      sx={{
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
      }}
      value={value}
    />
  );
};

export default ZUIAutocomplete;
