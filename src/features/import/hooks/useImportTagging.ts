import { columnUpdate } from '../store';
import notEmpty from 'utils/notEmpty';
import { useAppDispatch } from 'core/hooks';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import { CellData, Column, ColumnKind, TagColumn } from '../utils/types';

export default function useImportTagging(
  orgId: number,
  column: Column,
  columnIndex: number
) {
  const dispatch = useAppDispatch();
  const tagsFuture = useTags(orgId);
  const tags = tagsFuture.data;

  const assignTag = (tag: { id: number }, value: CellData) => {
    if (column.kind == ColumnKind.TAG && tags != null) {
      const map = column.mapping.find((map) => map.value == value);

      if (!map) {
        const newMap = {
          tags: [{ id: tag.id }],
          value: value,
        };
        dispatch(
          columnUpdate([
            columnIndex,
            {
              ...column,
              mapping: [...column.mapping, newMap],
            },
          ])
        );
      } else {
        const filteredMapping = column.mapping.filter((m) => m.value != value);
        const updatedTags = map.tags.concat({
          id: tag.id,
        });
        const updatedMap = { ...map, tags: updatedTags };

        dispatch(
          columnUpdate([
            columnIndex,
            {
              ...column,
              mapping: filteredMapping.concat(updatedMap),
            },
          ])
        );
      }
    }
  };

  const assignTags = (mapping: TagColumn['mapping']) => {
    if (column.kind == ColumnKind.TAG) {
      dispatch(
        columnUpdate([
          columnIndex,
          {
            ...column,
            mapping,
          },
        ])
      );
    }
  };

  const getAssignedTags = (value: CellData): ZetkinTag[] => {
    if (column.kind == ColumnKind.TAG && tags != null) {
      const map = column.mapping.find((m) => m.value === value);
      const assignedTags = map?.tags
        .map((tag) => tags.find((t) => t.id == tag.id))
        .filter(notEmpty);
      return assignedTags || [];
    }
    return [];
  };

  const unAssignTag = (tagId: number, value: CellData) => {
    if (column.kind == ColumnKind.TAG) {
      const map = column.mapping.find((map) => map.value == value);
      if (map) {
        const filteredMapping = column.mapping.filter((m) => m.value != value);
        const updatedTags = map.tags.filter((t) => t.id != tagId);

        if (updatedTags.length == 0) {
          dispatch(
            columnUpdate([
              columnIndex,
              {
                ...column,
                mapping: filteredMapping,
              },
            ])
          );
        } else {
          const updatedMap = { ...map, tags: updatedTags };

          dispatch(
            columnUpdate([
              columnIndex,
              {
                ...column,
                mapping: filteredMapping.concat(updatedMap),
              },
            ])
          );
        }
      }
    }
  };

  return { assignTag, assignTags, getAssignedTags, unAssignTag };
}
