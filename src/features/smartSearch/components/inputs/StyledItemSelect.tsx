import makeStyles from '@mui/styles/makeStyles';
import { Autocomplete, AutocompleteProps, Box } from '@mui/material';
import { Chip, TextField } from '@mui/material';
import { Theme, Tooltip } from '@mui/material';

import { getEllipsedString } from 'utils/stringUtils';
import { Msg } from 'core/i18n';

import messageIds from 'features/smartSearch/l10n/messageIds';

const useStyles = makeStyles<Theme>((theme) => ({
  MuiInput: {
    fontSize: theme.typography.h4.fontSize,
    padding: 0,
    width: '10rem',
  },
  MuiTextField: {
    display: 'inline',
    verticalAlign: 'inherit',
  },
  autocomplete: {
    display: 'inline',
  },
}));

interface StyledItem {
  id: number;
  title: string;
}

type StyledItemSelectProps = Omit<
  AutocompleteProps<StyledItem, true, true, false>,
  'renderInput'
>;

const StyledItemSelect = (props: StyledItemSelectProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Autocomplete
      className={classes.autocomplete}
      disableClearable
      getOptionLabel={(item) => item.title}
      multiple
      noOptionsText={<Msg id={messageIds.misc.noOptions} />}
      renderInput={(params) => (
        <TextField
          className={classes.MuiTextField}
          {...params}
          inputProps={{
            ...params.inputProps,
            className: classes.MuiInput,
          }}
          variant="standard"
        />
      )}
      renderOption={(optionProps, item) => {
        const title = item.title || '';
        const shortenedLabel = getEllipsedString(title, 15);
        return (
          <Box component="li" {...optionProps}>
            {shortenedLabel.length === title.length ? (
              <Chip
                key={item.id}
                color="primary"
                label={item.title}
                variant="outlined"
              />
            ) : (
              <Tooltip key={item.id} title={item.title}>
                <Chip
                  color="primary"
                  label={shortenedLabel}
                  variant="outlined"
                />
              </Tooltip>
            )}
          </Box>
        );
      }}
      renderTags={() => null}
      {...props}
    />
  );
};

export default StyledItemSelect;
