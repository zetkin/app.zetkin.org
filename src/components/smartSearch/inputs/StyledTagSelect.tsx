import { Theme } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { Chip, makeStyles } from '@material-ui/core';

import StyledTextInput from './StyledTextInput';
import { ZetkinTag } from 'types/zetkin';

const useStyles = makeStyles<Theme>((theme) => ({
    autocomplete: {
        display: 'inline',
    },
    input: {
        lineHeight: theme.typography.h4.lineHeight,
        verticalAlign: 'middle',
        width: 'auto',
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
            renderInput={ (params) => (
                <StyledTextInput { ...params } className={ classes.input }/>
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
