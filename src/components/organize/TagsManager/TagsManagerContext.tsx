/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from 'react';
import { useIntl } from 'react-intl';

import { groupTags } from './utils';
import { TagsGroups } from './types';
import { ZetkinTag } from 'types/zetkin';

const TagsManagerContext = createContext({
  assignedTags: [] as ZetkinTag[],
  availableTags: [] as ZetkinTag[],
  groupedAssignedTags: {} as TagsGroups,
  onAssignTag: (tag: ZetkinTag) => {},
  onCreateGroup: (group: { title: string }) => {},
  onUnassignTag: (tag: ZetkinTag) => {},
});

const TagsManagerContextProvider: React.FunctionComponent<{
  assignedTags: ZetkinTag[];
  availableTags: ZetkinTag[];
  onAssignTag: (tag: ZetkinTag) => void;
  onCreateGroup: (group: { title: string }) => void;
  onUnassignTag: (tag: ZetkinTag) => void;
}> = ({
  children,
  assignedTags,
  availableTags,
  onAssignTag,
  onUnassignTag,
  onCreateGroup,
}) => {
  const intl = useIntl();

  const groupedAssignedTags = groupTags(
    assignedTags,
    intl.formatMessage({
      id: 'misc.tags.tagsManager.ungroupedHeader',
    })
  );

  return (
    <TagsManagerContext.Provider
      value={{
        assignedTags,
        availableTags,
        groupedAssignedTags,
        onAssignTag,
        onCreateGroup,
        onUnassignTag,
      }}
    >
      {children};
    </TagsManagerContext.Provider>
  );
};

export default TagsManagerContext;

export { TagsManagerContextProvider };
