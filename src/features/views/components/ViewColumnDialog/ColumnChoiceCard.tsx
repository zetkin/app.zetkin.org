import { FormattedMessage as Msg } from 'react-intl';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

interface ColumnChoiceCardProps {
  addButtonLabel?: string;
  alreadyInView?: boolean;
  cardVisual: JSX.Element;
  description: string;
  color: string;
  configureButtonLabel?: string;
  onAdd: () => void;
  onConfigure: () => void;
  showAddButton?: boolean;
  showConfigureButton?: boolean;
  title: string;
}

const ColumnChoiceCard = ({
  addButtonLabel = 'add',
  alreadyInView = false,
  cardVisual,
  color,
  configureButtonLabel = 'configure',
  description,
  onAdd,
  onConfigure,
  showAddButton = false,
  showConfigureButton = false,
  title,
}: ColumnChoiceCardProps) => {
  return (
    <Card sx={{ height: '300px' }}>
      <Box
        alignItems="center"
        bgcolor={color}
        display="flex"
        height="50%"
        justifyContent="center"
      >
        {cardVisual}
      </Box>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
      </CardContent>
      <CardActions>
        {!alreadyInView && showAddButton && (
          <Button onClick={() => onAdd()} variant="text">
            <Msg id={`misc.views.columnDialog.gallery.${addButtonLabel}`} />
          </Button>
        )}
        {!alreadyInView && showConfigureButton && (
          <Button onClick={() => onConfigure()} variant="text">
            <Msg
              id={`misc.views.columnDialog.gallery.${configureButtonLabel}`}
            />
          </Button>
        )}
        {alreadyInView && (
          <Button disabled variant="text">
            <Msg id="misc.views.columnDialog.gallery.alreadyInView" />
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ColumnChoiceCard;
