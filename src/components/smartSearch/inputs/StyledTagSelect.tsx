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

type StyledTagSelectProps = Omit<AutocompleteProps<ZetkinTag, true, undefined, false>, 'renderInput'>

const StyledTagSelect = (props: StyledTagSelectProps): JSX.Element => {
    const classes = useStyles();
    return (
        <Autocomplete
            className={ classes.autocomplete }
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
            renderTags={ (value, getTagProps) =>
                value.map((tag, index) => (
                    <Chip
                        key={ tag.id }
                        label={ tag.title }
                        variant="outlined"
                        { ...getTagProps({ index }) }
                    />
                ))
            }
            { ...props }
        />
    );
};

export default StyledTagSelect;
