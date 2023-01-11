import { FunctionComponent } from 'react';
import { Grid } from '@mui/material';

import { COLUMN_TYPE, ZetkinViewColumn } from 'features/views/components/types';
import ColumnChoiceCard from './ColumnChoiceCard';
import { Mail } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import choices, { ColumnChoice } from './choices';

interface ColumnGalleryProps {
  existingColumns: ZetkinViewColumn[];
  onAdd: (choice: ColumnChoice) => void;
  onConfigure: (choice: ColumnChoice) => void;
}

const ColumnGallery: FunctionComponent<ColumnGalleryProps> = ({
  existingColumns,
  onAdd,
  onConfigure
}) => {
  const intl = useIntl();
  return (
    <Grid container spacing={3}>
      {choices.map((choice) => {
        return (
          <Grid key={choice.key} item md={4} sm={6}>
            <ColumnChoiceCard
              color="#234890"
              description={intl.formatMessage({
                id: `misc.views.columnDialog.choices.${choice.key}.description`,
              })}
              disabled={choice.alreadyInView && choice.alreadyInView(existingColumns)}
              FirstIcon={choice.icons[0]}
              multiIcon
              onAdd={() => onAdd(choice)}
              onConfigure={() => onConfigure(choice)}
              SecondIcon={choice.icons[1]}
              showAddButton
              showConfigureButton={!!choice.renderConfigForm}
              title={intl.formatMessage({
                id: `misc.views.columnDialog.choices.${choice.key}.title`,
              })}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ColumnGallery;
