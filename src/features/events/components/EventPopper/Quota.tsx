import { FC } from 'react';
import { Typography } from '@mui/material';

interface QuotaProps {
  denominator: number;
  numerator: number;
}

const Quota: FC<QuotaProps> = ({ numerator, denominator }) => {
  return (
    <Typography
      color={denominator > numerator ? 'red' : 'secondary'}
    >{`${numerator}/${denominator}`}</Typography>
  );
};

export default Quota;
