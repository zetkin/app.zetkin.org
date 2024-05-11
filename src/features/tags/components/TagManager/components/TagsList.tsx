import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { ZetkinTag } from 'utils/types/zetkin';
import { Box, Theme, Typography } from '@mui/material';

import { groupTags } from '../utils';
import TagChip from './TagChip';

import messageIds from '../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface StyleProps {
  clickable: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  chip: {
    borderColor: theme.palette.grey[500],
    borderRadius: '1em',
    borderWidth: '1px',
    color: theme.palette.text.secondary,
    cursor: ({ clickable }) => (clickable ? 'pointer' : 'default'),
    display: 'flex',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
    textOverflow: 'ellipsis',
  },
}));

const PersonLink: React.FunctionComponent<{
  capOverflowHref?: string;
  children: React.ReactNode;
}> = ({ children, capOverflowHref }) => {
  if (capOverflowHref) {
    return (
      <NextLink href={capOverflowHref} legacyBehavior passHref>
        {children}
      </NextLink>
    );
  }
  return children as React.ReactElement;
};

const TagsList: React.FunctionComponent<{
  cap?: number;
  capOverflowHref?: string;
  isGrouped: boolean;
  onUnassignTag?: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ cap = Infinity, capOverflowHref, isGrouped, onUnassignTag, tags }) => {
  const classes = useStyles({
    clickable: !!capOverflowHref,
  });
  const messages = useMessages(messageIds);

  const renderCappedTags = (tags: ZetkinTag[], capOverflowHref?: string) => {
    const cappedTags = tags.slice(0, cap);
    const hiddenTags = tags.slice(cap);
    const isCapped = tags.length > cappedTags.length;

    return (
      <>
        {cappedTags.map((tag) => {
          return <TagChip key={tag.id} onDelete={onUnassignTag} tag={tag} />;
        })}
        {isCapped ? (
          <PersonLink capOverflowHref={capOverflowHref}>
            <Box border={2} className={classes.chip}>
              {`+${hiddenTags.length}`}
            </Box>
          </PersonLink>
        ) : null}
      </>
    );
  };

  if (isGrouped) {
    const groupedTags = groupTags(tags, messages.manager.ungroupedHeader());

    return (
      <>
        {groupedTags.map((group, i) => {
          return (
            <Box key={i} mb={1}>
              <Typography variant="overline">{group.title}</Typography>
              <Box
                data-testid={`TagManager-groupedTags-${group.id}`}
                display="flex"
                flexWrap="wrap"
                style={{ gap: 4 }}
              >
                {renderCappedTags(group.tags, capOverflowHref)}
              </Box>
            </Box>
          );
        })}
      </>
    );
  }

  //   Flat list of tags
  const sortedTags = tags
    .concat()
    .sort((tag0, tag1) => tag0.title.localeCompare(tag1.title));

  return (
    <Box display="flex" flexWrap="wrap" style={{ gap: 4 }}>
      {renderCappedTags(sortedTags, capOverflowHref)}
    </Box>
  );
};

export default TagsList;
