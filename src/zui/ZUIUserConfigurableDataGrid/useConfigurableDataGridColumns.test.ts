import { GridColDef } from '@mui/x-data-grid-pro';
import useConfigurableDataGridColumns, {
  StorageBackend,
} from './useConfigurableDataGridColumns';

const mockSetState = jest.fn();

jest.mock('react', () => ({
  useState: <T>(initial: T) => [initial, mockSetState],
}));

class MockStorage implements StorageBackend {
  public data: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.data[key] || null;
  }
  setItem(key: string, value: string): void {
    this.data[key] = value;
  }
}

function mockColumns(count: number, widths: number[] = []): GridColDef[] {
  const columns: GridColDef[] = [];
  for (let i = 0; i < count; i++) {
    columns.push({
      field: `field${i}`,
      width: i < widths.length ? widths[0] : 100,
    });
  }

  return columns;
}

describe('useConfigurableDataGridColumns', () => {
  let mockStorage: StorageBackend;

  beforeEach(() => {
    mockStorage = new MockStorage();
    mockSetState.mockReset();
  });

  describe('columns', () => {
    test('are untouched nothing by default', () => {
      const inputColumns = mockColumns(3);

      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns).toEqual(inputColumns);
    });

    test('reads widths from storage', () => {
      mockStorage.setItem(
        'dataGridConfig-key',
        JSON.stringify({
          fieldWidths: {
            field0: 200,
            field1: 250,
            field2: 300,
          },
        })
      );

      const inputColumns = mockColumns(3);
      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0].width).toEqual(200);
      expect(columns[1].width).toEqual(250);
      expect(columns[2].width).toEqual(300);
    });

    test('removes flex when width is set', () => {
      mockStorage.setItem(
        'dataGridConfig-key',
        JSON.stringify({
          fieldWidths: {
            field0: 200,
          },
        })
      );

      const inputColumns = [{ field: 'field0', flex: 1 }];
      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );
      expect(columns[0]).toEqual({
        field: 'field0',
        width: 200,
      });
    });

    test('reads order from storage', () => {
      mockStorage.setItem(
        'dataGridConfig-key',
        JSON.stringify({
          fieldOrder: ['field2', 'field0', 'field1'],
        })
      );

      const inputColumns = mockColumns(3);
      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0].field).toEqual('field2');
      expect(columns[1].field).toEqual('field0');
      expect(columns[2].field).toEqual('field1');
    });

    test('puts unknown columns last', () => {
      mockStorage.setItem(
        'dataGridConfig-key',
        JSON.stringify({
          fieldOrder: ['field2', 'field0', 'field1'],
        })
      );

      const inputColumns = mockColumns(6);
      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0].field).toEqual('field2');
      expect(columns[1].field).toEqual('field0');
      expect(columns[2].field).toEqual('field1');
      expect(columns[3].field).toEqual('field3');
      expect(columns[4].field).toEqual('field4');
      expect(columns[5].field).toEqual('field5');
    });
  });

  describe('setColumnOrder()', () => {
    test('correctly updates storage when reordering left to right', () => {
      const inputColumns = mockColumns(3);
      const { setColumnOrder } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      setColumnOrder('field0', 1);

      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0]).toEqual(inputColumns[1]);
      expect(columns[1]).toEqual(inputColumns[0]);
      expect(columns[2]).toEqual(inputColumns[2]);
    });

    test('correctly updates storage when reordering right to left', () => {
      const inputColumns = mockColumns(3);
      const { setColumnOrder } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      setColumnOrder('field1', 0);

      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0]).toEqual(inputColumns[1]);
      expect(columns[1]).toEqual(inputColumns[0]);
      expect(columns[2]).toEqual(inputColumns[2]);
    });

    test('correctly updates storage when reordering end to start', () => {
      const inputColumns = mockColumns(3);
      const { setColumnOrder } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      setColumnOrder('field2', 0);

      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0]).toEqual(inputColumns[2]);
      expect(columns[1]).toEqual(inputColumns[0]);
      expect(columns[2]).toEqual(inputColumns[1]);
    });

    test('correctly updates storage when reordering start to end', () => {
      const inputColumns = mockColumns(3);
      const { setColumnOrder } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      setColumnOrder('field0', 2);

      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0]).toEqual(inputColumns[1]);
      expect(columns[1]).toEqual(inputColumns[2]);
      expect(columns[2]).toEqual(inputColumns[0]);
    });

    test('correctly updates storage when several times in a row', () => {
      const inputColumns = mockColumns(4);
      const { setColumnOrder } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      // Reorder as field1, field0, field2, field3
      setColumnOrder('field0', 1);

      // Reorder as field1, field2, field0, field3
      setColumnOrder('field0', 2);

      // Reorder as field1, field2, field3, field0
      setColumnOrder('field3', 2);

      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0]).toEqual(inputColumns[1]);
      expect(columns[1]).toEqual(inputColumns[2]);
      expect(columns[2]).toEqual(inputColumns[3]);
      expect(columns[3]).toEqual(inputColumns[0]);
    });
  });

  describe('setColumnWidth()', () => {
    test('stores updated width in storage', () => {
      const inputColumns = mockColumns(3);
      const { setColumnWidth } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      setColumnWidth('field1', 500);

      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0]).toEqual(inputColumns[0]);
      expect(columns[1].width).toEqual(500);
      expect(columns[2]).toEqual(inputColumns[2]);
    });

    test('triggers re-render using state', () => {
      const inputColumns = mockColumns(3);
      const { setColumnWidth } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      setColumnWidth('field1', 500);
      expect(mockSetState).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complex interactions', () => {
    test('handles reorder followed by resize', () => {
      const inputColumns = mockColumns(3);
      const { setColumnOrder, setColumnWidth } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      setColumnOrder('field0', 1);
      setColumnWidth('field1', 200);

      const { columns } = useConfigurableDataGridColumns(
        'key',
        inputColumns,
        mockStorage
      );

      expect(columns[0]).toEqual({ field: 'field1', width: 200 });
      expect(columns[1]).toEqual({ field: 'field0', width: 100 });
      expect(columns[2]).toEqual({ field: 'field2', width: 100 });
    });
  });
});
