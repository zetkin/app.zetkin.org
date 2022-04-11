/* eslint-disable jsx-a11y/no-autofocus */
import { Add } from '@material-ui/icons';
import { useAutocomplete } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import {
  Box,
  List,
  ListItem,
  ListSubheader,
  TextField,
} from '@material-ui/core';
import { useContext, useState } from 'react';

import TagChip from './TagChip';
import TagDialog from './TagDialog';
import TagsManagerContext from './TagsManagerContext';
import { ZetkinTag } from 'types/zetkin';

interface Group<Option> {
  key: number;
  index: number;
  group: string;
  options: Option[];
}

const TagSelect: React.FunctionComponent = () => {
  const intl = useIntl();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { assignedTags, availableTags, onAssignTag } =
    useContext(TagsManagerContext);

  const { getInputProps, getListboxProps, getRootProps, groupedOptions } =
    useAutocomplete({
      getOptionLabel: (option) => option.title,
      groupBy: (option) =>
        option.group?.title ||
        intl.formatMessage({
          id: 'misc.tags.tagsManager.ungroupedHeader',
        }),
      openOnFocus: true,
      options: availableTags,
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
                    disabled={assignedTags
                      .map((assignedTag) => assignedTag.id)
                      .includes(tag.id)}
                    onClick={() => onAssignTag(tag)}
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
      <TagDialog onClose={() => setDialogOpen(false)} open={dialogOpen} />
    </Box>
  );
};

export default TagSelect;
