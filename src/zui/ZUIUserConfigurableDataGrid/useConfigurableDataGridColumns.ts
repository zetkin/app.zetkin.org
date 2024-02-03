import { GridColDef } from '@mui/x-data-grid-pro';
import { useState } from 'react';

export interface StorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ConfigurableDataGridColumns {
  columns: GridColDef[];
  setColumnOrder: (field: string, newIndex: number) => void;
  setColumnWidth: (field: string, width: number) => void;
}

interface ColumnConfig {
  fieldOrder: string[];
  fieldWidths: Record<string, number>;
}

function orderColumns(
  columns: GridColDef[],
  fieldOrder: string[]
): GridColDef[] {
  return columns.concat().sort((c0, c1) => {
    const idx0 = fieldOrder.indexOf(c0.field);
    const idx1 = fieldOrder.indexOf(c1.field);

    if (idx0 === -1 && idx1 === -1) {
      return 0;
    } else if (idx0 === -1) {
      return 1;
    } else if (idx1 === -1) {
      return -1;
    } else {
      return idx0 - idx1;
    }
  });
}

export default function useConfigurableDataGridColumns(
  storageKey: string,
  inputColumns: GridColDef[],
  storage: StorageBackend = localStorage
): ConfigurableDataGridColumns {
  const key = `dataGridConfig-${storageKey}`;

  const [config, setConfig] = useState<ColumnConfig>(loadConfig(storage, key));

  return {
    columns: orderColumns(inputColumns, config.fieldOrder).map((colDef) => {
      if (config.fieldWidths[colDef.field]) {
        const modified = {
          ...colDef,
          width: config.fieldWidths[colDef.field],
        };
        delete modified.flex;
        return modified;
      } else {
        return colDef;
      }
    }),
    setColumnOrder: (field, newIndex) => {
      const storedConfig = loadConfig(storage, key);
      const sortedFields = orderColumns(
        inputColumns,
        storedConfig.fieldOrder
      ).map((colDef) => colDef.field);

      const originalIndex = sortedFields.indexOf(field);
      sortedFields.splice(originalIndex, 1);

      const before = sortedFields.slice(0, newIndex);
      const after = sortedFields.slice(newIndex);

      const newConfig = {
        ...config,
        fieldOrder: [...before, field, ...after],
      };

      storage.setItem(key, JSON.stringify(newConfig));

      setConfig(newConfig);
    },
    setColumnWidth: (field, width) => {
      const storedConfig = loadConfig(storage, key);
      const newConfig = {
        ...storedConfig,
        fieldWidths: {
          ...storedConfig.fieldWidths,
          [field]: width,
        },
      };

      storage.setItem(key, JSON.stringify(newConfig));

      setConfig(newConfig);
    },
  };
}

function loadConfig(storage: StorageBackend, key: string): ColumnConfig {
  let fieldOrder: string[] = [];
  let fieldWidths: Record<string, number> = {};
  try {
    const configStr = storage.getItem(key);
    if (configStr) {
      const config = JSON.parse(configStr);
      if (Array.isArray(config.fieldOrder)) {
        fieldOrder = config.fieldOrder;
      }
      if (config.fieldWidths) {
        fieldWidths = config.fieldWidths;
      }
    } else {
      throw new Error('Config not found in storage');
    }
  } catch (err) {
    // Do nothing, use default values
  }
  return {
    fieldOrder,
    fieldWidths,
  };
}
