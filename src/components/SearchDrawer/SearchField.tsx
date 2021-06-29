import { ChangeEventHandler, FocusEventHandler, FunctionComponent, KeyboardEventHandler  } from 'react';

import Search from '@material-ui/icons/Search';
import { useIntl } from 'react-intl';
import {
    InputAdornment,
    makeStyles,
    TextField,
} from '@material-ui/core';


interface SearchFieldProps {
    onChange: ChangeEventHandler<HTMLInputElement>;
    onFocus: FocusEventHandler<HTMLInputElement>;
    onKeyUp: KeyboardEventHandler<HTMLInputElement>;
}


const useStyles = makeStyles(() => ({
    textField: {
        width: '100%',
    },
}));

const SearchField: FunctionComponent<SearchFieldProps> = ({
    onChange,
    onFocus,
    onKeyUp,
}): JSX.Element => {
    const classes = useStyles();
    const intl = useIntl();

    return (
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
            onChange={ onChange }
            onFocus={ onFocus }
            onKeyUp={ onKeyUp }
            placeholder={ intl.formatMessage({
                id: 'layout.organize.search.placeholder',
            }) }
            size="small"
            variant="outlined"
        />
    );
};

export default SearchField;
