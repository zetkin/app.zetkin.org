import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Chip } from '@mui/material';

import getTags from 'features/tags/api/getTags';
import { ZetkinTag } from 'utils/types/zetkin';
import {
  OPERATION,
  PersonTagsFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledMsg from '../../UnderlinedMsg';
const localMessageIds = messageIds.filters.personTags;

interface DisplayPersonTagProps {
  filter: SmartSearchFilterWithId<PersonTagsFilterConfig>;
}

const DisplayPersonTags = ({ filter }: DisplayPersonTagProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const op = filter.op || OPERATION.ADD;
  const { condition, tags: tagIds, min_matching } = config;
  const tagsQuery = useQuery(['tags', orgId], getTags(orgId as string));
  const tags = tagsQuery?.data || [];

  // preserve the order of the tag array
  const selectedTags = tagIds.reduce((acc: ZetkinTag[], id) => {
    const tag = tags.find((tag) => tag.id === id);
    if (tag) {
      return acc.concat(tag);
    }
    return acc;
  }, []);

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <StyledMsg id={messageIds.addLimitRemoveSelect[op]} />,
        condition: min_matching ? (
          <StyledMsg
            id={localMessageIds.condition.preview.minMatching}
            values={{
              minMatching: min_matching,
            }}
          />
        ) : (
          <StyledMsg id={localMessageIds.condition.preview[condition]} />
        ),
        tags: (
          <Box alignItems="start" display="inline-flex">
            {selectedTags.map((t) => (
              <Chip
                key={t.id}
                label={t.title}
                size="small"
                sx={{ borderColor: t.color, margin: '2px' }}
                variant="outlined"
              />
            ))}
          </Box>
        ),
      }}
    />
  );
};

export default DisplayPersonTags;
