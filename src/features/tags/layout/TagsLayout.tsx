import { Button } from '@mui/material';
import { FC, ReactNode, useState } from 'react';

import messageIds from '../l10n/messageIds';
import TabbedLayout from 'utils/layout/TabbedLayout';
import TagDialog from '../components/TagManager/components/TagDialog';
import useCreateTag from '../hooks/useCreateTag';
import { useNumericRouteParams } from 'core/hooks';
import useTagGroups from '../hooks/useTagGroups';
import { ZetkinTag } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

interface TagsLayoutProps {
  children: ReactNode;
}

const TagsLayout: FC<TagsLayoutProps> = ({ children }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const createTag = useCreateTag(orgId);
  const [pendingTag, setPendingTag] = useState<
    Pick<ZetkinTag, 'title'> | undefined
  >(undefined);

  const tagGroups = useTagGroups(orgId).data || [];

  return (
    <>
      <TabbedLayout
        actionButtons={
          <Button
            onClick={() => setPendingTag({ title: '' })}
            variant="contained"
          >
            <Msg id={messageIds.tagsPage.createTagButton} />
          </Button>
        }
        baseHref={`organize/${orgId}/tags`}
        defaultTab="/"
        tabs={[{ href: '/', label: messages.tagsPage.overviewTabLabel() }]}
        title={messages.tagsPage.title()}
      >
        {children}
      </TabbedLayout>
      <TagDialog
        groups={tagGroups}
        onClose={() => setPendingTag(undefined)}
        onSubmit={(tag) => {
          if (!('id' in tag)) {
            createTag(tag);
          }
        }}
        open={!!pendingTag}
        tag={pendingTag}
      />
    </>
  );
};

export default TagsLayout;
