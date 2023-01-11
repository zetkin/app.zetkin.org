import { FunctionComponent } from 'react';
import { Grid } from '@mui/material';

import { COLUMN_TYPE } from 'features/views/components/types';
import ColumnChoiceCard from './ColumnChoiceCard';
import { Mail } from '@mui/icons-material';
import { useIntl } from 'react-intl';

interface ColumnGalleryProps {
  onSelectType: (type: COLUMN_TYPE) => void;
}

const ColumnGallery: FunctionComponent<ColumnGalleryProps> = ({
  onSelectType,
}) => {
  const intl = useIntl();
  return (
    <Grid container spacing={3}>
      {Object.values(COLUMN_TYPE).map((colType) => (
        <Grid key={colType} item md={4} sm={6}>
          <ColumnChoiceCard
            color="#234890"
            columnType={colType}
            description={intl.formatMessage({
              id: `misc.views.columnDialog.types.descriptions.${colType}`,
            })}
            FirstIcon={Mail}
            onAdd={onSelectType}
            onConfigure={onSelectType}
            showAddButton
            showConfigureButton
            title={intl.formatMessage({
              id: `misc.views.columnDialog.types.${colType}`,
            })}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ColumnGallery;
