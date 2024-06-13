import { FC, ReactNode } from 'react';

import messageIds from '../l10n/messageIds';
import TabbedLayout from 'utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';

interface TagsLayoutProps {
  children: ReactNode;
}

const TagsLayout: FC<TagsLayoutProps> = ({ children }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      baseHref={`organize/${orgId}/tags`}
      defaultTab="/"
      tabs={[{ href: '/', label: messages.tagsPage.overviewTabLabel() }]}
      title={messages.tagsPage.title()}
    >
      {children}
    </TabbedLayout>
  );
};

export default TagsLayout;
