import { Box, Grid, Typography } from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import categories from '../categories';
import choices from '../choices';
import { ColumnChoice } from '../choices';
import ColumnChoiceCard from '../ColumnChoiceCard';
import { ZetkinViewColumn } from '../../types';

interface CategoriesProps {
  existingColumns: ZetkinViewColumn[];
  onAdd: (choice: ColumnChoice) => void;
  onConfigure: (choice: ColumnChoice) => void;
}

const ChoiceCategories = ({
  existingColumns,
  onAdd,
  onConfigure,
}: CategoriesProps) => {
  const intl = useIntl();
  return (
    <Box>
      {categories.map((category, index) => (
        <Box key={`category-${index}`} id={`category-${index}`} padding={2}>
          <Typography variant="h4">
            <Msg
              id={`misc.views.columnDialog.categories.${category.key}.title`}
            />
          </Typography>
          <Typography variant="h5">
            <Msg
              id={`misc.views.columnDialog.categories.${category.key}.description`}
            />
          </Typography>
          <Grid container paddingTop={2} spacing={3}>
            {category.choices.map((choiceName) => {
              const choice = choices.find(
                (choice) => choice.key === choiceName
              );
              if (!choice) {
                return;
              }
              const alreadyInView =
                choice.alreadyInView && choice.alreadyInView(existingColumns);
              return (
                <Grid key={choice.key} item lg={4} sm={6} xs={12}>
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
        </Box>
      ))}
    </Box>
  );
};

export default ChoiceCategories;
