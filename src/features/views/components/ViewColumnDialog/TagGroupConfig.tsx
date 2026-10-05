import { FormControl } from '@mui/material';
import { FC, useState } from 'react';

import { COLUMN_TYPE, SelectedViewColumn } from '../types';
import ZUIFuture from 'zui/ZUIFuture';
import useTagGroups from 'features/tags/hooks/useTagGroups';
import StyledAutocomplete from 'features/smartSearch/components/inputs/StyledAutocomplete';
import { useNumericRouteParams } from 'core/hooks';

type Props = {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
};

const TagGroupConfig: FC<Props> = ({ onOutputConfigured }) => {
  const { orgId } = useNumericRouteParams();
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();
  const tagGroupsFuture = useTagGroups(orgId);

  return (
    <ZUIFuture future={tagGroupsFuture}>
      {(tagGroups) => {
        return (
          <FormControl sx={{ width: 300 }}>
            <StyledAutocomplete
              items={tagGroups.map((tagGroup) => ({
                id: tagGroup.id,
                label: tagGroup.title,
              }))}
              onChange={(ev) => {
                if (!ev.target.value) {
                  return;
                }
                const tagGroupId = +ev.target.value;
                setSelectedGroupId(tagGroupId);

                const selectedGroup = tagGroups.find(
                  (group) => group.id === tagGroupId
                );

                onOutputConfigured([
                  {
                    config: {
                      tag_group_id: tagGroupId,
                    },
                    title: selectedGroup?.title || '',
                    type: COLUMN_TYPE.TAG_GROUP,
                  },
                ]);
              }}
              value={selectedGroupId}
            />
          </FormControl>
        );
      }}
    </ZUIFuture>
  );
};

export default TagGroupConfig;
