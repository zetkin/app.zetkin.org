import { useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTag } from 'types/zetkin';

import { groupTags } from './utils';
import GroupToggle from './GroupToggle';
import TagsList from './TagsList';

const TagsManager: React.FunctionComponent<{
  appliedTags: ZetkinTag[];
}> = ({ appliedTags }) => {
  const intl = useIntl();

  const [isGrouped, setIsGrouped] = useState(false);
  const groupedTags = groupTags(
    appliedTags,
    intl.formatMessage({
      id: 'misc.tags.tagsManager.ungroupedHeader',
    })
  );

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
        {appliedTags.length > 0 ? (
          <TagsList
            groupedTags={groupedTags}
            isGrouped={isGrouped}
            tags={appliedTags}
          />
        ) : (
          // If no tags
          <Typography>
            <FormattedMessage id="misc.tags.tagsManager.noTags" />
          </Typography>
        )}
      </Box>
    </ZetkinSection>
  );
};

export default TagsManager;
