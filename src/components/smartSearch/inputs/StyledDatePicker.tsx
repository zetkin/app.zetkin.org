import makeStyles from '@mui/styles/makeStyles';
import { TextField } from '@mui/material';
import DatePicker, { DatePickerProps } from '@mui/lab/DatePicker';


const useStyles = makeStyles((theme) => ({
    MuiInput: {
        fontSize: theme.typography.h4.fontSize,
        width: '14rem',
    },
    MuiTextField: {
        fontSize: theme.typography.h4.fontSize,
        verticalAlign: 'inherit',
    },
    input: {
        padding: 0,
    },
}));

const StyledDatePicker: React.FC<Omit<DatePickerProps, 'renderInput'>> = (props): React.ReactElement => {
    const classes = useStyles();
    return (
        <DatePicker
            inputFormat="yyyy-MM-dd"
            renderInput={ (props) => (
                <TextField className={ classes.MuiTextField } id="date-picker-inline"
                    { ...props }
                    InputProps={{ className: classes.MuiInput, ...props.InputProps }}
                    inputProps={{ className: classes.input , ...props.inputProps }}
                />
            ) }
            { ...props }
        />
    );
};

export default StyledDatePicker;
