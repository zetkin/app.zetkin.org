import { FC } from 'react';

import { ZetkinEmail } from 'utils/types/zetkin';

type Props = {
  email: ZetkinEmail;
  emailHtml: string;
};

const PublicEmailPage: FC<Props> = ({ email, emailHtml }) => {
  return (
    <iframe
      srcDoc={emailHtml}
      style={{
        borderWidth: 0,
        height: '100vh',
        width: '100vw',
      }}
      title={email.subject || ''}
    />
  );
};

export default PublicEmailPage;
