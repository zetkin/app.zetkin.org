import { Grid, useTheme } from '@mui/material';

import ColumnChoiceCard from '../ColumnChoiceCard';
import { ColumnChoiceWithKey } from '../choices';
import { useMessages } from 'core/i18n';
import { ZetkinViewColumn } from '../../types';
import messageIds from 'features/views/l10n/messageIds';

interface SearchResultsProps {
  existingColumns: ZetkinViewColumn[];
  onAdd: (choice: ColumnChoiceWithKey) => void;
  onConfigure: (choice: ColumnChoiceWithKey) => void;
  searchResults: ColumnChoiceWithKey[];
}

const SearchResults = ({
  existingColumns,
  onAdd,
  onConfigure,
  searchResults,
}: SearchResultsProps) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

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
                alreadyInView
                  ? theme.palette.onSurface.disabled
                  : searchResult.color
              )}
              color={
                alreadyInView
                  ? theme.palette.onSurface.disabled
                  : searchResult.color
              }
              description={messages.columnDialog.choices[
                searchResult.key
              ].description()}
              onAdd={() => onAdd(searchResult)}
              onConfigure={() => onConfigure(searchResult)}
              showAddButton={!!searchResult.defaultColumns}
              showConfigureButton={!!searchResult.renderConfigForm}
              title={messages.columnDialog.choices[searchResult.key].title()}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default SearchResults;
