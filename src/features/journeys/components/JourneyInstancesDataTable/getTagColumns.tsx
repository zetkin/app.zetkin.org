import {
  GridCellParams,
  GridColDef,
  GridFilterItem,
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid-pro';

import FilterValueSelect from './FilterValueSelect';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import {
  JourneyTagColumnData,
  JourneyTagColumnType,
  JourneyTagGroupColumn,
  JourneyUnsortedTagsColumn,
  makeJourneyTagColumn,
} from 'features/journeys/utils/journeyInstanceUtils';
import { Msg, UseMessagesMap } from 'core/i18n';
import { ZetkinJourneyInstance, ZetkinTag } from 'utils/types/zetkin';

import messageIds from 'features/journeys/l10n/messageIds';

const has = (
  col: JourneyTagGroupColumn | JourneyUnsortedTagsColumn,
  item: GridFilterItem
) => {
  return (params: GridCellParams<ZetkinJourneyInstance>) => {
    if (!item.value) {
      return true;
    }

    const tags = col.tagsGetter(params.row.tags);

    return !!tags.find((tag) => {
      return tag.id.toString() === item.value;
    });
  };
};

const doesNotHave = (
  col: JourneyTagGroupColumn | JourneyUnsortedTagsColumn,
  item: GridFilterItem
) => {
  return (params: GridCellParams<ZetkinJourneyInstance>) => {
    if (!item.value) {
      return true;
    }
    const tags = col.tagsGetter(params.row.tags);

    return !tags.some((tag) => {
      return tag.id.toString() == item.value;
    });
  };
};

const isEmpty = (col: JourneyTagGroupColumn | JourneyUnsortedTagsColumn) => {
  return (params: GridCellParams<ZetkinJourneyInstance>) => {
    const tags = col.tagsGetter(params.row.tags);

    return tags.length === 0;
  };
};

const sortByTagName = (value0: ZetkinTag[], value1: ZetkinTag[]) => {
  const tags0 = value0.sort((t0, t1) => t0.title.localeCompare(t1.title));
  const tags1 = value1.sort((t0, t1) => t0.title.localeCompare(t1.title));

  const tagName0 = tags0[0]?.title ?? '';
  const tagName1 = tags1[0]?.title ?? '';

  if (!tagName0 && !tagName1) {
    return 0;
  } else if (!tagName0) {
    return 1;
  } else if (!tagName1) {
    return -1;
  } else {
    return tagName0.localeCompare(tagName1);
  }
};

const getTagColumns = (
  messages: UseMessagesMap<typeof messageIds>,
  journeyInstances: ZetkinJourneyInstance[],
  tagColumns: JourneyTagColumnData[]
): GridColDef[] => {
  const colDefs: GridColDef<ZetkinJourneyInstance>[] = [];

  tagColumns.forEach((colData) => {
    const col = makeJourneyTagColumn(colData);

    if (col.type == JourneyTagColumnType.TAG_GROUP) {
      const tagsById: Record<string, ZetkinTag> = {};
      journeyInstances
        .flatMap((instance) => col.tagsGetter(instance.tags))
        .forEach((tag) => (tagsById[tag.id.toString()] = tag));
      const uniqueTags = Object.values(tagsById).sort((t0, t1) =>
        t0.title.localeCompare(t1.title)
      );

      colDefs.push({
        field: `tagGroup${col.group.id}`,
        filterOperators: [
          {
            InputComponent: FilterValueSelect,
            InputComponentProps: {
              label: messages.instances.filters.tagLabel(),
              options: uniqueTags,
            },
            getApplyFilterFn: (item) => has(col, item),
            label: messages.instances.filters.hasOperator(),
            value: 'has',
          },
          {
            InputComponent: FilterValueSelect,
            InputComponentProps: {
              label: messages.instances.filters.tagLabel(),
              options: uniqueTags,
            },
            getApplyFilterFn: (item) => doesNotHave(col, item),
            label: messages.instances.filters.doesNotHaveOperator(),
            value: 'doesNotHave',
          },
          {
            getApplyFilterFn: () => isEmpty(col),
            label: messages.instances.filters.isEmptyOperator(),
            value: 'isEmpty',
          },
        ],
        headerName: col.group.title,
        renderCell: (params: GridRenderCellParams<ZetkinJourneyInstance>) => {
          return col
            .tagsGetter(params.row.tags)
            .map((tag) => (
              <TagChip key={tag.id} size="small" tag={tag as ZetkinTag} />
            ));
        },
        sortComparator: (value0, value1) => sortByTagName(value0, value1),
        valueFormatter: (
          params: GridValueFormatterParams<ZetkinJourneyInstance['tags']>
        ) =>
          col
            .tagsGetter(params.value)
            .map((tag) => tag.title)
            .join(', '),
        valueGetter: (params) => {
          const instance = params.row as ZetkinJourneyInstance;
          return col.tagsGetter(instance.tags);
        },
      });
    } else if (col.type == JourneyTagColumnType.VALUE_TAG) {
      colDefs.push({
        field: `valueTag${col.tag.id}`,
        headerName: col.tag.title,
        valueGetter: (params) =>
          col.valueGetter(params.row as ZetkinJourneyInstance),
      });
    } else if (col.type == JourneyTagColumnType.UNSORTED) {
      const tagsById: Record<string, ZetkinTag> = {};
      journeyInstances
        .flatMap((instance) => col.tagsGetter(instance.tags))
        .forEach((tag) => (tagsById[tag.id.toString()] = tag));
      const uniqueTags = Object.values(tagsById).sort((t0, t1) =>
        t0.title.localeCompare(t1.title)
      );

      colDefs.push({
        field: 'tagsFree',
        filterOperators: [
          {
            InputComponent: FilterValueSelect,
            InputComponentProps: {
              label: messages.instances.filters.tagLabel(),
              options: uniqueTags,
            },
            getApplyFilterFn: (item) => has(col, item),
            label: messages.instances.filters.hasOperator(),
            value: 'has',
          },
          {
            InputComponent: FilterValueSelect,
            InputComponentProps: {
              label: messages.instances.filters.tagLabel(),
              options: uniqueTags,
            },
            getApplyFilterFn: (item) => doesNotHave(col, item),
            label: messages.instances.filters.doesNotHaveOperator(),
            value: 'doesNotHave',
          },
          {
            getApplyFilterFn: () => isEmpty(col),
            label: messages.instances.filters.isEmptyOperator(),
            value: 'isEmpty',
          },
        ],
        renderCell: (params: GridRenderCellParams<ZetkinJourneyInstance>) =>
          col
            .tagsGetter(params.row.tags)
            .map((tag) => (
              <TagChip key={tag.id} size="small" tag={tag as ZetkinTag} />
            )),
        renderHeader: () => (
          <div className="MuiDataGrid-columnHeaderTitle">
            <Msg id={messageIds.instances.columns.tagsFree} />
          </div>
        ),
        sortComparator: (value0, value1) => sortByTagName(value0, value1),
        valueFormatter: (
          params: GridValueFormatterParams<ZetkinJourneyInstance['tags']>
        ) =>
          col
            .tagsGetter(params.value)
            .map((tag) => tag.title)
            .join(', '),
        valueGetter: (params) => {
          const instance = params.row as ZetkinJourneyInstance;
          return col.tagsGetter(instance.tags);
        },
      });
    }
  });

  return colDefs;
};

export default getTagColumns;
