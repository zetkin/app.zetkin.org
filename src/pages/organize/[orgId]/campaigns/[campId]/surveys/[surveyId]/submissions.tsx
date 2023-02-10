import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyLayout from 'features/surveys/layout/SurveyLayout';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, surveyId } = ctx.params!;

    return {
      props: {
        campId,
        orgId,
        surveyId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.surveys'],
  }
);

interface SubmissionsPageProps {
  campId: string;
  orgId: string;
  surveyId: string;
}

const SubmissionsPage: PageWithLayout<SubmissionsPageProps> = () => {
  return <></>;
};
SubmissionsPage.getLayout = function getLayout(page, props) {
  return (
    <SurveyLayout
      campaignId={props.campId}
      orgId={props.orgId}
      surveyId={props.surveyId}
    >
      {page}
    </SurveyLayout>
  );
};

export default SubmissionsPage;
