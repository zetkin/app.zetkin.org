import { ReactEventHandler } from 'react';
import { Box, Card, CardActionArea } from '@material-ui/core';

interface ZetkinCardProps {
  children: React.ReactNode;
  onClick?: ReactEventHandler;
  value?: string | number;
}

const ClickableCard: React.FunctionComponent<ZetkinCardProps> = ({
  children,
  onClick,
  value,
}) => {
  return (
    <Card>
      <CardActionArea onClick={onClick} value={value}>
        <Box p={2}>{children}</Box>
      </CardActionArea>
    </Card>
  );
};

export default ClickableCard;
