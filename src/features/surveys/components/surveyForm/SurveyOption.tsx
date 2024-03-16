import { FC } from 'react';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';

export type SurveyOptionProps = FormControlLabelProps;

const SurveyOption: FC<SurveyOptionProps> = ({ ...formControlLabelProps }) => {
  return (
    <FormControlLabel
      {...formControlLabelProps}
      sx={{
        '&:not(.Mui-checked)': {
          '&, & + .MuiFormControlLabel-label': {
            backgroundColor: '#f3f3f3',
            borderRadius: '50px',
          },
        },
        // :has(.Mui-checked) needs to be after :not(.Mui-checked) and the
        // sort-keys lint rule is disabled to allow this.
        // eslint-disable-next-line sort-keys
        '&:has(.Mui-checked)': {
          '&, & + .MuiFormControlLabel-label': {
            backgroundColor: '#fbcbd8',
            borderRadius: '50px',
          },
        },
        '.MuiFormControlLabel-label': {
          width: '100%',
        },
        margin: 0,
      }}
    />
  );
};

export default SurveyOption;
