import { Box } from '@mui/system';
import { COUNT_STATUS } from './index.stories';
import { Typography } from '@mui/material';

interface ZUIPeopleCounterProps {
  count: number;
  desc: string;
  status: COUNT_STATUS;
}

enum CounterColors {
  created = '#4CAF50',
  updated = '#03A9F4',
}
const ZUIPeopleCounter: React.FunctionComponent<ZUIPeopleCounterProps> = ({
  count,
  desc,
  status,
}) => {
  return (
    <Box sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}>
      <Typography color={CounterColors[status]} variant="h2">
        {count}
      </Typography>

      <Typography>{desc}</Typography>
    </Box>
  );
};
export default ZUIPeopleCounter;
