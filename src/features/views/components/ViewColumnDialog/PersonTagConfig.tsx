import { FormControl } from '@mui/material';
import { useState } from 'react';

import TagManager from 'features/tags/components/TagManager';
import { ZetkinTag } from 'utils/types/zetkin';
import { COLUMN_TYPE, SelectedViewColumn } from '../types';

interface PersonTagConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const PersonTagConfig = ({ onOutputConfigured }: PersonTagConfigProps) => {
  const [selectedTags, setSelectedTags] = useState<ZetkinTag[]>([]);

  const onChangeTags = (tags: ZetkinTag[]) => {
    setSelectedTags(tags);
    const columns = tags.map((tag) => ({
      config: { tag_id: tag.id },
      title: tag.title,
      type: COLUMN_TYPE.PERSON_TAG,
    }));
    onOutputConfigured(columns);
  };

  return (
    <FormControl sx={{ width: 300 }}>
      <TagManager
        assignedTags={selectedTags}
        disableEditTags={true}
        groupTags={false}
        ignoreValues={true}
        onAssignTag={(tag) => {
          const newAssignedTags = selectedTags.concat([tag] as ZetkinTag[]);
          onChangeTags(newAssignedTags);
        }}
        onUnassignTag={(tag) => {
          const unassignedTags = selectedTags.filter((t) => t.id != tag.id);
          onChangeTags(unassignedTags);
        }}
      />
    </FormControl>
  );
};

export default PersonTagConfig;
