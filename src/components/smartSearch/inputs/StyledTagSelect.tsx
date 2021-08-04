import { FormattedMessage as Msg } from 'react-intl';
import { Theme } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { Chip, makeStyles, TextField } from '@material-ui/core';

import { ZetkinTag } from 'types/zetkin';

const useStyles = makeStyles<Theme>((theme) => ({
    MuiInput: {
        fontSize: theme.typography.h4.fontSize,
        padding: 0,
        width: '8rem',
    },
    MuiTextField: {
        display: 'inline',
        verticalAlign: 'inherit',
    },
    autocomplete: {
        display: 'inline',
    },
}));

type StyledTagSelectProps = Omit<AutocompleteProps<ZetkinTag, true, true, false>, 'renderInput'>

const StyledTagSelect = (props: StyledTagSelectProps): JSX.Element => {
    const classes = useStyles();
    return (
        <Autocomplete
            className={ classes.autocomplete }
            disableClearable
            multiple
            noOptionsText={ <Msg id="misc.smartSearch.misc.noOptions"/> }
            renderInput={ (params) => (
                <TextField
                    className={ classes.MuiTextField }
                    { ...params }
                    inputProps={{ ...params.inputProps , className: classes.MuiInput }}
                />
            ) }
            renderOption={ (tag) => (
                <Chip
                    key={ tag.id }
                    color="primary"
                    label={ tag.title }
                    variant="outlined"
                />) }
            renderTags={ () => null }
            { ...props }
        />
    );
};

export default StyledTagSelect;
