import Box from '@mui/system/Box';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';
import ZUIAvatar from 'zui/ZUIAvatar';

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
  const survey = useSurvey(parseInt(orgId, 10), parseInt(surveyId, 10));
  const elements = useSurveyElements(
    parseInt(orgId, 10),
    parseInt(surveyId, 10)
  );
  return (
    <>
      <h1>{survey.data?.title}</h1>

      {survey.data?.info_text && <p>{survey.data?.info_text}</p>}

      <Box alignItems="center" columnGap={1} display="flex" flexDirection="row">
        <ZUIAvatar size="md" url={`/api/orgs/${orgId}/avatar`} />
        {survey.data?.organization.title}
      </Box>

      <form>
        {(elements.data || []).map((element) => (
          <div key={element.id}>
            {element.type === 'question' && (
              <Box display="flex" flexDirection="column" maxWidth={256}>
                <label htmlFor={`${element.id}`}>
                  {element.question.question}
                </label>
                {element.question.response_type === 'text' && (
                  <input id={`${element.id}`} type="text" />
                )}
                {element.question.response_type === 'options' && (
                  <select id={`${element.id}`}>
                    {element.question.options!.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                )}
              </Box>
            )}
            {element.type === 'text' && <p>{element.text_block.content}</p>}
          </div>
        ))}
      </form>
    </>
  );
};

export default Page;
