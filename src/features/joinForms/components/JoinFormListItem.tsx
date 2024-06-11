import makeStyles from '@mui/styles/makeStyles';
import { Box, Theme, Typography } from '@mui/material';

import { FormatListBulleted } from '@mui/icons-material';
import theme from 'theme';
import { ZetkinJoinForm } from '../types';

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.0em 0.5em',
  },
  endNumber: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    width: '7em',
  },
  icon: {
    color: theme.palette.grey[500],
    fontSize: '28px',
  },
  left: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 0',
    gap: '1em',
  },
  right: {
    alignItems: 'center',
    display: 'flex',
  },
}));

export enum STATUS_COLORS {
  BLUE = 'blue',
  GREEN = 'green',
  GRAY = 'gray',
  ORANGE = 'orange',
  RED = 'red',
}

type Props = {
  form: ZetkinJoinForm;
  onClick: () => void;
};

const JoinFormListItem = ({ form, onClick }: Props) => {
  const classes = useStyles();

  return (
    <Box
      className={classes.container}
      onClick={() => {
        onClick();
      }}
    >
      <Box className={classes.left}>
        <FormatListBulleted className={classes.icon} />
        <Box>
          <Typography color={theme.palette.text.primary}>
            {form.title}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Box className={classes.endNumber}>
          {/* TODO: Add stats
            <ZUIIconLabel
              icon={<SecondaryIcon color={endNumberColor} />}
              label={endNumber.toString()}
            />
          */}
        </Box>
      </Box>
    </Box>
  );
};

export default JoinFormListItem;
