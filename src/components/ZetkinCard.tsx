import { ReactEventHandler } from 'react';
import { Card, CardActionArea, makeStyles } from '@material-ui/core';

interface ZetkinCardProps {
  onClick?: ReactEventHandler;
  value?: string | number;
}

const useStyles = makeStyles((theme) => ({
  card: ({ hasClickHandler }: { hasClickHandler: boolean }) => ({
    border: '2px solid lightgrey',
    borderRadius: 0,
    padding: theme.spacing(hasClickHandler ? 0 : 2),
  }),
  cardActionArea: {
    padding: theme.spacing(2),
  },
}));

const ZetkinCard: React.FunctionComponent<ZetkinCardProps> = ({
  children,
  onClick,
  value,
}) => {
  const classes = useStyles({ hasClickHandler: !!onClick });

  return (
    <Card className={classes.card}>
      {!onClick && children}
      {onClick && (
        <CardActionArea
          className={classes.cardActionArea}
          onClick={onClick}
          value={value}
        >
          {children}
        </CardActionArea>
      )}
    </Card>
  );
};

export default ZetkinCard;
