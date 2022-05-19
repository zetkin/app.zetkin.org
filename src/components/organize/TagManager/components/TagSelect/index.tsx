/* eslint-disable jsx-a11y/no-autofocus */
import { useAutocomplete } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { Box, TextField } from '@material-ui/core';

import { groupTags } from '../../utils';
import TagDialog from '../TagDialog';
import TagSelectList from './TagSelectList';
import ValueTagForm from './ValueTagForm';
import { EditTag, NewTag } from '../../types';
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

  const [pendingTag, setPendingTag] = useState<ZetkinTag | null>(null);
  const [inputValue, setInputValue] = useState('');

  const [tagToEdit, setTagToEdit] = useState<
    ZetkinTag | Pick<ZetkinTag, 'title'> | undefined
  >(undefined);

  const { getInputProps, getListboxProps, getRootProps, groupedOptions } =
    useAutocomplete({
      getOptionLabel: (option) => option.title,
      inputValue: inputValue,
      open: true,
      options: tags,
    });

  const groupedFilteredTags = groupTags(
    groupedOptions,
    intl.formatMessage({
      id: 'misc.tags.tagManager.ungroupedHeader',
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
        onChange={(ev) => setInputValue(ev.target.value)}
        placeholder={intl.formatMessage({
          id: 'misc.tags.tagManager.addTag',
        })}
        variant="outlined"
      />
      {pendingTag ? (
        <ValueTagForm
          inputValue={inputValue}
          onCancel={() => {
            setPendingTag(null);
            setInputValue('');
          }}
          onSubmit={(value) => onSelect({ ...pendingTag, value })}
        />
      ) : (
        <TagSelectList
          disabledTags={disabledTags}
          disableEditTags={!!disableEditTags}
          groupedTags={groupedFilteredTags}
          inputValue={inputValue}
          listProps={getListboxProps()}
          onEdit={(tag) => setTagToEdit(tag)}
          onSelect={(tag) => {
            if (tag.value_type) {
              setPendingTag(tag);
              setInputValue('');
            } else {
              onSelect(tag);
            }
          }}
        />
      )}
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
