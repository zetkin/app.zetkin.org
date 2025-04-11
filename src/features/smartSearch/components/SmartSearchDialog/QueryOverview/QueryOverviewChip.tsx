import { Box } from '@mui/material';
import { FC } from 'react';
import { makeStyles } from '@mui/styles';

import oldTheme from 'theme';

const useStyles = makeStyles(() => ({
  chip: {
    alignItems: 'center',
    backgroundColor: oldTheme.palette.grey[200],
    borderRadius: '5em',
    display: 'flex',
    margin: '10px 0',
    padding: '4px 4px',
  },
}));

interface QueryOverviewChipProps {
  filterOperatorIcon?: JSX.Element;
  filterTypeIcon: JSX.Element;
}

const QueryOverviewChip: FC<QueryOverviewChipProps> = ({
  filterOperatorIcon,
  filterTypeIcon,
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.chip}>
      {filterOperatorIcon}
      {filterTypeIcon}
    </Box>
  );
};

export default QueryOverviewChip;
