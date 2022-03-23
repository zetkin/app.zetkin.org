import { useState } from 'react';
import { Box, Switch, Tooltip, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTag } from 'types/zetkin';

const TagsManager: React.FunctionComponent<{
  appliedTags: ZetkinTag[];
}> = ({ appliedTags }) => {
  const intl = useIntl();

  const [isGrouped, setIsGrouped] = useState(false);
  const hasGroups = appliedTags.some((tag) => tag.group !== null);

  return (
    <ZetkinSection
      action={
        <Tooltip
          arrow
          title={
            hasGroups
              ? ''
              : intl.formatMessage({ id: 'pages.people.person.tags.noGroups' })
          }
        >
          <Box alignItems="center" display="flex">
            <Typography variant="body2">
              {intl.formatMessage({ id: 'pages.people.person.tags.groupTags' })}
            </Typography>
            <Switch
              checked={isGrouped}
              color="primary"
              data-testid="TagsManager-groupToggle"
              disabled={!hasGroups}
              name="Tags"
              onChange={() => setIsGrouped(!isGrouped)}
            />
          </Box>
        </Tooltip>
      }
      title={intl.formatMessage({ id: 'pages.people.person.tags.title' })}
    >
      <Box>
        {/* Tags List */}
        {appliedTags.length > 0 && (
          <Box display="flex" flexWrap="wrap" style={{ gap: 8 }}>
            {appliedTags.map((tag, i) => {
              // Tag Chip
              return (
                <Tooltip key={i} arrow title={tag.description}>
                  <Box
                    bgcolor={tag.color || '#e1e1e1'}
                    borderRadius="18px"
                    fontSize={13}
                    px={2}
                    py={0.7}
                  >
                    {tag.title}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        )}
        {/* If no tags */}
        {appliedTags?.length === 0 && (
          <Typography>
            <FormattedMessage id="pages.people.person.tags.noTags" />
          </Typography>
        )}
      </Box>
    </ZetkinSection>
  );
};

export default TagsManager;
