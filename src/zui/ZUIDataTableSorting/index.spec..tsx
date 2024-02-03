import { GridSortModel } from '@mui/x-data-grid-pro';
import userEvent from '@testing-library/user-event';

import { COLUMN_TYPE } from 'features/views/components/types';
import columnTypes from 'features/views/components/ViewDataTable/columnTypes';
import mockViewCol from 'utils/testing/mocks/mockViewCol';
import { render } from 'utils/testing';
import ZUIDataTableSorting from '.';

describe('ZUIDataTableSorting.tsx', () => {
  const fields = ['first_name', 'last_name', 'middle_name'];

  const gridColumns = fields.map((field, idx) => {
    return {
      field: field,
      ...columnTypes[COLUMN_TYPE.PERSON_FIELD].getColDef(
        mockViewCol({
          config: { field },
          id: idx,
          title: field,
          type: COLUMN_TYPE.PERSON_FIELD,
        }),
        null
      ),
    };
  });

  const sortModel: GridSortModel = gridColumns
    .slice(0, 2)
    .map((column) => ({ field: column.field, sort: 'asc' }));

  const handleSetSortModel = jest.fn((sortModel) => sortModel);

  it('renders correctly when sort model is empty', async () => {
    const { getByText } = render(
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={() => null}
        sortModel={[]}
      />
    );

    const sortButton = getByText('misc.dataTable.sorting.button');
    expect(sortButton).toBeTruthy();

    // Show popover
    await userEvent.click(sortButton);

    expect(getByText('misc.dataTable.sorting.title')).toBeTruthy();
    expect(getByText('misc.dataTable.sorting.addButton')).toBeTruthy();
  });

  it('renders correctly when sort model is populated', async () => {
    const { getAllByText, getByText } = render(
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={handleSetSortModel}
        sortModel={sortModel}
      />
    );

    // Show popover
    const sortButton = getByText('misc.dataTable.sorting.button');
    await userEvent.click(sortButton);

    expect(getByText(fields[0])).toBeTruthy();
    expect(getByText(fields[1])).toBeTruthy();
    expect(getAllByText('Ascending')).toHaveLength(2);
  });

  it('Calls setSortModel correctly on user input', async () => {
    const { getAllByText, getByText, getAllByTestId } = render(
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={handleSetSortModel}
        sortModel={sortModel}
      />
    );

    // Show popover
    const sortButton = getByText('misc.dataTable.sorting.button');
    await userEvent.click(sortButton);

    // Modify sort direction
    await userEvent.click(getAllByText('Ascending')[0]);
    await userEvent.click(getByText('Descending'));
    expect(handleSetSortModel).toHaveBeenCalledTimes(1);
    expect(handleSetSortModel.mock.results[0].value[0].sort).toEqual('desc');

    // Modify sort field
    await userEvent.click(getByText(fields[0]));
    await userEvent.click(getByText(fields[2]));
    expect(handleSetSortModel).toHaveBeenCalledTimes(2);
    expect(handleSetSortModel.mock.results[1].value[0].field).toEqual('col_2');

    // Delete an item from the sort model
    const deleteButtons = getAllByTestId('deleteSortModelItem');
    await userEvent.click(deleteButtons[0]);
    expect(handleSetSortModel).toHaveBeenCalledTimes(3);
    expect(handleSetSortModel.mock.results[2].value.length).toEqual(1);
  });
});
