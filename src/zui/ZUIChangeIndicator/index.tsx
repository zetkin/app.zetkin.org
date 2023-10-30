import { Box } from '@mui/system';
import { Typography } from '@mui/material';

interface ZUIPlainChangeIndicatorProps {
  count: number;
  desc: string;
  fieldName: string;
}
const ZUIPlainChangeIndicator: React.FunctionComponent<
  ZUIPlainChangeIndicatorProps
> = ({ count, desc, fieldName }) => {
  return (
    <Box sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}>
      <Box display="flex">
        <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
          {count}
        </Typography>
        <Typography>{desc}</Typography>
        <Typography fontWeight="bold" sx={{ ml: 0.5 }}>
          {fieldName}
        </Typography>
      </Box>
    </Box>
  );
};
export default ZUIPlainChangeIndicator;
