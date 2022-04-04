import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { useState } from 'react';

import TagChip from './TagChip';
import { ZetkinTag } from 'types/zetkin';

const TagSelect: React.FunctionComponent<{
  disabledTags: ZetkinTag[];
  onSelect: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ disabledTags, tags, onSelect }) => {
  const intl = useIntl();
  const [value, setValue] = useState<ZetkinTag | null>();
  return (
    <Autocomplete
      getOptionDisabled={(option) =>
        disabledTags.map((tag) => tag.id).includes(option.id)
      }
      getOptionLabel={(option) => option.title}
      groupBy={(option) =>
        option.group?.title ||
        intl.formatMessage({
          id: 'misc.tags.tagsManager.ungroupedHeader',
        })
      }
      onChange={(e, value) => {
        if (value) {
          onSelect(value);
          setValue(null);
        }
      }}
      openOnFocus
      options={tags}
      renderInput={(params) => (
        <TextField
          {...params}
          data-testid="TagsManager-tagSelectTextField"
          placeholder={intl.formatMessage({
            id: 'misc.tags.tagsManager.addTag',
          })}
          variant="outlined"
        />
      )}
      renderOption={(option) => {
        return <TagChip tag={option} />;
      }}
      style={{ width: 300 }}
      value={value}
    />
  );
};

export default TagSelect;
