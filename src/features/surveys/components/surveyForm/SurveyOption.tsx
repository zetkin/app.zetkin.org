import { FC } from 'react';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';

export type SurveyOptionProps = FormControlLabelProps;

const SurveyOption: FC<SurveyOptionProps> = ({ ...formControlLabelProps }) => {
  return (
    <FormControlLabel
      {...formControlLabelProps}
      sx={{
        '&:has(.Mui-checked)': {
          '&, & + .MuiFormControlLabel-label': {
            backgroundColor: '#fbcbd8',
            borderRadius: '50px',
          },
        },
      }}
    />
  );
};

export default SurveyOption;
