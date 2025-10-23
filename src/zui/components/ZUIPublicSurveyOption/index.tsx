import { FC } from 'react';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';

const ZUIPublicSurveyOption: FC<FormControlLabelProps> = ({
  ...formControlLabelProps
}) => {
  return (
    <FormControlLabel
      {...formControlLabelProps}
      sx={(theme) => ({
        '& .MuiCheckbox-root:hover, .MuiRadio-root:hover': {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.grey[700]
              : theme.palette.grey[100],
        },

        '&:not(.Mui-checked)': {
          '&, & + .MuiFormControlLabel-label': {
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[700]
                  : theme.palette.grey[100],
            },
            backgroundColor:
              theme.palette.mode === 'dark'
                ? theme.palette.grey[800]
                : theme.palette.grey[50],
            borderRadius: '5rem',
          },
        },
        // :has(.Mui-checked) needs to be after :not(.Mui-checked) and the
        // sort-keys lint rule is disabled to allow this.
        // eslint-disable-next-line sort-keys
        '&:has(.Mui-checked)': {
          '&, & + .MuiFormControlLabel-label': {
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[700]
                  : theme.palette.grey[100],
            },
            backgroundColor:
              theme.palette.mode === 'dark'
                ? theme.palette.grey[600]
                : theme.palette.grey[200],
            borderRadius: '5rem',
          },
        },
        '.MuiFormControlLabel-label': {
          width: '100%',
        },
        fontFamily: theme.typography.fontFamily,
        fontSize: '1rem',
        fontWeight: 400,
        letterSpacing: '0.03rem',
        lineHeight: '1.5rem',
        margin: 0,
        wordBreak: 'break-word',
      })}
    />
  );
};

export default ZUIPublicSurveyOption;
