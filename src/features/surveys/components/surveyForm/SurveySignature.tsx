import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import SurveyOption from './SurveyOption';
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
  formData: NodeJS.Dict<string | string[]>;
  survey: ZetkinSurveyExtended;
};

const SurveySignature: FC<SurveySignatureProps> = ({ formData, survey }) => {
  // const currentUser = useCurrentUser();
  const theme = useTheme();

  const [signatureType, setSignatureType] = useState<
    ZetkinSurveySignatureType | undefined
  >(formData['sig'] as ZetkinSurveySignatureType | undefined);

  const handleRadioChange = useCallback(
    (value: ZetkinSurveySignatureType) => {
      setSignatureType(value);
    },
    [setSignatureType]
  );

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="survey-signature"
        defaultValue={formData['sig'] as ZetkinSurveySignatureType | undefined}
        name="sig"
        onChange={(e) =>
          handleRadioChange(e.target.value as ZetkinSurveySignatureType)
        }
      >
        <FormLabel id="survey-signature">
          <Typography
            style={{
              color: 'black',
              fontSize: '1.5em',
              fontWeight: '500',
              marginBottom: '0.5em',
              marginTop: '0.5em',
            }}
          >
            <Msg id={messageIds.surveySignature.title} />
          </Typography>
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
                defaultValue={formData['sig.first_name']}
                label={<Msg id={messageIds.surveySignature.email.firstName} />}
                name="sig.first_name"
                required
              />
              <TextField
                defaultValue={formData['sig.last_name']}
                label={<Msg id={messageIds.surveySignature.email.lastName} />}
                name="sig.last_name"
                required
              />
              <TextField
                defaultValue={formData['sig.email']}
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
      </RadioGroup>
    </FormControl>
  );
};

export default SurveySignature;
