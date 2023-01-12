import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Card, Typography } from '@mui/material';

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
      <Box
        display="flex"
        flexDirection="column"
        height="50%"
        justifyContent="space-between"
        p={2}
      >
        <Box>
          <Typography variant="h5">{title}</Typography>
          <Typography>{description}</Typography>
        </Box>
        <Box>
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
        </Box>
      </Box>
    </Card>
  );
};

export default ColumnChoiceCard;
