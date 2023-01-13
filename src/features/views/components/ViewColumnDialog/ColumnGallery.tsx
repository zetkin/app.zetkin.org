import { FunctionComponent } from 'react';
import { Grid } from '@mui/material';
import { useIntl } from 'react-intl';

import ColumnChoiceCard from './ColumnChoiceCard';
import { ZetkinViewColumn } from 'features/views/components/types';
import choices, { ColumnChoice } from './choices';

interface ColumnGalleryProps {
  existingColumns: ZetkinViewColumn[];
  onAdd: (choice: ColumnChoice) => void;
  onConfigure: (choice: ColumnChoice) => void;
}

const ColumnGallery: FunctionComponent<ColumnGalleryProps> = ({
  existingColumns,
  onAdd,
  onConfigure,
}) => {
  const intl = useIntl();
  return (
    <Grid container spacing={3}>
      {choices.map((choice) => {
        const alreadyInView =
          choice.alreadyInView && choice.alreadyInView(existingColumns);
        return (
          <Grid key={choice.key} item md={4} sm={6}>
            <ColumnChoiceCard
              alreadyInView={alreadyInView}
              cardVisual={choice.renderCardVisual(
                alreadyInView ? 'gray' : '#234890'
              )}
              color={alreadyInView ? 'gray' : '#234890'}
              description={intl.formatMessage({
                id: `misc.views.columnDialog.choices.${choice.key}.description`,
              })}
              onAdd={() => onAdd(choice)}
              onConfigure={() => onConfigure(choice)}
              showAddButton={!!choice.defaultColumns}
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
