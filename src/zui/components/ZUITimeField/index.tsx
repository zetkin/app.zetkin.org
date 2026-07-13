import { TimeField } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { FC } from 'react';

type ZUITimeFieldProps = {
  /**
   * The label of the time field.
   */
  label: string;

  /**
   * The functiont that runs when a change happens in the time field.
   */
  onChange: (newTime: Dayjs | null) => void;

  /**
   * The value of the time field.
   */
  value: Dayjs | null;
};

const ZUITimeField: FC<ZUITimeFieldProps> = ({ label, onChange, value }) => {
  return (
    <TimeField
      label={label}
      onChange={(newTime) => onChange(newTime)}
      slotProps={{
        textField: {
          sx: (theme) => ({
            '& > label': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '1rem',
              fontWeight: '500',
              letterSpacing: '3%',
              transform: `translate(0.875rem, 0.563rem)`,
            },
            '& > label[data-shrink="true"]': {
              color: theme.palette.secondary.main,
              fontSize: '0.813rem',
              transform: 'translate(0.813rem, -0.625rem)',
            },
            '& >.MuiFormHelperText-root': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.813rem',
              fontWeight: 400,
              letterSpacing: '3%',
              lineHeight: '1.219rem',
            },
            '& >.MuiInputBase-root > fieldset > legend > span': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.813rem',
              fontWeight: '500',
              letterSpacing: '3%',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
            },
            '& >.MuiInputBase-root > input': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '1%',
              lineHeight: '1.5rem',
              paddingY: '0.594rem',
            },
          }),
        },
      }}
      value={value}
    />
  );
};

export default ZUITimeField;
