import { FC } from 'react';
import { makeStyles } from '@mui/styles';

import { FieldIcon } from './FieldIcon';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import { FIELD_PRESENTATION, PresentableField } from '.';

const useStyles = makeStyles((theme) => ({
  icon: {
    '&.error': {
      color: theme.palette.error.main,
    },
    color: theme.palette.secondary.main,
  },
}));

interface FieldProps {
  field: PresentableField;
}

const Field: FC<FieldProps> = ({ field }) => {
  const classes = useStyles();
  const labelColor = field.requiresAction ? 'error' : 'secondary';
  const icon = (
    <span
      className={classes.icon + (field.requiresAction ? ' error' : '')}
      style={{
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <FieldIcon field={field} />
    </span>
  );

  if (field.presentation === FIELD_PRESENTATION.ICON_ONLY) {
    return icon;
  }

  return (
    <ZUIIconLabel
      color={labelColor}
      icon={icon}
      label={field.message}
      size="sm"
    />
  );
};

export default Field;
