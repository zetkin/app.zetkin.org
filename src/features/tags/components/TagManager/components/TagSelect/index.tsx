import useAutocomplete from '@mui/material/useAutocomplete';
import { Box, TextField } from '@mui/material';
import { FC, useContext, useState } from 'react';

import messageIds from '../../../../l10n/messageIds';
import TagDialog from 'features/tags/components/TagManager/components/TagDialog';
import TagSelectList from './TagSelectList';
import { useMessages } from 'core/i18n';
import ValueTagForm from './ValueTagForm';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { EditTag, NewTag } from '../../types';
import { filterTags, groupTags } from '../../utils';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';

interface TagSelectProps {
  disableEditTags?: boolean;
  disabledTags: ZetkinTag[];
  groups: ZetkinTagGroup[];
  ignoreValues?: boolean;
  onClose: () => void;
  onCreateTag: (tag: NewTag) => Promise<ZetkinTag>;
  onDeleteTag: (tagId: number) => void;
  onEditTag: (tag: EditTag) => void;
  onSelect: (tag: ZetkinTag) => void;
  submitCreateTagLabel?: string;
  tags: ZetkinTag[];
}

const TagSelect: FC<TagSelectProps> = ({
  disableEditTags,
  disabledTags,
  groups,
  ignoreValues = false,
  onClose,
  onCreateTag,
  onDeleteTag,
  onEditTag,
  onSelect,
  submitCreateTagLabel,
  tags,
}) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

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
        onDelete={(tagId) => {
          showConfirmDialog({
            onSubmit: () => {
              onDeleteTag(tagId);
            },
            warningText: messages.dialog.deleteWarning(),
          });
        }}
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
        submitLabel={submitCreateTagLabel}
        tag={tagToEdit}
      />
    </>
  );
};

export default TagSelect;
