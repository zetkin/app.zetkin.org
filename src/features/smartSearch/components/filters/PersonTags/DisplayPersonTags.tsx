import { Box, Chip, useMediaQuery } from '@mui/material';

import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import {
  OPERATION,
  PersonTagsFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';

const localMessageIds = messageIds.filters.personTags;

interface DisplayPersonTagProps {
  filter: SmartSearchFilterWithId<PersonTagsFilterConfig>;
}

const DisplayPersonTags = ({ filter }: DisplayPersonTagProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const op = filter.op || OPERATION.ADD;
  const { condition, tags: tagIds, min_matching } = config;
  const { data } = useTags(orgId);
  const tags = data || [];
  const isDesktop = useMediaQuery('(min-width:600px');

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
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        condition: min_matching ? (
          <UnderlinedMsg
            id={localMessageIds.condition.preview.minMatching}
            values={{
              minMatching: min_matching,
            }}
          />
        ) : (
          <UnderlinedMsg id={localMessageIds.condition.preview[condition]} />
        ),
        tags: (
          <Box
            alignItems="start"
            display="inline-flex"
            sx={{ marginTop: isDesktop ? '10px' : null }}
          >
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
