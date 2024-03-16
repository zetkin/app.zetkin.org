import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import SurveyOption from './SurveyOption';
import SurveySubheading from './SurveySubheading';
// import useCurrentUser from 'features/user/hooks/useCurrentUser';

import {
  Box,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useCallback, useState } from 'react';
import {
  ZetkinSurveyExtended,
  ZetkinSurveySignatureType,
} from 'utils/types/zetkin';

export type SurveySignatureProps = {
  survey: ZetkinSurveyExtended;
};

const SurveySignature: FC<SurveySignatureProps> = ({ survey }) => {
  // const currentUser = useCurrentUser();
  const theme = useTheme();

  const [signatureType, setSignatureType] = useState<
    ZetkinSurveySignatureType | undefined
  >(undefined);

  const handleRadioChange = useCallback(
    (value: ZetkinSurveySignatureType) => {
      setSignatureType(value);
    },
    [setSignatureType]
  );

  return (
    <FormControl fullWidth>
      <RadioGroup
        aria-labelledby="survey-signature"
        name="sig"
        onChange={(e) =>
          handleRadioChange(e.target.value as ZetkinSurveySignatureType)
        }
      >
        <Box display="flex" flexDirection="column" gap={1} paddingX={2}>
          <FormLabel id="survey-signature">
            <SurveySubheading>
              <Msg id={messageIds.surveySignature.title} />
            </SurveySubheading>
          </FormLabel>

          <Box display="flex" flexDirection="column" rowGap={1}>
            {/* <SurveyOption
            control={<Radio required />}
            label={
              <Typography>
                <Msg
                  id={messageIds.surveySignature.type.user}
                  values={{
                    email: currentUser?.email ?? '',
                    person: currentUser?.first_name ?? '',
                  }}
                />
              </Typography>
            }
            value="user"
          /> */}

            <SurveyOption
              control={<Radio required />}
              label={
                <Typography>
                  <Msg id={messageIds.surveySignature.type.email} />
                </Typography>
              }
              value="email"
            />

            {signatureType === 'email' && (
              <Box
                display="flex"
                flexDirection="column"
                pt={1}
                style={{ rowGap: theme.spacing(1) }}
              >
                <TextField
                  label={
                    <Msg id={messageIds.surveySignature.email.firstName} />
                  }
                  name="sig.first_name"
                  required
                />
                <TextField
                  label={<Msg id={messageIds.surveySignature.email.lastName} />}
                  name="sig.last_name"
                  required
                />
                <TextField
                  label={<Msg id={messageIds.surveySignature.email.email} />}
                  name="sig.email"
                  required
                />
              </Box>
            )}

            {survey.signature === 'allow_anonymous' && (
              <SurveyOption
                control={<Radio required />}
                label={
                  <Typography>
                    <Msg id={messageIds.surveySignature.type.anonymous} />
                  </Typography>
                }
                value="anonymous"
              />
            )}
          </Box>
        </Box>
      </RadioGroup>
    </FormControl>
  );
};

export default SurveySignature;
