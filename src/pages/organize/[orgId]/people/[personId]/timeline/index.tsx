import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonTimeline from 'features/profile/hooks/usePersonTimeline';
import ZUIFuture from 'zui/ZUIFuture';
import { getPersonScaffoldProps, scaffoldOptions } from '../index';

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

interface PersonTimelinePageProps {
  orgId: number;
  personId: number;
}

const PersonTimelinePage: PageWithLayout<PersonTimelinePageProps> = ({
  orgId,
  personId,
}) => {
  const { data: person } = usePerson(orgId, personId);
  const timelineFuture = usePersonTimeline(orgId, personId);

  if (!person) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {person?.first_name} {person?.last_name}
        </title>
      </Head>
      <ZUIFuture future={timelineFuture}>
        {(timeline) => (
          <ul>
            {timeline.map((entry) => (
              <li key={entry.id}>
                {entry.timestamp}:{' '}
                {entry.data.action.title || entry.data.action.activity?.title}
              </li>
            ))}
          </ul>
        )}
      </ZUIFuture>
    </>
  );
};

PersonTimelinePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonTimelinePage;
