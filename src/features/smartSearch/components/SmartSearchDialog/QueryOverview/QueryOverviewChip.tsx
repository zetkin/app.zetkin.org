import { Box } from '@mui/material';
import { FC } from 'react';

import oldTheme from 'theme';

interface QueryOverviewChipProps {
  filterOperatorIcon?: JSX.Element;
  filterTypeIcon: JSX.Element;
}

const QueryOverviewChip: FC<QueryOverviewChipProps> = ({
  filterOperatorIcon,
  filterTypeIcon,
}) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: oldTheme.palette.grey[200],
        borderRadius: '5em',
        display: 'flex',
        margin: '10px 0',
        padding: '4px 4px',
      }}
    >
      {filterOperatorIcon}
      {filterTypeIcon}
    </Box>
  );
};

export default QueryOverviewChip;
