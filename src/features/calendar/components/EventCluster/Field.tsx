import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme } from '@mui/material';

import { FieldIcon } from './FieldIcon';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import { FIELD_PRESENTATION, PresentableField } from './Event';

interface StyleProps {
  requiresAction: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  icon: {
    alignItems: 'center',
    color: ({ requiresAction }) =>
      requiresAction ? theme.palette.error.main : theme.palette.secondary.main,
    display: 'flex',
  },
}));

interface FieldProps {
  field: PresentableField;
}

const Field: FC<FieldProps> = ({ field }) => {
  const classes = useStyles({ requiresAction: field.requiresAction });
  const labelColor = field.requiresAction ? 'error' : 'secondary';
  const icon = (
    <Box className={classes.icon}>
      <FieldIcon field={field} />
    </Box>
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
