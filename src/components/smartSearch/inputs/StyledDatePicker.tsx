import makeStyles from '@mui/styles/makeStyles';
import { DatePicker, DatePickerProps } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
    MuiDatePicker: {
        display: 'inline',
        verticalAlign: 'inherit',
    },
    input: {
        fontSize: theme.typography.h4.fontSize,
        padding: 0,
        width: '12rem',
    },
}));

const StyledDatePicker: React.FC<DatePickerProps> = (props): React.ReactElement => {
    const classes = useStyles();
    return (
        <DatePicker
            className={ classes.MuiDatePicker }
            disableToolbar
            format="yyyy-MM-dd"
            id="date-picker-inline"
            inputProps={{ className: classes.input }}
            variant="inline"
            { ...props }
        />
    );
};

export default StyledDatePicker;
