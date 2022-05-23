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
  onClose: () => void;
  onCreateTag: (tag: NewTag) => Promise<ZetkinTag>;
  onEditTag: (tag: EditTag) => void;
  onSelect: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({
  disableEditTags,
  disabledTags,
  groups,
  onClose,
  onCreateTag,
  onEditTag,
  onSelect,
  tags,
}) => {
  const intl = useIntl();

  const [inputValue, setInputValue] = useState('');
  const [selectedValueTag, setSelectedValueTag] = useState<ZetkinTag | null>(
    null
  );
  const [tagValue, setTagValue] = useState<number | string | null>(null);

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

  const handleSubmitValue = () => {
    if (selectedValueTag) {
      onSelect({ ...selectedValueTag, value: tagValue || undefined });
      setSelectedValueTag(null);
      setInputValue('');
    }
  };

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
        onKeyUp={(ev) => {
          if (ev.key == 'Enter') {
            if (selectedValueTag) {
              handleSubmitValue();
            }
          } else if (ev.key == 'Escape') {
            if (selectedValueTag) {
              setSelectedValueTag(null);
            } else if (inputValue) {
              setInputValue('');
            } else {
              onClose();
            }
          }
        }}
        placeholder={
          selectedValueTag
            ? intl.formatMessage(
                { id: 'misc.tags.tagManager.addValue' },
                { tag: selectedValueTag.title }
              )
            : intl.formatMessage({
                id: 'misc.tags.tagManager.addTag',
              })
        }
        variant="outlined"
      />
      {selectedValueTag ? (
        <ValueTagForm
          inputValue={inputValue}
          onCancel={() => {
            setSelectedValueTag(null);
            setInputValue('');
          }}
          onChange={(value) => setTagValue(value)}
          onSubmit={handleSubmitValue}
          tag={selectedValueTag}
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
              setSelectedValueTag(tag);
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
        onSubmit={async (tag) => {
          if ('id' in tag) {
            // If existing tag
            onEditTag(tag);
          } else {
            // If new tag
            const createdTag = await onCreateTag(tag);
            if (createdTag.value_type) {
              setSelectedValueTag(createdTag);
            }
            setInputValue('');
          }
        }}
        open={Boolean(tagToEdit)}
        tag={tagToEdit}
      />
    </Box>
  );
};

export default TagSelect;
