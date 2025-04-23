import Head from 'next/head';
import { GetServerSideProps } from 'next';

import EmailLayout from 'features/emails/layout/EmailLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useDebounce from 'utils/hooks/useDebounce';
import useEmail from 'features/emails/hooks/useEmail';
import useServerSide from 'core/useServerSide';
import { ZetkinEmailPostBody } from 'utils/types/zetkin';
import EmailEditor from 'features/emails/components/EmailEditor';

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

  const debouncedUpdateEmail = useDebounce(
    async (email: Partial<ZetkinEmailPostBody>) => {
      updateEmail({
        ...email,
        locked: undefined,
      });
    },
    400
  );

  if (onServer) {
    return null;
  }

  if (!email) {
    return null;
  }

  const readOnly = !!email.published;

  return (
    <>
      <Head>
        <title>{email.title}</title>
      </Head>
      <EmailEditor
        email={email}
        onSave={(email) => debouncedUpdateEmail(email)}
        readOnly={readOnly}
      />
    </>
  );
};

EmailPage.getLayout = function getLayout(page) {
  return <EmailLayout fixedHeight>{page}</EmailLayout>;
};

export default EmailPage;
