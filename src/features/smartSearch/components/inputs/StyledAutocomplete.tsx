import * as React from 'react';
import { ComponentType, FC, HTMLAttributes, useCallback, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, {
  autocompleteClasses,
  AutocompleteOwnerState,
} from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { styled, useTheme } from '@mui/material/styles';
import {
  List,
  ListImperativeAPI,
  RowComponentProps,
  useListRef,
} from 'react-window';
import Typography from '@mui/material/Typography';
import { Box, SlotProps } from '@mui/material';
import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteValue,
} from '@mui/material/useAutocomplete/useAutocomplete';

const LISTBOX_PADDING = 8; // px

type ItemData = Array<
  | {
      children: React.ReactNode;
      group: string;
      key: number;
    }
  | [React.ReactElement, string, number, string]
>;

function RowComponent({
  index,
  itemData,
  style,
}: RowComponentProps & {
  itemData: ItemData;
}) {
  const dataSet = itemData[index];
  const inlineStyle = {
    ...style,
    top: ((style.top as number) ?? 0) + LISTBOX_PADDING,
  };

  if ('group' in dataSet) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  const { key, ...optionProps } = dataSet[0];

  return (
    <Typography
      key={key}
      component="li"
      {...optionProps}
      noWrap
      style={inlineStyle}
    >
      {dataSet[1]}
    </Typography>
  );
}

// Adapter for react-window v2
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement> & {
    internalListRef: React.Ref<ListImperativeAPI>;
    onItemsBuilt: (optionIndexMap: Map<string, number>) => void;
  }
>(function ListboxComponent(props, ref) {
  const { children, internalListRef, onItemsBuilt, ...other } = props;
  const itemData: ItemData = [];
  const optionIndexMap = React.useMemo(() => new Map<string, number>(), []);

  (children as ItemData).forEach((item) => {
    if ('group' in item && item.group.trim() !== '') {
      itemData.push(item);
    }
    if ('children' in item && Array.isArray(item.children)) {
      itemData.push(...item.children);
    }
  });

  // Map option values to their indices in the flattened array
  itemData.forEach((item, index) => {
    if (Array.isArray(item) && item[3]) {
      optionIndexMap.set(item[3], index);
    }
  });

  React.useEffect(() => {
    if (onItemsBuilt) {
      onItemsBuilt(optionIndexMap);
    }
  }, [onItemsBuilt, optionIndexMap]);

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: ItemData[number]) => {
    if (Object.prototype.hasOwnProperty.call(child, 'group')) {
      return 48;
    }
    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  // Separate className for List, other props for wrapper div (ARIA, handlers)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { className, style, ...otherProps } = other;

  return (
    <div ref={ref} {...otherProps}>
      <List
        key={itemCount}
        className={className}
        listRef={internalListRef}
        overscanCount={5}
        rowComponent={RowComponent}
        rowCount={itemCount}
        rowHeight={(index) => getChildSize(itemData[index])}
        rowProps={{ itemData }}
        style={{
          height: getHeight() + 2 * LISTBOX_PADDING,
          width: '100%',
        }}
        tagName="ul"
      />
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    '& ul': {
      margin: 0,
      padding: 0,
    },
    boxSizing: 'border-box',
  },
  minWidth: '400px',
});

type Item = {
  /**
   * Groups items by a group label. "pinned" is a pseudo group that makes the component get displayed at the top.
   */
  group?: 'pinned' | string | null;
  id: string | number;
  label: string;
};

type Props = {
  items: Item[];
  minWidth?: string;
  onChange?: (
    event: React.SyntheticEvent & { target: { value: string } },
    value: AutocompleteValue<Item, false, true, false>,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Item>
  ) => void;
  value?: string | number;
};

