import { Add } from '@mui/icons-material';
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
  multiIcon?: boolean;
  onAdd: () => void;
  onConfigure: () => void;
  addButtonLabel?: string;
  configureButtonLabel?: string;
  SecondIcon?: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;

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
  multiIcon = false,
  onAdd,
  onConfigure,
  SecondIcon,
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
        {multiIcon && (
          <svg
            width="129"
            height="85"
            viewBox="70 0 129 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M65.6748 83.1026C80.6962 75.5319 90.9998 59.969 90.9998 41.9995C90.9998 24.0301 80.6962 8.46718 65.6748 0.896484C84.7084 4.89353 98.9998 21.7776 98.9998 41.9995C98.9998 62.2215 84.7084 79.1056 65.6748 83.1026Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M80.6748 83.1026C95.6962 75.5319 106 59.969 106 41.9995C106 24.0301 95.6962 8.46718 80.6748 0.896484C99.7084 4.89353 114 21.7776 114 41.9995C114 62.2215 99.7084 79.1056 80.6748 83.1026Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M95.6748 83.1026C110.696 75.5319 121 59.969 121 41.9995C121 24.0301 110.696 8.46718 95.6748 0.896484C114.708 4.89353 129 21.7776 129 41.9995C129 62.2215 114.708 79.1056 95.6748 83.1026Z"
              fill="white"
            />
          </svg>
        )}
        {SecondIcon && (
          <>
            <Add sx={{ color: 'white', fontSize: '60px' }} />
            <Box
              alignItems="center"
              bgcolor="white"
              borderRadius="50%"
              display="flex"
              justifyContent="center"
            >
              <SecondIcon sx={{ color: color, fontSize: '60px', margin: 2 }} />
            </Box>
          </>
        )}
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
