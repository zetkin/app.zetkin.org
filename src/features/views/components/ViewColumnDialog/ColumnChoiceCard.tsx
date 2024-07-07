import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import { Msg } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';

interface ColumnChoiceCardProps {
  addButtonLabel?: 'add';
  alreadyInView?: boolean;
  cardVisual: JSX.Element;
  description: string;
  color: string;
  configureButtonLabel?: 'configure';
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
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        alignItems="center"
        bgcolor={color}
        display="flex"
        height="150px"
        justifyContent="center"
      >
        {cardVisual}
      </Box>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: 'auto' }}>
        {!alreadyInView && showAddButton && (
          <Button onClick={() => onAdd()} variant="text">
            <Msg id={messageIds.columnDialog.gallery[addButtonLabel]} />
          </Button>
        )}
        {!alreadyInView && showConfigureButton && (
          <Button onClick={() => onConfigure()} variant="text">
            <Msg id={messageIds.columnDialog.gallery[configureButtonLabel]} />
          </Button>
        )}
        {alreadyInView && (
          <Button disabled variant="text">
            <Msg id={messageIds.columnDialog.gallery.alreadyInView} />
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ColumnChoiceCard;
