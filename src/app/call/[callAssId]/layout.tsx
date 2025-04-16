import { FC, ReactNode } from 'react';

import CallLayout from 'features/call/layouts/CallLayout';

type Props = {
  children?: ReactNode;
};

const CallPageLayout: FC<Props> = ({ children }) => {
  return <CallLayout>{children}</CallLayout>;
};

export default CallPageLayout;
