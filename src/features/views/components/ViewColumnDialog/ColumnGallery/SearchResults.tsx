import { Grid } from '@mui/material';
import { useIntl } from 'react-intl';

import { ColumnChoice } from '../choices';
import ColumnChoiceCard from '../ColumnChoiceCard';
import { ZetkinViewColumn } from '../../types';

interface SearchResultsProps {
  existingColumns: ZetkinViewColumn[];
  onAdd: (choice: ColumnChoice) => void;
  onConfigure: (choice: ColumnChoice) => void;
  searchResults: (ColumnChoice | undefined)[];
}

const SearchResults = ({
  existingColumns,
  onAdd,
  onConfigure,
  searchResults,
}: SearchResultsProps) => {
  const intl = useIntl();
  return (
    <Grid container paddingTop={2} spacing={3}>
      {searchResults.map((searchResult) => {
        if (!searchResult) {
          return;
        }
        const alreadyInView =
          searchResult.alreadyInView &&
          searchResult.alreadyInView(existingColumns);
        return (
          <Grid key={searchResult.key} item lg={4} sm={6} xs={12}>
            <ColumnChoiceCard
              alreadyInView={alreadyInView}
              cardVisual={searchResult.renderCardVisual(
                alreadyInView ? 'gray' : '#234890'
              )}
              color={alreadyInView ? 'gray' : '#234890'}
              description={intl.formatMessage({
                id: `misc.views.columnDialog.choices.${searchResult.key}.description`,
              })}
              onAdd={() => onAdd(searchResult)}
              onConfigure={() => onConfigure(searchResult)}
              showAddButton={!!searchResult.defaultColumns}
              showConfigureButton={!!searchResult.renderConfigForm}
              title={intl.formatMessage({
                id: `misc.views.columnDialog.choices.${searchResult.key}.title`,
              })}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default SearchResults;
