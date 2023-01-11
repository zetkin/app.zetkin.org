import { FormattedMessage as Msg } from 'react-intl';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

interface ColumnChoiceCardProps {
  title: string;
  description: string;
  disabled?: boolean;
  color: string;
  FirstIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  onAdd: () => void;
  onConfigure: () => void;
  addButtonLabel?: string;
  configureButtonLabel?: string;
  showAddButton?: boolean;
  showConfigureButton?: boolean;
}

const ColumnChoiceCard = ({
  addButtonLabel = 'add',
  color,
  configureButtonLabel = 'configure',
  description,
  disabled = false,
  FirstIcon,
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
        bgcolor={disabled ? 'gray' : color}
        display="flex"
        height="50%"
        justifyContent="center"
      >
        <Box
          alignItems="center"
          bgcolor="white"
          borderRadius="50%"
          display="flex"
          justifyContent="center"
        >
          <FirstIcon sx={{ color: color, fontSize: '60px', margin: 2 }} />
        </Box>
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
        {!disabled && showAddButton && (
          <Button onClick={() => onAdd()} variant="text">
            <Msg id={`misc.views.columnDialog.gallery.${addButtonLabel}`} />
          </Button>
        )}
        {!disabled && showConfigureButton && (
          <Button onClick={() => onConfigure()} variant="text">
            <Msg
              id={`misc.views.columnDialog.gallery.${configureButtonLabel}`}
            />
          </Button>
        )}
        {disabled && (
          <Button disabled variant="text">
            <Msg id="misc.views.columnDialog.gallery.alreadyInView" />
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ColumnChoiceCard;
