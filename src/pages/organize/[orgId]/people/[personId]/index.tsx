import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { PageWithLayout } from 'types';
import { personResource } from 'api/people';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'layout/organize/SinglePersonLayout';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people', 'misc'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, personId } = ctx.params!;

  const { prefetch } = personResource(orgId as string, personId as string);
  const { state: personQueryState } = await prefetch(ctx);

  if (personQueryState?.status === 'success') {
    return {
      props: {
        orgId,
        personId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type PersonProfilePageProps = {
  orgId: string;
  personId: string;
};

const PersonProfilePage: PageWithLayout<PersonProfilePageProps> = ({
  personId,
  orgId,
}) => {
  const { data: person } = personResource(orgId, personId).useQuery();

  if (!person) return null;

  return (
    <>
      <Head>
        <title>
          {person?.first_name} {person?.last_name}
        </title>
      </Head>
      Person page here
    </>
  );
};

PersonProfilePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonProfilePage;
