/* eslint-disable react/display-name */
import { ChangeEventHandler, FocusEventHandler, FormEventHandler, forwardRef  } from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Search from '@mui/icons-material/Search';
import { useIntl } from 'react-intl';
import { InputAdornment, TextField } from '@mui/material';

interface SearchFieldProps {
    onChange: ChangeEventHandler<HTMLInputElement>;
    onFocus: FocusEventHandler<HTMLInputElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

const useStyles = makeStyles(() => ({
    textField: {
        width: '100%',
    },
}));

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(({
    onChange,
    onFocus,
    onSubmit,
}, ref) => {
    const classes = useStyles();
    const intl = useIntl();

    return (
        <form onSubmit={ onSubmit }>
            <TextField
                aria-label={ intl.formatMessage({
                    id: 'layout.organize.search.label',
                }) }
                className={ classes.textField }
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                inputRef={ ref }
                onChange={ onChange }
                onFocus={ onFocus }
                placeholder={ intl.formatMessage({
                    id: 'layout.organize.search.placeholder',
                }) }
                size="small"
                variant="outlined"
            />
        </form>
    );
});

export default SearchField;
