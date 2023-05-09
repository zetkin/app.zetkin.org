import { Box } from '@mui/material';
import { FC } from 'react';
import { makeStyles } from '@mui/styles';

import Field from './Field';
import { FIELD_PRESENTATION, PresentableField } from '.';

const useStyles = makeStyles(() => ({
  fields: {
    display: 'flex',
    flexFlow: 'column',
    gap: '4px 0',
    position: 'relative',
  },
  fieldsWithIconOnly: {
    display: 'flex',
    gap: '0 4px',
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

interface FieldGroupProps {
  fields: PresentableField[];
  height: number;
}

const FieldGroup: FC<FieldGroupProps> = ({ fields, height }) => {
  const classes = useStyles();
  const fieldsWithLabel = fields.filter(
    (f) => f.presentation === FIELD_PRESENTATION.WITH_LABEL
  );
  const fieldsWithIconOnly = fields.filter(
    (f) => f.presentation === FIELD_PRESENTATION.ICON_ONLY
  );
  return (
    <>
      <Box className={classes.fields} height={height}>
        <div className={classes.fieldsWithIconOnly}>
          {fieldsWithIconOnly.map((field, index) => (
            <Field key={`${field.kind}-${index}`} field={field} />
          ))}
        </div>
        {fieldsWithLabel.map((field, index) => (
          <Field key={`${field.kind}-${index}`} field={field} />
        ))}
      </Box>
    </>
  );
};

export default FieldGroup;
