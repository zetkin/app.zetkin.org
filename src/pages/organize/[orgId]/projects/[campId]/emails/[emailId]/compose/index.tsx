import { GetServerSideProps } from 'next';

import EmailEditor from 'features/emails/components/EmailEditor';
import EmailLayout from 'features/emails/layout/EmailLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useEmail from 'features/emails/hooks/useEmail';
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

const EmailPage: PageWithLayout<Props> = ({ emailId, orgId }) => {
  const { data: email, updateEmail } = useEmail(
    parseInt(orgId),
    parseInt(emailId)
  );
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  if (!email) {
    return null;
  }

  return (
    <EmailEditor
      email={email}
      onSave={(email) => {
        updateEmail({
          ...email,
          locked: undefined,
        });
      }}
    />
  );
};

EmailPage.getLayout = function getLayout(page) {
  return <EmailLayout fixedHeight>{page}</EmailLayout>;
};

export default EmailPage;
