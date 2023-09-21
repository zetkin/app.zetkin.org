import { Box, Button, Card, Typography } from '@mui/material';

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
    <Card sx={{ height: '100%' }}>
      <Box
        alignItems="center"
        bgcolor={color}
        display="flex"
        height="150px"
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
        </Box>
      </Box>
    </Card>
  );
};

export default ColumnChoiceCard;