const StyledGroupedSelect: FC<Props> = (props) => {
  const options: Item[] = useMemo(
    () =>
      props.items
        .sort((item0, item1) => {
          const group0 = item0.group ?? '';
          const group1 = item1.group ?? '';

          if (group0 === 'pinned') {
            return -1;
          }

          if (group1 === 'pinned') {
            return 1;
          }

          const ret = group0.localeCompare(group1);
          if (ret === 0) {
            return item0.label.localeCompare(item1.label);
          }

          return ret;
        })
        .map((item) => {
          if (item.group === 'pinned') {
            return {
              id: item.id,
              label: item.label,
            };
          }
          return item;
        })
        .map((item) => ({
          ...item,
          label: item.label.trim(),
        })),
    [props.items]
  );

  const valueItem = useMemo(
    () =>
      props.value === undefined
        ? props.items.length === 0
          ? undefined
          : props.items[0]
        : options.find((item) => item.id === props.value),
    [props.value, options]
  );

  // Use react-window v2's useListRef hook for imperative API access
  const internalListRef = useListRef(null);
  const optionIndexMapRef = React.useRef<Map<string, number>>(new Map());

  const handleItemsBuilt = React.useCallback(
    (optionIndexMap: Map<string, number>) => {
      optionIndexMapRef.current = optionIndexMap;
    },
    []
  );

  // Handle keyboard navigation by scrolling to highlighted option
  const handleHighlightChange = (
    _event: React.SyntheticEvent,
    option: Item | null
  ) => {
    if (option && internalListRef.current) {
      const index = optionIndexMapRef.current.get(option.id.toString());
      if (index !== undefined) {
        internalListRef.current.scrollToRow({ align: 'auto', index });
      }
    }
  };

  const onChange = useCallback(
    (
      event: React.SyntheticEvent,
      value: AutocompleteValue<Item, false, true, false>,
      reason: AutocompleteChangeReason,
      details?: AutocompleteChangeDetails<Item>
    ) => {
      props.onChange?.(
        {
          ...event,
          target: {
            ...event.target,
            value: value ? value.id.toString() : '',
          },
        },
        value,
        reason,
        details
      );
    },
    [props.onChange]
  );

  if (!valueItem) {
    return null;
  }

  return (
    <Autocomplete
      disableClearable={true}
      disableListWrap
      groupBy={(option) => option.group ?? ''}
      onChange={onChange}
      onHighlightChange={handleHighlightChange}
      options={options}
      renderGroup={(params) => params as unknown as React.ReactNode}
      renderInput={(params) => (
        <Box>
          <TextField {...params} />
          <Typography
            sx={{
              fontSize: '34px',
              height: 0,
              opacity: 0,
              paddingRight: '39px',
            }}
          >
            {valueItem?.label}
          </Typography>
        </Box>
      )}
      renderOption={(props, option, state) =>
        [
          props,
          option.label,
          state.index,
          option.id.toString(),
        ] as React.ReactNode
      }
      slotProps={{
        listbox: {
          component: ListboxComponent,
          internalListRef,
          onItemsBuilt: handleItemsBuilt,
        } as SlotProps<
          ComponentType<HTMLAttributes<HTMLUListElement>>,
          unknown,
          AutocompleteOwnerState<Item, false, true, false, 'div'>
        >,
        popper: {
          placement: 'bottom-start',
        },
      }}
      slots={{
        popper: StyledPopper,
      }}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
          padding: 0,
        },
        '& .MuiOutlinedInput-root': {
          border: 'none',
          // borderBottom: `1px solid rgba(0, 0, 0, 0.42)`,
          borderRadius: 0,
          // display: 'flex',
          padding: 0,
        },
        '& .MuiOutlinedInput-root .MuiInputBase-input': {
          fontSize: '34px',
          padding: 0,
          textOverflow: 'clip',
        },
        '& .MuiOutlinedInput-root.Mui-focused:after': {
          borderBottom: '2px solid #ED1C55',
          transform: 'scaleX(1) translateX(0)',
        },
        '& .MuiOutlinedInput-root:after': {
          bottom: 0,
          content: '""',
          left: 0,
          position: 'absolute',
          right: 0,
          transform: 'scaleX(0)',
          transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        },
        '& .MuiOutlinedInput-root:before': {
          borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          bottom: 0,
          content: '""',
          left: 0,
          pointerEvents: 'none',
          position: 'absolute',
          right: 0,
          transition:
            'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
        '& .MuiOutlinedInput-root:hover:before': {
          borderBottom: `2px solid black`,
        },
        '& .MuiSvgIcon-root': {
          color: 'rgba(0, 0, 0, 0.54)',
        },
        '& .MuiSvgIcon-root:hover': {
          color: 'rgba(0, 0, 0, 0.54)',
        },
        display: 'inline-block',
        minWidth: props.minWidth,
        verticalAlign: 'bottom',
        width: 'fit-content',
      }}
      value={valueItem}
    />
  );
};

export default StyledGroupedSelect;
