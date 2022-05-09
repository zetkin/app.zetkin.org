/* eslint-disable jsx-a11y/no-autofocus */
import { Add } from '@material-ui/icons';
import { useAutocomplete } from '@material-ui/lab';
import { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListSubheader,
  TextField,
} from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import { groupTags } from './utils';
import { OnCreateTagHandler } from './types';
import TagChip from './TagChip';
import TagDialog from './TagDialog';
import { ZetkinTag } from 'types/zetkin';

const TagSelect: React.FunctionComponent<{
  disabledTags: ZetkinTag[];
  onCreateTag: OnCreateTagHandler;
  onSelect: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ disabledTags, onCreateTag, onSelect, tags }) => {
  const intl = useIntl();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    inputValue,
    getInputProps,
    getListboxProps,
    getRootProps,
    groupedOptions,
  } = useAutocomplete({
    getOptionLabel: (option) => option.title,
    open: true,
    options: tags,
  });

  const groupedFilteredTags = groupTags(
    groupedOptions,
    intl.formatMessage({
      id: 'misc.tags.tagsManager.ungroupedHeader',
    })
  );

  return (
    <Box {...getRootProps()}>
      <TextField
        {...getInputProps()}
        autoFocus
        fullWidth
        placeholder={intl.formatMessage({
          id: 'misc.tags.tagsManager.addTag',
        })}
        variant="outlined"
      />
      {/* Options */}
      <List {...getListboxProps()} style={{ overflowY: 'scroll' }}>
        {Object.values(groupedFilteredTags).map((group) => {
          // Groups
          return (
            <List
              key={group.title}
              subheader={
                <ListSubheader component="div">{group.title}</ListSubheader>
              }
              title={group.title}
            >
              {/* Tags */}
              {group.tags.map((tag) => {
                return (
                  <ListItem
                    key={tag.id}
                    button
                    disabled={disabledTags
                      .map((disabledTags) => disabledTags.id)
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
        <ListItem
          button
          data-testid="TagManager-TagSelect-createTagOpiton"
          onClick={() => setDialogOpen(true)}
        >
          <Add />
          {inputValue ? (
            <FormattedMessage
              id="misc.tags.tagsManager.createNamedTag"
              values={{
                b: (...chunks: string[]) => (
                  <>
                    &nbsp;<b>{chunks}</b>
                  </>
                ),
                name: inputValue,
              }}
            />
          ) : (
            <FormattedMessage id="misc.tags.tagsManager.createTag" />
          )}
        </ListItem>
      </List>
      <TagDialog
        onClose={() => setDialogOpen(false)}
        onSubmit={onCreateTag}
        open={dialogOpen}
        tag={inputValue ? { title: inputValue } : undefined}
      />
    </Box>
  );
};

export default TagSelect;
