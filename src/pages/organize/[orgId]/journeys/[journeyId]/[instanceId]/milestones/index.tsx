import { GetServerSideProps } from 'next';

import JourneyInstanceLayout from 'layout/organize/JourneyInstanceLayout';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import {
  getJourneyInstanceScaffoldProps,
  JourneyDetailsPageProps,
  scaffoldOptions,
} from '../index';

export const getServerSideProps: GetServerSideProps = scaffold(
  getJourneyInstanceScaffoldProps,
  scaffoldOptions
);

const JourneyMilestonesPage: PageWithLayout<JourneyDetailsPageProps> = () => {
  return <>Hej</>;
};

JourneyMilestonesPage.getLayout = function getLayout(page) {
  return <JourneyInstanceLayout>{page}</JourneyInstanceLayout>;
};

export default JourneyMilestonesPage;
