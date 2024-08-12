import { Box, Grid, Typography, useTheme } from '@mui/material';

import choices, { ColumnChoiceWithKey } from '../choices';
import categories from '../categories';
import { ColumnChoice } from '../choices';
import ColumnChoiceCard from '../ColumnChoiceCard';
import { filterChoicesByMode } from './utils';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import { ZetkinViewColumn } from '../../types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';

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
  const messages = useMessages(messageIds);
  const theme = useTheme();

  const [isRestrictedMode] = useAccessLevel();

  return (
    <Box>
      {categories.map((category, index) => {
        const filteredKeys = filterChoicesByMode(
          isRestrictedMode,
          category.choices
        );

        if (!filteredKeys.length) {
          return null;
        }
        return (
          <Box key={`category-${index}`} id={`category-${index}`} padding={2}>
            <Typography variant="h4">
              <Msg
                id={messageIds.columnDialog.categories[category.key].title}
              />
            </Typography>
            <Typography variant="h5">
              <Msg
                id={
                  messageIds.columnDialog.categories[category.key].description
                }
              />
            </Typography>

            <Grid container paddingTop={2} spacing={3}>
              {filteredKeys.map((filteredKey) => {
                const choice = choices[filteredKey];
                if (!choice) {
                  return;
                }
                const alreadyInView =
                  choice.alreadyInView && choice.alreadyInView(existingColumns);
                return (
                  <Grid key={filteredKey} item lg={4} sm={6} xs={12}>
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
                      description={messages.columnDialog.choices[
                        filteredKey
                      ].description()}
                      onAdd={() => onAdd(choice)}
                      onConfigure={() =>
                        onConfigure({ ...choice, key: filteredKey })
                      }
                      showAddButton={!!choice.defaultColumns}
                      showConfigureButton={!!choice.renderConfigForm}
                      title={messages.columnDialog.choices[filteredKey].title()}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default ChoiceCategories;
