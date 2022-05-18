/* eslint-disable jsx-a11y/no-autofocus */
import { Add } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import { useAutocomplete } from '@material-ui/lab';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  TextField,
  Typography,
} from '@material-ui/core';
import { ChangeEventHandler, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { groupTags } from '../utils';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagChip from './TagChip';
import TagDialog from './TagDialog';
import { EditTag, NewTag } from '../types';
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

const TagSelect: React.FunctionComponent<{
  disableEditTags?: boolean;
  disabledTags: ZetkinTag[];
  groups: ZetkinTagGroup[];
  onCreateTag: (tag: NewTag) => void;
  onEditTag: (tag: EditTag) => void;
  onSelect: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({
  disableEditTags,
  disabledTags,
  groups,
  onCreateTag,
  onEditTag,
  onSelect,
  tags,
}) => {
  const intl = useIntl();

  const [tagToEdit, setTagToEdit] = useState<
    ZetkinTag | Pick<ZetkinTag, 'title'> | undefined
  >(undefined);

  const [pendingTag, setPendingTag] = useState<ZetkinTag | null>(null);
  const [pendingValue, setPendingValue] = useState('');

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
      id: 'misc.tags.tagManager.ungroupedHeader',
    })
  );

  const inputProps = getInputProps() as {
    [key: string]: unknown;
    onChange: ChangeEventHandler<HTMLInputElement>;
    value: string;
  };

  if (pendingTag) {
    inputProps.value = pendingValue;
    inputProps.onChange = (ev) => {
      setPendingValue(ev.target.value);
    };
  }

  return (
    <Box {...getRootProps()} style={{ width: '100%' }}>
      <TextField
        {...inputProps}
        autoFocus
        fullWidth
        inputProps={{
          'data-testid': 'TagManager-TagSelect-searchField',
        }}
        placeholder={
          pendingTag
            ? 'set value'
            : intl.formatMessage({
                id: 'misc.tags.tagManager.addTag',
              })
        }
        variant="outlined"
      />
      {/* Options */}
      <List
        {...getListboxProps()}
        style={{ maxHeight: '400px', overflowY: 'scroll' }}
      >
        {pendingTag && (
          <ListItem
            style={{
              alignItems: 'flex-start',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <Typography>Enter a value for tag or press ESC.</Typography>
            <TagChip tag={{ ...pendingTag, value: pendingValue }} />
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                onSelect({ ...pendingTag, value: pendingValue });
                setPendingTag(null);
                setPendingValue('');
              }}
            >
              <SubmitCancelButtons onCancel={() => undefined} />
            </form>
          </ListItem>
        )}
        {!pendingTag &&
          groupedFilteredTags.map((group) => {
            // Groups
            return (
              <List
                key={group.title}
                subheader={
                  <ListSubheader disableSticky>{group.title}</ListSubheader>
                }
                title={group.title}
              >
                {/* Tags */}
                {group.tags.map((tag) => {
                  return (
                    <ListItem key={tag.id} dense>
                      <Box
                        alignItems="center"
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <TagChip
                          disabled={disabledTags
                            .map((disabledTags) => disabledTags.id)
                            .includes(tag.id)}
                          onClick={() => {
                            if (tag.value_type) {
                              setPendingTag(tag);
                            } else {
                              onSelect(tag);
                            }
                          }}
                          tag={tag}
                        />
                        {/* Edit tag button, only show if enabled (it's enabled by default) */}
                        {!disableEditTags && (
                          <IconButton
                            data-testid={`TagManager-TagSelect-editTag-${tag.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setTagToEdit(tag);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            );
          })}
        {!pendingTag && (
          <ListItem
            button
            data-testid="TagManager-TagSelect-createTagOption"
            dense
            onClick={() =>
              setTagToEdit({
                title: inputValue,
              })
            }
          >
            <Add />
            {inputValue ? (
              <FormattedMessage
                id="misc.tags.tagManager.createNamedTag"
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
              <FormattedMessage id="misc.tags.tagManager.createTag" />
            )}
          </ListItem>
        )}
      </List>
      <TagDialog
        groups={groups}
        onClose={() => setTagToEdit(undefined)}
        onSubmit={(tag) => {
          if ('id' in tag) {
            // If existing tag
            onEditTag(tag);
          } else {
            // If new tag
            onCreateTag(tag);
          }
        }}
        open={Boolean(tagToEdit)}
        tag={tagToEdit}
      />
    </Box>
  );
};

export default TagSelect;
