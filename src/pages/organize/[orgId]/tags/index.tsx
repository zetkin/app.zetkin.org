import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Typography, useTheme } from '@mui/material';
import { useContext, useState } from 'react';

import { groupTags } from 'features/tags/components/TagManager/utils';
import messageIds from 'features/tags/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import TagDialog from 'features/tags/components/TagManager/components/TagDialog';
import TagsLayout from 'features/tags/layout/TagsLayout';
import useDeleteTag from 'features/tags/hooks/useDeleteTag';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useTagGroups from 'features/tags/hooks/useTagGroups';
import useTagMutations from 'features/tags/hooks/useTagMutations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { Msg, useMessages } from 'core/i18n';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
  }
);

const TagsPage: PageWithLayout = () => {
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const tags = useTags(orgId).data;
  const tagGroups = useTagGroups(orgId).data || [];
  const deleteTag = useDeleteTag(orgId);
  const { updateTag } = useTagMutations(orgId);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [tagToEdit, setTagToEdit] = useState<ZetkinTag | undefined>(undefined);

  const groupedTags = groupTags(
    tags || [],
    messages.tagsPage.ungroupedHeader()
  );

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <Head>
          <title>{messages.tagsPage.title()}</title>
        </Head>
      </Head>
      <Box display="flex" flexDirection="column" gap={2}>
        {groupedTags.length === 0 && (
          <Typography>
            <Msg id={messageIds.tagsPage.noTags} />
          </Typography>
        )}
        {groupedTags.map((group) => {
          return (
            <Box
              key={group.id}
              padding={2}
              sx={{
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: 2,
              }}
            >
              <Box alignItems="center" display="flex" paddingBottom={1}>
                <Typography
                  sx={{
                    borderRight: `1px solid ${theme.palette.grey[300]}`,
                    paddingRight: 1,
                  }}
                  variant="h5"
                >
                  {group.title}
                </Typography>
                <Typography
                  sx={{ color: theme.palette.primary.main, paddingLeft: 1 }}
                  variant="h5"
                >
                  {group.tags.length}
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" style={{ gap: 4 }}>
                {group.tags.map((tag) => (
                  <TagChip
                    key={tag.id}
                    onClick={() => setTagToEdit(tag)}
                    tag={tag}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
        <TagDialog
          groups={tagGroups}
          onClose={() => setTagToEdit(undefined)}
          onDelete={(tagId) => {
            showConfirmDialog({
              onSubmit: () => {
                deleteTag(tagId);
              },
              warningText: messages.dialog.deleteWarning(),
            });
          }}
          onSubmit={(tag) => {
            if ('id' in tag) {
              updateTag(tag);
            }
          }}
          open={!!tagToEdit}
          tag={tagToEdit}
        />
      </Box>
    </>
  );
};

TagsPage.getLayout = function getLayout(page) {
  return <TagsLayout>{page}</TagsLayout>;
};

export default TagsPage;
