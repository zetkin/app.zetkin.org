import { Box } from '@mui/material';
import { FC } from 'react';

import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinAppliedTag, ZetkinCreateJourney } from 'utils/types/zetkin';
import messageIds from 'zui/l10n/messageIds';
import JourneyFieldInput from './JourneyFieldInput';
import { TagToBeAdded } from 'features/profile/types';

interface JourneyInfoFormProps {
  onChange: (field: string, value: string | null | TagToBeAdded) => void;
  journeyInfo: ZetkinCreateJourney;
  tags: TagToBeAdded[];
}

const JourneyInfoForm: FC<JourneyInfoFormProps> = ({
  onChange,
  journeyInfo,
  tags,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);

  const allTags = useTags(orgId).data ?? [];
  const selectedTags =
    tags.reduce((acc: ZetkinAppliedTag[], item) => {
      const tag = allTags.find((t) => t.id === item.id);
      if (tag) {
        return acc.concat({ ...tag, value: item.value });
      }
      return acc;
    }, []) ?? [];

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      gap={2}
      sx={{
        height: '',
        overflowY: 'auto',
        p: '0 40px 20px 0',
      }}
    >
      <Box display="flex" mt={1}>
        <JourneyFieldInput
          field={'title'}
          onChange={(field, value) => {
            onChange(field, value);
            onChange('singular_label', value);
          }}
          required
          value={journeyInfo.title || ''}
        />
      </Box>
      <Box display="flex" mt={1}>
        <Box mr={2} width="50%">
          <JourneyFieldInput
            field={'plural_label'}
            onChange={(field, value) => onChange(field, value)}
            required
            value={journeyInfo.plural_label || ''}
          />
        </Box>
        <Box width="50%">
          <JourneyFieldInput
            field={'singular_label'}
            onChange={(field, value) => onChange(field, value)}
            required
            value={journeyInfo.singular_label || ''}
          />
        </Box>
      </Box>
      <TagManagerSection
        assignedTags={selectedTags}
        onAssignTag={(tag) => {
          onChange('tags', { id: tag.id, value: tag.value });
        }}
        onUnassignTag={(tag) => {
          onChange('tags', { id: tag.id, value: tag.value });
        }}
        submitCreateTagLabel={messages.createPerson.tagCreateAndApplyLabel()}
      />
    </Box>
  );
};

export default JourneyInfoForm;
