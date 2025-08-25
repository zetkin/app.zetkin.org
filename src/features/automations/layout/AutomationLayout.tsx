import { FC, ReactNode } from 'react';

import SimpleLayout from 'utils/layout/SimpleLayout';
import { useNumericRouteParams } from 'core/hooks';
import useAutomation from '../hooks/useAutomation';
import AutomationStatusChip from '../components/AutomationStatusChip';

type Props = {
  children: ReactNode;
};

const AutomationLayout: FC<Props> = ({ children }) => {
  const { orgId, automationId } = useNumericRouteParams();
  const automation = useAutomation(orgId, automationId);

  return (
    <SimpleLayout
      subtitle={<AutomationStatusChip automation={automation} />}
      title={automation.title}
    >
      {children}
    </SimpleLayout>
  );
};

export default AutomationLayout;
