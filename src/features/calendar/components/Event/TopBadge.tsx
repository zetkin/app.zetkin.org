import { FC } from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  topBadge: {
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    color: 'white',
    display: 'flex',
    gap: '0 8px',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
    transform: 'translateY(-100%) translateX(-4px)',
    width: 40,
  },
}));

interface TopBadgeProps {
  icon: JSX.Element;
  text: string;
}

const TopBadge: FC<TopBadgeProps> = ({ icon, text }) => {
  const classes = useStyles();

  return (
    <div className={classes.topBadge}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default TopBadge;
