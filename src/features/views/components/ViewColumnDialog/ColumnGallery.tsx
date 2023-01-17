import { useIntl } from 'react-intl';
import { Box, Grid, List, ListItem, Typography } from '@mui/material';
import { FunctionComponent, useRef } from 'react';

import categories from './categories';
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

  const categoriesRef = useRef<HTMLDivElement>();

  return (
    <Box display="flex" height="100%">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{
          overflowY: 'scroll',
        }}
        width="20%"
      >
        <List>
          {categories.map((category, index) => (
            <ListItem
              key={index}
              onClick={() => {
                if (categoriesRef.current) {
                  const element = categoriesRef.current.querySelector(
                    `#category-${index}`
                  );
                  element?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              sx={{ cursor: 'pointer', paddingY: 2 }}
            >
              <Typography>{category.title}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box ref={categoriesRef} flexGrow={1} sx={{ overflowY: 'scroll' }}>
        {categories.map((category, index) => (
          <Box key={category.title} id={`category-${index}`} padding={2}>
            <Typography variant="h4">{category.title}</Typography>
            <Typography variant="h5">{category.description}</Typography>
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
    </Box>
  );
};

export default ColumnGallery;
