import { makeStyles, TextField, TextFieldProps } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    MuiInput: {
        fontSize: theme.typography.h4.fontSize,
        padding: 0,
        textAlign: 'center',
        width: '5rem',
    },
    MuiSelect: {
        fontSize: theme.typography.h4.fontSize,
        padding: 0,
    },
    MuiTextField: {
        display: 'inline',
        verticalAlign: 'inherit',
    },
}));

const StyledNumberInput: React.FC<TextFieldProps> = (props): JSX.Element => {
    const classes = useStyles();
    return (
        <TextField
            className={ classes.MuiTextField }
            inputProps={{ className: classes.MuiInput }}
            type="number"
            { ...props }
        />
    );
};

export default StyledNumberInput;
