import { Box, useMediaQuery } from '@mui/material';
import type { JSX } from 'react';

import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import {
  CONDITION_OPERATOR,
  OPERATION,
  PersonTagsFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import TagChip from 'features/tags/components/TagManager/components/TagChip';

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
        condition:
          condition === CONDITION_OPERATOR.SOME ? (
            <UnderlinedMsg
              id={localMessageIds.condition.preview.some}
              values={{
                minMatching: min_matching ?? 0,
              }}
            />
          ) : (
            <UnderlinedMsg id={localMessageIds.condition.preview[condition]} />
          ),
        tags: (
          <Box
            sx={{
              alignItems: 'start',
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: 1,
              marginTop: isDesktop ? '10px' : null,
            }}
          >
            {selectedTags.map((t) => (
              <TagChip key={t.id} size="small" tag={t} />
            ))}
          </Box>
        ),
      }}
    />
  );
};

export default DisplayPersonTags;
