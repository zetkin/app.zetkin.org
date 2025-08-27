import { FC, useState } from 'react';
import { Box, Button, Popover } from '@mui/material';
import { Sell } from '@mui/icons-material';

import BaseOpConfig from './BaseOpConfig';
import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import messageIds from 'features/automations/l10n/messageIds';
import { PersonTagBulkOp } from 'features/import/types';
import useTags from 'features/tags/hooks/useTags';
import TagSelect from 'features/tags/components/TagManager/components/TagSelect';
import useTagGroups from 'features/tags/hooks/useTagGroups';
import ZUIFutures from 'zui/ZUIFutures';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useDeleteTag from 'features/tags/hooks/useDeleteTag';
import useCreateTag from 'features/tags/hooks/useCreateTag';
import useTagMutations from 'features/tags/hooks/useTagMutations';

type Props = {
  config: PersonTagBulkOp | null;
  onChange: (newConfig: PersonTagBulkOp | null) => void;
  onDelete: () => void;
};

const ApplyTagConfig: FC<Props> = ({ config, onChange, onDelete }) => {
  const { orgId } = useNumericRouteParams();
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const tagsFuture = useTags(orgId);
  const deleteTag = useDeleteTag(orgId);
  const createTag = useCreateTag(orgId);
  const { updateTag } = useTagMutations(orgId);
  const tagGroupsFuture = useTagGroups(orgId);
  const messages = useMessages(messageIds);

  return (
    <BaseOpConfig
      icon={<Sell />}
      label={messages.opConfig.opTypes.tag.typeLabel()}
      onDelete={onDelete}
    >
      <ZUIFutures futures={{ tagGroups: tagGroupsFuture, tags: tagsFuture }}>
        {({ data: { tags, tagGroups } }) => {
          const selectedTag = tags.find((tag) => tag.id == config?.tag_id);
          const appliedTag = selectedTag
            ? { ...selectedTag, value: config?.value }
            : null;

          if (appliedTag) {
            return (
              <Box sx={{ display: 'flex' }}>
                <TagChip onDelete={() => onChange(null)} tag={appliedTag} />
              </Box>
            );
          }

          return (
            <>
              <Button onClick={(ev) => setAnchorEl(ev.currentTarget)}>
                Set tag
              </Button>
              <Popover anchorEl={anchorEl} open={!!anchorEl}>
                <TagSelect
                  disabledTags={[]}
                  disableEditTags
                  groups={tagGroups}
                  onClose={() => setAnchorEl(undefined)}
                  onCreateTag={createTag}
                  onDeleteTag={deleteTag}
                  onEditTag={(newValue) => updateTag(newValue)}
                  onSelect={(tag) => {
                    onChange({
                      op: 'person.tag',
                      tag_id: tag.id,
                      value: tag.value,
                    });
                    setAnchorEl(undefined);
                  }}
                  tags={tags}
                />
              </Popover>
            </>
          );
        }}
      </ZUIFutures>
    </BaseOpConfig>
  );
};

export default ApplyTagConfig;
