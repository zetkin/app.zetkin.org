import { FC, ReactNode } from 'react';

import { useMessages } from 'core/i18n';
import SimpleLayout from 'utils/layout/SimpleLayout';
import messageIds from '../l10n/messageIds';
import useAutomations from '../hooks/useAutomations';
import { useNumericRouteParams } from 'core/hooks';

type Props = {
  children: ReactNode;
};

const AutomationListLayout: FC<Props> = ({ children }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const automations = useAutomations(orgId);

  const numActive = automations.filter(
    (automation) => automation.active
  ).length;
  const numTotal = automations.length;

  return (
    <SimpleLayout
      subtitle={messages.listPage.subtitle({ numActive, numTotal })}
      title={messages.listPage.title()}
    >
      {children}
    </SimpleLayout>
  );
};

export default AutomationListLayout;
