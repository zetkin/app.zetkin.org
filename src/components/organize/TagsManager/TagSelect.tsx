/* eslint-disable jsx-a11y/no-autofocus */
import { Add } from '@material-ui/icons';
import { useAutocomplete } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListSubheader,
  TextField,
} from '@material-ui/core';

import TagChip from './TagChip';
import TagDialog from './TagDialog';
import { ZetkinTag } from 'types/zetkin';

interface Group<Option> {
  key: number;
  index: number;
  group: string;
  options: Option[];
}

const TagSelect: React.FunctionComponent<{
  disabledTags: ZetkinTag[];
  onSelect: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ disabledTags, tags, onSelect }) => {
  const intl = useIntl();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { getInputProps, getListboxProps, getRootProps, groupedOptions } =
    useAutocomplete({
      getOptionLabel: (option) => option.title,
      groupBy: (option) =>
        option.group?.title ||
        intl.formatMessage({
          id: 'misc.tags.tagsManager.ungroupedHeader',
        }),
      openOnFocus: true,
      options: tags,
    });

  return (
    <Box {...getRootProps()}>
      <TextField
        {...getInputProps()}
        autoFocus={true}
        fullWidth
        placeholder={intl.formatMessage({
          id: 'misc.tags.tagsManager.addTag',
        })}
        variant="outlined"
      />
      {/* Options */}
      <List {...getListboxProps()} style={{ overflowY: 'scroll' }}>
        {(groupedOptions as unknown as Group<ZetkinTag>[]).map((group) => {
          // Groups
          return (
            <List
              key={group.group}
              subheader={
                <ListSubheader component="div">{group.group}</ListSubheader>
              }
              title={group.group}
            >
              {/* Tags */}
              {group.options.map((tag) => {
                return (
                  <ListItem
                    key={tag.id}
                    button
                    disabled={disabledTags
                      .map((disabledTag) => disabledTag.id)
                      .includes(tag.id)}
                    onClick={() => onSelect(tag)}
                    tabIndex={-1}
                  >
                    <TagChip tag={tag} />
                  </ListItem>
                );
              })}
            </List>
          );
        })}
        <ListItem button onClick={() => setDialogOpen(true)}>
          <Add />
          Create Tag
        </ListItem>
      </List>
      <TagDialog
        onClose={() => setDialogOpen(false)}
        onSubmit={(tag) => tag}
        open={dialogOpen}
      />
    </Box>
  );
};

export default TagSelect;
