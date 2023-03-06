import useAutocomplete from '@mui/material/useAutocomplete';
import { useState } from 'react';
import { Box, TextField } from '@mui/material';

import TagDialog from 'features/tags/components/TagManager/components/TagDialog';
import TagSelectList from './TagSelectList';
import ValueTagForm from './ValueTagForm';
import { EditTag, NewTag } from '../../types';
import { filterTags, groupTags } from '../../utils';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';

import messageIds from '../../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const TagSelect: React.FunctionComponent<{
  disableEditTags?: boolean;
  disabledTags: ZetkinTag[];
  groups: ZetkinTagGroup[];
  ignoreValues?: boolean;
  onClose: () => void;
  onCreateTag: (tag: NewTag) => Promise<ZetkinTag>;
  onEditTag: (tag: EditTag) => void;
  onSelect: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({
  disableEditTags,
  disabledTags,
  groups,
  ignoreValues = false,
  onClose,
  onCreateTag,
  onEditTag,
  onSelect,
  tags,
}) => {
  const messages = useMessages(messageIds);

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
      filterOptions: (options, { inputValue }) =>
        filterTags(options, inputValue),
      getOptionLabel: (option) => option.title,
      inputValue: inputValue,
      open: true,
      options: tags,
    });

  const groupedFilteredTags = groupTags(
    groupedOptions as ZetkinTag[],
    messages.manager.ungroupedHeader()
  );

  const handleSubmitValue = () => {
    if (selectedValueTag) {
      onSelect({ ...selectedValueTag, value: tagValue || undefined });
      setSelectedValueTag(null);
      setInputValue('');
    }
  };

  return (
    <>
      <Box {...getRootProps()}>
        {/* eslint-disable jsx-a11y/no-autofocus */}
        <TextField
          autoFocus
          fullWidth
          inputProps={{
            ...getInputProps(),
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
              ? messages.manager.addValue({ tag: selectedValueTag.title })
              : messages.manager.addTag()
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
              if (tag.value_type && !ignoreValues) {
                setSelectedValueTag(tag);
                setInputValue('');
              } else {
                onSelect(tag);
              }
            }}
          />
        )}
      </Box>
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
    </>
  );
};

export default TagSelect;
