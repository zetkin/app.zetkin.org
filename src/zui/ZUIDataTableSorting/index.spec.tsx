import { GridSortModel } from '@mui/x-data-grid-pro';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, jest } from '@jest/globals';

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
        null,
        {}
      ),
      headerName: field,
    };
  });

  const sortModel: GridSortModel = gridColumns
    .slice(0, 2)
    .map((column) => ({ field: column.field, sort: 'asc' }));

  const handleSetSortModel = jest.fn((sortModel: GridSortModel) => sortModel);

  it('renders correctly when sort model is empty', async () => {
    const { getByText } = render(
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={() => null}
        sortModel={[]}
      />
    );

    const sortButton = getByText('zui.dataTableSorting.button');
    expect(sortButton).toBeTruthy();

    // Show popover
    await userEvent.click(sortButton);

    expect(getByText('zui.dataTableSorting.title')).toBeTruthy();
    expect(getByText('zui.dataTableSorting.addButton')).toBeTruthy();
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
    const sortButton = getByText('zui.dataTableSorting.button');
    await userEvent.click(sortButton);

    expect(getByText(fields[0])).toBeTruthy();
    expect(getByText(fields[1])).toBeTruthy();
    expect(getAllByText('zui.dataTableSorting.ascending')).toHaveLength(2);
  });

  it('updates correctly when adding a sort field', async () => {
    const { getAllByText, getByText, rerender } = render(
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={handleSetSortModel}
        sortModel={sortModel}
      />
    );

    // Show popover and add sort field
    const sortButton = getByText('zui.dataTableSorting.button');
    await userEvent.click(sortButton);
    await userEvent.click(getByText('zui.dataTableSorting.addButton'));

    const updatedSortModel = handleSetSortModel.mock.calls.at(-1)![0];

    rerender(
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={handleSetSortModel}
        sortModel={updatedSortModel}
      />
    );

    expect(getByText(fields[0])).toBeTruthy();
    expect(getByText(fields[1])).toBeTruthy();
    expect(getByText(fields[2])).toBeTruthy();
    expect(getAllByText('zui.dataTableSorting.ascending')).toHaveLength(3);
  });

  it('calls setSortModel correctly on user input', async () => {
    const { getAllByText, getByText, getAllByTestId } = render(
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={handleSetSortModel}
        sortModel={sortModel}
      />
    );

    // Show popover
    const sortButton = getByText('zui.dataTableSorting.button');
    await userEvent.click(sortButton);
    await userEvent.click(getByText('zui.dataTableSorting.addButton'));

    // Modify sort direction
    await userEvent.click(getAllByText('zui.dataTableSorting.ascending')[0]);
    await userEvent.click(getByText('zui.dataTableSorting.descending'));
    expect(handleSetSortModel).toHaveBeenLastCalledWith(
      [
        { field: fields[0], sort: 'desc' },
        { field: fields[1], sort: 'asc' },
      ],
      {}
    );

    // Modify sort field
    await userEvent.click(getByText(fields[0]));
    await userEvent.click(getByText(fields[2]));
    expect(handleSetSortModel).toHaveBeenLastCalledWith(
      [
        { field: fields[2], sort: 'asc' },
        { field: fields[1], sort: 'asc' },
      ],
      {}
    );

    // Delete an item from the sort model
    const deleteButtons = getAllByTestId('deleteSortModelItem');
    await userEvent.click(deleteButtons[0]);
    expect(handleSetSortModel).toHaveBeenLastCalledWith(
      [{ field: fields[1], sort: 'asc' }],
      {}
    );
  });
});
