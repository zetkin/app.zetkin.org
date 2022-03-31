import { useState } from 'react';
import { Box, Switch, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import ZetkinSection from 'components/ZetkinSection';
import ZetkinTag from 'components/ZetkinTag';
import { ZetkinTag as ZetkinTagType } from 'types/zetkin';

const GroupToggle: React.FunctionComponent<{
  checked?: boolean;
  onChange: () => void;
}> = ({ checked, onChange }) => {
  const intl = useIntl();
  return (
    <Box alignItems="center" display="flex">
      <Typography variant="body2">
        {intl.formatMessage({ id: 'misc.tags.tagsManager.groupTags' })}
      </Typography>
      <Switch
        checked={checked}
        color="primary"
        data-testid="TagsManager-groupToggle"
        name="Tags"
        onChange={onChange}
      />
    </Box>
  );
};

interface TagsGroups {
  [key: string]: {
    tags: ZetkinTagType[];
    title: string;
  };
}

const TagsManager: React.FunctionComponent<{
  appliedTags: ZetkinTagType[];
}> = ({ appliedTags }) => {
  const intl = useIntl();

  const [isGrouped, setIsGrouped] = useState(false);
  const groups: TagsGroups = appliedTags.reduce((acc: TagsGroups, tag) => {
    // Add to ungrouped tags list
    if (!tag.group) {
      return {
        ...acc,
        ungrouped: {
          tags: acc['ungrouped'] ? [...acc['ungrouped'].tags, tag] : [tag],
          title: intl.formatMessage({
            id: 'misc.tags.tagsManager.ungroupedHeader',
          }),
        },
      };
    }
    // Add to tags list for group
    return {
      ...acc,
      [tag.group.id]: {
        tags: acc[tag.group.id] ? [...acc[tag.group.id].tags, tag] : [tag],
        title: tag.group.title,
      },
    };
  }, {});

  return (
    <ZetkinSection
      action={
        <GroupToggle
          checked={isGrouped}
          onChange={() => setIsGrouped(!isGrouped)}
        />
      }
      title={intl.formatMessage({ id: 'misc.tags.tagsManager.title' })}
    >
      <Box>
        {/* Tags List */}
        {appliedTags.length > 0 && (
          <>
            {isGrouped ? (
              // Grouped list
              <>
                {Object.entries(groups).map(([id, group], i) => (
                  <Box key={i} mb={1}>
                    <Typography variant="overline">{group.title}</Typography>
                    <Box
                      data-testid={`TagsManager-groupedTags-${id}`}
                      display="flex"
                      flexWrap="wrap"
                      style={{ gap: 8 }}
                    >
                      {group.tags.map((tag, i) => {
                        // Tag Chip
                        return <ZetkinTag key={i} tag={tag} />;
                      })}
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              // Flat list
              <Box display="flex" flexWrap="wrap" style={{ gap: 8 }}>
                {appliedTags.map((tag, i) => {
                  // Tag Chip
                  return <ZetkinTag key={i} tag={tag} />;
                })}
              </Box>
            )}
          </>
        )}
        {/* If no tags */}
        {appliedTags.length === 0 && (
          <Typography>
            <FormattedMessage id="misc.tags.tagsManager.noTags" />
          </Typography>
        )}
      </Box>
    </ZetkinSection>
  );
};

export default TagsManager;
