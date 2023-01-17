import { FormControl } from '@mui/material';
import TagManager from 'features/tags/components/TagManager';
import { useState } from 'react';
import { ZetkinTag } from 'utils/types/zetkin';

import { COLUMN_TYPE, SelectedViewColumn } from '../types';

interface PersonTagConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const PersonTagConfig = ({ onOutputConfigured }: PersonTagConfigProps) => {
  const [selectedTags, setSelectedTags] = useState<ZetkinTag[]>([]);

  const makeColumns = (tags: ZetkinTag[]) => {
    return tags.map((tag) => ({
      config: { tag_id: tag.id },
      title: tag.title,
      type: COLUMN_TYPE.PERSON_TAG,
    }));
  };

  return (
    <FormControl sx={{ width: 300 }}>
      <TagManager
        assignedTags={selectedTags}
        groupTags={false}
        onAssignTag={(tag) => {
          const newAssignedTags = selectedTags.concat([tag] as ZetkinTag[]);
          setSelectedTags(newAssignedTags);
          const columns = makeColumns(newAssignedTags);
          onOutputConfigured(columns);
        }}
        onUnassignTag={(tag) => {
          const unassignedTags = selectedTags.filter((t) => t.id != tag.id);
          setSelectedTags(unassignedTags);
          const columns = makeColumns(unassignedTags);
          onOutputConfigured(columns);
        }}
      />
    </FormControl>
  );
};

export default PersonTagConfig;
