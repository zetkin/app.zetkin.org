import { ContactSupport, Event } from '@mui/icons-material';

import { ColumnChoice } from '.';
import MultiIconCardVisual from '../MultiIconCardVisual';
import SingleIconCardVisual from '../SingleIconCardVisual';
import SurveyResponseConfig from '../SurveyResponseConfig';
import SurveyResponsesConfig from '../SurveyResponsePluralConfig';
import SurveySubmitDateConfig from '../SurveySubmitDateConfig';
import theme from 'theme';
import { SelectedViewColumn, ZetkinViewColumn } from '../../types';

const { blue } = theme.palette.viewColumnGallery;

export const multipleSurveyQuestions: ColumnChoice = {
  color: blue,
  renderCardVisual: (color: string) => {
    return <MultiIconCardVisual color={color} icon={ContactSupport} />;
  },
  renderConfigForm: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => <SurveyResponsesConfig onOutputConfigured={props.onOutputConfigured} />,
};

export const singleSurveyQuestion: ColumnChoice = {
  color: blue,
  renderCardVisual: (color: string) => {
    return <SingleIconCardVisual color={color} icon={ContactSupport} />;
  },
  renderConfigForm: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => <SurveyResponseConfig onOutputConfigured={props.onOutputConfigured} />,
};

export const surveySubmitDate = {
  alreadyInView: () => {
    //This card never disables.
    return false;
  },
  color: blue,
  renderCardVisual: (color: string) => {
    return <SingleIconCardVisual color={color} icon={Event} />;
  },
  renderConfigForm: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => (
    <SurveySubmitDateConfig onOutputConfigured={props.onOutputConfigured} />
  ),
};
