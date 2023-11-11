import BackendApiClient from 'core/api/client/BackendApiClient';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { IncomingMessage } from 'http';
import { parse } from 'querystring';
import { scaffold } from 'utils/next';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';
import ZUIAvatar from 'zui/ZUIAvatar';
import { FC, useState } from 'react';
import { Msg, useMessages } from 'core/i18n';

import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';

import messageIds from 'features/surveys/l10n/messageIds';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

function parseRequest(
  req: IncomingMessage
): Promise<NodeJS.Dict<string | string[]>> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(parse(body));
    });
  });
}

export const getServerSideProps = scaffold(async (ctx) => {
  const { req, res } = ctx;
  const { surveyId, orgId } = ctx.params!;

  if (req.method === 'POST') {
    const form = await parseRequest(req);
    const responses: Record<
      string,
      {
        options?: number[];
        question_id: number;
        response?: string;
      }
    > = {};

    for (const name in form) {
      const isSignature = name.startsWith('sig');
      const isPrivacy = name.startsWith('privacy');
      const isMetadata = isSignature || isPrivacy;
      if (isMetadata) {
        continue;
      }

      const fields = name.split('.');
      const questionId = fields[0];
      const questionType = fields[1];

      if (typeof responses[questionId] === 'undefined') {
        responses[questionId] = {
          question_id: parseInt(fields[0]),
        };
      }

      if (questionType == 'options') {
        if (Array.isArray(form[name])) {
          responses[questionId].options = (form[name] as string[]).map((o) =>
            parseInt(o)
          );
        } else {
          responses[questionId].options = [parseInt((form[name] as string)!)];
        }
      } else if (questionType == 'text') {
        responses[questionId].response = form[name] as string;
      }
    }

    let signature: null | {
      email: string;
      first_name: string;
      last_name: string;
    } = null;
    // TODO: handle other signature types
    if (form.sig == 'email') {
      signature = {
        email: form['sig.email'] as string,
        first_name: form['sig.first_name'] as string,
        last_name: form['sig.last_name'] as string,
      };
    }

    const apiClient = new BackendApiClient(req.headers);
    const requestUrl = `/api/orgs/${orgId}/surveys/${surveyId}/submissions`;
    try {
      await apiClient.post(requestUrl, {
        responses: Object.values(responses),
        signature,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    res.writeHead(302, {
      Location: `/o/${orgId}/surveys/${surveyId}/submitted`,
    });
    res.end();
  }

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
  const elements = useSurveyElements(
    parseInt(orgId, 10),
    parseInt(surveyId, 10)
  );
  const messages = useMessages(messageIds);
  const survey = useSurvey(parseInt(orgId, 10), parseInt(surveyId, 10));

  const [selectedOption, setSelectedOption] = useState(null);
  const [customInput, setCustomInput] = useState({
    email: '',
    name: '',
  });

  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  const handleCustomInputChange = (field, value) => {
    setCustomInput((prevInput) => ({
      ...prevInput,
      [field]: value,
    }));
  };

  const currentUser = useCurrentUser();

  return (
    <>
      <h1>{survey.data?.title}</h1>

      {survey.data?.info_text && <p>{survey.data?.info_text}</p>}

      <Box alignItems="center" columnGap={1} display="flex" flexDirection="row">
        <ZUIAvatar size="md" url={`/api/orgs/${orgId}/avatar`} />
        {survey.data?.organization.title}
      </Box>

      <form method="post">
        {(elements.data || []).map((element) => (
          <div key={element.id}>
            {element.type === 'question' && (
              <Box display="flex" flexDirection="column" maxWidth={256}>
                <label htmlFor={`input-${element.id}`}>
                  {element.question.question}
                </label>
                {element.question.response_type === 'text' && (
                  <input
                    id={`input-${element.id}`}
                    name={`${element.id}.text`}
                    type="text"
                  />
                )}
                {element.question.response_type === 'options' && (
                  <select
                    id={`input-${element.id}`}
                    name={`${element.id}.options`}
                  >
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
        <FormControlLabel
          control={<Checkbox required />}
          data-testid="Survey-acceptTerms"
          label={<Msg id={messageIds.surveyForm.accept} />}
        />
        <Typography>
          <Msg
            id={messageIds.surveyForm.termsDescription}
            values={{ organization: survey.data?.organization.title ?? '' }}
          />
        </Typography>
        <Typography>
          <Link
            href={messages.surveyForm.policy.link()}
            rel="noreferrer"
            target="_blank"
          >
            <Msg id={messageIds.surveyForm.policy.text} />
          </Link>
        </Typography>
        <Button
          color="primary"
          data-testid="Survey-submit"
          type="submit"
          variant="contained"
        >
          {messages.surveyForm.submit()}
        </Button>

        <Typography>
          <Msg id={messageIds.surveyForm.signOptions} />
        </Typography>

        <RadioGroup
          onChange={(e) => handleRadioChange(e.target.value)}
          value={selectedOption}
        >
          <FormControlLabel
            control={<Radio />}
            label={
              <Typography>
                <Msg
                  id={messageIds.surveyForm.authenticatedOption}
                  values={{
                    email: currentUser?.email,
                    person: currentUser?.first_name,
                  }}
                />
              </Typography>
            }
            value="authenticated"
          />

          <FormControlLabel
            control={<Radio />}
            label={
              <div>
                <Typography>
                  <Msg id={messageIds.surveyForm.nameEmailOption} />
                </Typography>
                {selectedOption === 'name+email' && (
                  <>
                    <TextField
                      label="Name"
                      onChange={(e) =>
                        handleCustomInputChange('name', e.target.value)
                      }
                      value={customInput.name}
                    />
                    <TextField
                      label="Email"
                      onChange={(e) =>
                        handleCustomInputChange('email', e.target.value)
                      }
                      value={customInput.email}
                    />
                  </>
                )}
              </div>
            }
            value="name+email"
          />
          {survey.data?.signature === 'allow_anonymous' && (
            <FormControlLabel
              control={<Radio />}
              label={
                <Typography>
                  <Msg id={messageIds.surveyForm.anonymousOption} />
                </Typography>
              }
              value="anonymous"
            />
          )}
        </RadioGroup>
      </form>
    </>
  );
};

export default Page;
