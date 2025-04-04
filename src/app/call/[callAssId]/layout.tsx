import { FC, ReactNode } from 'react';

import CallLayout from 'features/call/layouts/CallLayout';

type Props = {
  children?: ReactNode;
  params: { callAssId: string };
};

const CallPageLayout: FC<Props> = ({ children, params }) => {
  const { callAssId } = params;
  return <CallLayout callAssId={callAssId}>{children}</CallLayout>;
};

export default CallPageLayout;
