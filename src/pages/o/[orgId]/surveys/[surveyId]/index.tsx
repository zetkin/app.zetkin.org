import { FC } from 'react';
import { scaffold } from 'utils/next';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { surveyId, orgId } = ctx.params!;

  return {
    props: {
      orgId,
      surveyId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  orgId: string;
  surveyId: string;
};

const Page: FC<PageProps> = ({ orgId, surveyId }) => {
  const elements = useSurveyElements(parseInt(orgId, 10), parseInt(surveyId, 10));
  return (
    <>
      <h1>
        Page for org {orgId}, survey {surveyId}
      </h1>

      <form>
        {(elements.data || []).map((element) => (
          <div key={element.id}>
            {element.type === 'question' && (
              <label>{element.question.question}</label>
            )}
            {element.type === 'text' && (
              <p>{element.text_block.content}</p>
            )}
          </div>
        ))}
      </form>
    </>
  );
};

export default Page;
