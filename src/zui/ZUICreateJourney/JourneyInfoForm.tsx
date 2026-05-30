import { ExpandMore } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FC, useEffect, useRef, useState } from 'react';

import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import messageIds from 'zui/l10n/messageIds';
import JourneyFieldInput from './JourneyFieldInput';
import { TagToBeAdded } from 'features/profile/types';

dayjs.extend(utc);

type ShowAllTriggeredType = 'keyboard' | 'mouse' | null;

interface JourneyInfoFormProps {
  onChange: (field: string, value: string | null | TagToBeAdded) => void;
  tags: TagToBeAdded[];
}

const JourneyInfoForm: FC<JourneyInfoFormProps> = ({ onChange, tags }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const inputRef = useRef<HTMLInputElement>();
  const [showAllClickedType, setShowAllClickedType] =
    useState<ShowAllTriggeredType>(null);

  const allTags = useTags(orgId).data ?? [];
  const selectedTags =
    tags.reduce((acc: ZetkinAppliedTag[], item) => {
      const tag = allTags.find((t) => t.id === item.id);
      if (tag) {
        return acc.concat({ ...tag, value: item.value });
      }
      return acc;
    }, []) ?? [];

  useEffect(() => {
    if (showAllClickedType === 'keyboard') {
      inputRef.current?.focus();
    }
  }, [showAllClickedType]);

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      gap={2}
      sx={{
        height: !showAllClickedType ? '' : '600px',
        overflowY: 'auto',
        p: '0 40px 20px 0',
      }}
    >
      <JourneyFieldInput
        field={'name'}
        onChange={(field, value) => onChange(field, value)}
        value={''}
      />
      {!!showAllClickedType && (
        <Box display="flex" flexDirection="column" gap={2}>
          <JourneyFieldInput
            field={'extra_name'}
            onChange={(field, value) => onChange(field, value)}
            value={''}
          />
          <JourneyFieldInput
            field={'extra_info'}
            onChange={(field, value) => onChange(field, value)}
            value={''}
          />
        </Box>
      )}
      <Box display="flex" justifyContent="flex-end">
        {!showAllClickedType && (
          <Button
            onClick={() => setShowAllClickedType('mouse')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowAllClickedType('keyboard');
              }
            }}
            startIcon={<ExpandMore />}
          >
            <Msg id={messageIds.createPerson.showAllFields} />
          </Button>
        )}
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
