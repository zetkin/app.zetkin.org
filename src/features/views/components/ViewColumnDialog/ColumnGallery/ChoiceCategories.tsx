import { Box, Grid, Typography, useTheme } from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import categories from '../categories';
import { ColumnChoice } from '../choices';
import ColumnChoiceCard from '../ColumnChoiceCard';
import { ZetkinViewColumn } from '../../types';
import choices, { ColumnChoiceWithKey } from '../choices';

interface CategoriesProps {
  existingColumns: ZetkinViewColumn[];
  onAdd: (choice: ColumnChoice) => void;
  onConfigure: (choice: ColumnChoiceWithKey) => void;
}

const ChoiceCategories = ({
  existingColumns,
  onAdd,
  onConfigure,
}: CategoriesProps) => {
  const intl = useIntl();
  const theme = useTheme();

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
            {category.choices.map((choiceKey) => {
              const choice = choices[choiceKey];
              if (!choice) {
                return;
              }
              const alreadyInView =
                choice.alreadyInView && choice.alreadyInView(existingColumns);
              return (
                <Grid key={choiceKey} item lg={4} sm={6} xs={12}>
                  <ColumnChoiceCard
                    alreadyInView={alreadyInView}
                    cardVisual={choice.renderCardVisual(
                      alreadyInView
                        ? theme.palette.onSurface.disabled
                        : choice.color
                    )}
                    color={
                      alreadyInView
                        ? theme.palette.onSurface.disabled
                        : choice.color
                    }
                    description={intl.formatMessage({
                      id: `misc.views.columnDialog.choices.${choiceKey}.description`,
                    })}
                    onAdd={() => onAdd(choice)}
                    onConfigure={() =>
                      onConfigure({ ...choice, key: choiceKey })
                    }
                    showAddButton={!!choice.defaultColumns}
                    showConfigureButton={!!choice.renderConfigForm}
                    title={intl.formatMessage({
                      id: `misc.views.columnDialog.choices.${choiceKey}.title`,
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
