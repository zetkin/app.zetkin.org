import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Chip } from '@material-ui/core';

import getTags from 'fetching/getTags';
import { ZetkinTag } from 'types/zetkin';
import {
  OPERATION,
  PersonTagsFilterConfig,
  SmartSearchFilterWithId,
} from 'types/smartSearch';

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
      id="misc.smartSearch.person_tags.inputString"
      values={{
        addRemoveSelect: (
          <Msg id={`misc.smartSearch.person_tags.addRemoveSelect.${op}`} />
        ),
        condition: min_matching ? (
          <Msg
            id="misc.smartSearch.condition.preview.min_matching"
            values={{
              minMatching: min_matching,
            }}
          />
        ) : (
          <Msg id={`misc.smartSearch.condition.preview.${condition}`} />
        ),
        tags: (
          <Box alignItems="start" display="inline-flex">
            {selectedTags.map((t) => (
              <Chip
                key={t.id}
                label={t.title}
                size="small"
                style={{ margin: '2px' }}
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
