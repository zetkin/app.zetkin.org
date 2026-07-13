import { FC } from 'react';

import messageIds from 'features/smartSearch/l10n/messageIds';
import useJoinForm from 'features/joinForms/hooks/useJoinForm';
import UnderlinedMsg from '../../UnderlinedMsg';

type Props = {
  formId: number;
  orgId: number;
};

const localMessageIds = messageIds.filters.joinForm;

const DisplayJoinFormTitle: FC<Props> = ({ formId, orgId }) => {
  const { data } = useJoinForm(orgId, formId);

  return (
    <UnderlinedMsg
      id={localMessageIds.form}
      values={{ title: data?.title || '' }}
    />
  );
};

export default DisplayJoinFormTitle;
