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
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

const TagSelect: React.FunctionComponent<{
  disabledTags: ZetkinTag[];
  groups: ZetkinTagGroup[];
  onCreateTag: OnCreateTagHandler;
  onSelect: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ disabledTags, groups, onCreateTag, onSelect, tags }) => {
  const intl = useIntl();

  const [dialogOpen, setDialogOpen] = useState<{
    defaultTitle: string;
    open: boolean;
  }>({
    defaultTitle: '',
    open: false,
  });

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
        inputProps={{
          'data-testid': 'TagManager-TagSelect-searchField',
        }}
        placeholder={intl.formatMessage({
          id: 'misc.tags.tagsManager.addTag',
        })}
        variant="outlined"
      />
      {/* Options */}
      <List
        {...getListboxProps()}
        style={{ maxHeight: '400px', overflowY: 'scroll' }}
      >
        {Object.values(groupedFilteredTags).map((group) => {
          // Groups
          return (
            <List
              key={group.title}
              subheader={
                <ListSubheader component="div" disableSticky>
                  {group.title}
                </ListSubheader>
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
                    <TagChip
                      chipProps={{ style: { cursor: 'pointer' } }}
                      tag={tag}
                    />
                  </ListItem>
                );
              })}
            </List>
          );
        })}
        <ListItem
          button
          data-testid="TagManager-TagSelect-createTagOption"
          onClick={() =>
            setDialogOpen({
              defaultTitle: inputValue,
              open: true,
            })
          }
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
        defaultTitle={dialogOpen.defaultTitle}
        groups={groups}
        onClose={() => setDialogOpen({ defaultTitle: '', open: false })}
        onSubmit={onCreateTag}
        open={dialogOpen.open}
      />
    </Box>
  );
};

export default TagSelect;
