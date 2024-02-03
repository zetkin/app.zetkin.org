import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

interface StyleProps {
  cancelled: boolean;
  draft: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  topBadge: {
    alignItems: 'center',
    backgroundColor: ({ cancelled, draft }) =>
      cancelled || draft
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
    borderLeft: `1px solid ${theme.palette.grey[300]}`,
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    left: 0,
    padding: '0 8px',
    position: 'absolute',
    top: 0,
    transform: 'translateY(-100%) translateX(-1px)',
    width: 40,
  },
}));

interface TopBadgeProps {
  cancelled: boolean;
  draft: boolean;
  icon: JSX.Element;
  text: string;
}

const TopBadge: FC<TopBadgeProps> = ({ cancelled, draft, icon, text }) => {
  const classes = useStyles({ cancelled, draft });

  return (
    <div className={classes.topBadge}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default TopBadge;
