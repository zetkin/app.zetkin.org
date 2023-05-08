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
    '&.collapsed': {
      position: 'static',
    },
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
  index: number;
}

const FieldGroup: FC<FieldGroupProps> = ({ fields, height, index }) => {
  const classes = useStyles();
  const fieldsWithLabel = fields.filter(
    (f) => f.presentation === FIELD_PRESENTATION.WITH_LABEL
  );
  const fieldsWithIconOnly = fields.filter(
    (f) => f.presentation === FIELD_PRESENTATION.ICON_ONLY
  );
  const isFirstFieldGroup = index === 0;

  return (
    <div
      className={classes.fields}
      style={{
        borderTop: isFirstFieldGroup ? '' : 'solid 1px gray',
        height,
        paddingTop: isFirstFieldGroup ? '' : '4px',
      }}
    >
      <div className={classes.fieldsWithIconOnly}>
        {fieldsWithIconOnly.map((field, index) => (
          <Field key={`${field.kind}-${index}`} field={field} />
        ))}
      </div>
      {fieldsWithLabel.map((field, index) => (
        <Field key={`${field.kind}-${index}`} field={field} />
      ))}
    </div>
  );
};

export default FieldGroup;
