import { FormattedMessage as Msg } from 'react-intl';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { Chip, makeStyles, TextField } from '@material-ui/core';
import { Theme, Tooltip } from '@material-ui/core';

import { getEllipsedString } from 'utils/stringUtils';

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
      noOptionsText={<Msg id="misc.smartSearch.misc.noOptions" />}
      renderInput={(params) => (
        <TextField
          className={classes.MuiTextField}
          {...params}
          inputProps={{
            ...params.inputProps,
            className: classes.MuiInput,
          }}
        />
      )}
      renderOption={(item) => {
        const shortenedLabel = getEllipsedString(item.title, 15);
        return shortenedLabel.length === item.title.length ? (
          <Chip
            key={item.id}
            color="primary"
            label={item.title}
            variant="outlined"
          />
        ) : (
          <Tooltip key={item.id} title={item.title}>
            <Chip color="primary" label={shortenedLabel} variant="outlined" />
          </Tooltip>
        );
      }}
      renderTags={() => null}
      {...props}
    />
  );
};

export default StyledItemSelect;
