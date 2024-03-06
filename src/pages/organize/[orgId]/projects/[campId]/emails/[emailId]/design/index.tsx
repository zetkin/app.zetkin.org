import { GetServerSideProps } from 'next';

import EmailEditor from 'features/emails/components/EmailEditor';
import EmailLayout from 'features/emails/layout/EmailLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailWithFrame from 'features/emails/hooks/useEmailWithFrame';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, emailId } = ctx.params!;

    return {
      props: {
        campId,
        emailId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.email', 'pages.organizeEmail'],
  }
);

type Props = {
  campId: string;
  emailId: string;
  orgId: string;
};

const EmailPage: PageWithLayout<Props> = () => {
  const { orgId, emailId } = useNumericRouteParams();
  const { updateEmail } = useEmail(orgId, emailId);
  const { data: emailWithFrame } = useEmailWithFrame(orgId, emailId);
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  if (!emailWithFrame) {
    return null;
  }

  return (
    <EmailEditor
      email={emailWithFrame}
      onSave={(email) => updateEmail(email)}
    />
  );
};

EmailPage.getLayout = function getLayout(page) {
  return <EmailLayout fixedHeight>{page}</EmailLayout>;
};

export default EmailPage;
