import { Alert } from '@mui/material';
import { useState } from 'react';
import {
  Box,
  Button,
  DialogActions,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import {
  DeleteOutline,
  PlaylistAddOutlined,
  Settings,
} from '@mui/icons-material';

import DisplayCallBlocked from '../filters/CallBlocked/DisplayCallBlocked';
import DisplayCallHistory from '../filters/CallHistory/DisplayCallHistory';
import DisplayCampaignParticipation from '../filters/CampaignParticipation/DisplayCampaignParticipation';
import DisplayMostActive from '../filters/MostActive/DisplayMostActive';
import DisplayPersonData from '../filters/PersonData/DisplayPersonData';
import DisplayPersonField from '../filters/PersonField/DisplayPersonField';
import DisplayPersonTags from '../filter/PersonTags/DisplayPersonTags';
import DisplayPersonView from '../filters/PersonView/DisplayPersonView';
import DisplayRandom from '../filters/Random/DisplayRandom';
import DisplayStartsWith from '../StartsWith/DisplayStartsWith';
import DisplaySubQuery from '../filters/SubQuery/DisplaySubQuery';
import DisplaySurveyOption from '../filters/SurveyOption/DisplaySurveyOption';
import DisplaySurveyResponse from '../filters/SurveyResponse/DisplaySurveyResponse';
import DisplaySurveySubmission from '../filters/SurveySubmission/DisplaySurveySubmission';
import DisplayTask from '../filters/Task/DisplayTask';
import DisplayUser from '../filters/User/DisplayUser';
import { Msg } from 'core/i18n';
import {
  AnyFilterConfig,
  CallBlockedFilterConfig,
  CallHistoryFilterConfig,
  CampaignParticipationConfig,
  FILTER_TYPE,
  MostActiveFilterConfig,
  PersonDataFilterConfig,
  PersonFieldFilterConfig,
  PersonTagsFilterConfig,
  PersonViewFilterConfig,
  RandomFilterConfig,
  SmartSearchFilterWithId,
  SubQueryFilterConfig,
  SurveyOptionFilterConfig,
  SurveyResponseFilterConfig,
  SurveySubmissionFilterConfig,
  TaskFilterConfig,
  UserFilterConfig,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';

const FIRST_FILTER = 'first_filter';

interface QueryOverviewProps {
  filters: SmartSearchFilterWithId<AnyFilterConfig>[];
  onCloseDialog?: () => void;
  onSaveQuery?: () => void;
  onOpenFilterGallery: () => void;
  onEditFilter: (filter: SmartSearchFilterWithId) => void;
  onDeleteFilter: (filter: SmartSearchFilterWithId) => void;
  onOpenStartsWithEditor: () => void;
  startsWithAll: boolean;
  readOnly?: boolean;
  hasSaveCancelButtons?: boolean;
}

const QueryOverview = ({
  filters,
  hasSaveCancelButtons = true,
  readOnly,
  onCloseDialog,
  onSaveQuery,
  onOpenFilterGallery,
  onEditFilter,
  onDeleteFilter,
  onOpenStartsWithEditor,
  startsWithAll,
}: QueryOverviewProps): JSX.Element => {
  const [hovered, setHovered] = useState<number | null | string>(null);
  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      justifyContent="space-between"
    >
      {readOnly && (
        <Alert severity="info">
          <Msg id={messageIds.readOnly} />
        </Alert>
      )}
      <Box maxWidth="500px" minWidth={0.5} paddingLeft={4} paddingTop={4}>
        <List>
          <ListItem key={FIRST_FILTER} style={{ padding: 0 }}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              onMouseEnter={() => (readOnly ? null : setHovered(FIRST_FILTER))}
              onMouseLeave={() => (readOnly ? null : setHovered(null))}
              width={1}
            >
              <Typography variant="body2">
                <DisplayStartsWith startsWithAll={startsWithAll} />
              </Typography>
              <Box
                flex={1}
                visibility={hovered === FIRST_FILTER ? 'visible' : 'hidden'}
              >
                <IconButton onClick={onOpenStartsWithEditor} size="small">
                  <Settings />
                </IconButton>
              </Box>
            </Box>
          </ListItem>
          {filters
            .filter((f) => f.type !== FILTER_TYPE.ALL)
            .map((filter) => (
              <ListItem key={filter.id} style={{ padding: 0 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  onMouseEnter={() => (readOnly ? null : setHovered(filter.id))}
                  onMouseLeave={() => (readOnly ? null : setHovered(null))}
                  width={1}
                >
                  <Typography variant="body2">
                    {filter.type === FILTER_TYPE.CALL_BLOCKED && (
                      <DisplayCallBlocked
                        filter={
                          filter as SmartSearchFilterWithId<CallBlockedFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.CALL_HISTORY && (
                      <DisplayCallHistory
                        filter={
                          filter as SmartSearchFilterWithId<CallHistoryFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.CAMPAIGN_PARTICIPATION && (
                      <DisplayCampaignParticipation
                        filter={
                          filter as SmartSearchFilterWithId<CampaignParticipationConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.MOST_ACTIVE && (
                      <DisplayMostActive
                        filter={
                          filter as SmartSearchFilterWithId<MostActiveFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.PERSON_DATA && (
                      <DisplayPersonData
                        filter={
                          filter as SmartSearchFilterWithId<PersonDataFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.PERSON_FIELD && (
                      <DisplayPersonField
                        filter={
                          filter as SmartSearchFilterWithId<PersonFieldFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.PERSON_TAGS && (
                      <DisplayPersonTags
                        filter={
                          filter as SmartSearchFilterWithId<PersonTagsFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.PERSON_VIEW && (
                      <DisplayPersonView
                        filter={
                          filter as SmartSearchFilterWithId<PersonViewFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.RANDOM && (
                      <DisplayRandom
                        filter={
                          filter as SmartSearchFilterWithId<RandomFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.SUB_QUERY && (
                      <DisplaySubQuery
                        filter={
                          filter as SmartSearchFilterWithId<SubQueryFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.SURVEY_OPTION && (
                      <DisplaySurveyOption
                        filter={
                          filter as SmartSearchFilterWithId<SurveyOptionFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.SURVEY_RESPONSE && (
                      <DisplaySurveyResponse
                        filter={
                          filter as SmartSearchFilterWithId<SurveyResponseFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.SURVEY_SUBMISSION && (
                      <DisplaySurveySubmission
                        filter={
                          filter as SmartSearchFilterWithId<SurveySubmissionFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.TASK && (
                      <DisplayTask
                        filter={
                          filter as SmartSearchFilterWithId<TaskFilterConfig>
                        }
                      />
                    )}
                    {filter.type === FILTER_TYPE.USER && (
                      <DisplayUser
                        filter={
                          filter as SmartSearchFilterWithId<UserFilterConfig>
                        }
                      />
                    )}
                  </Typography>
                  <Box
                    flex={1}
                    visibility={hovered === filter.id ? 'visible' : 'hidden'}
                  >
                    <IconButton
                      onClick={() => onEditFilter(filter)}
                      size="small"
                    >
                      <Settings />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteFilter(filter)}
                      size="small"
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
            ))}
        </List>
        <Box display="flex">
          <Button
            color="primary"
            disabled={readOnly}
            onClick={onOpenFilterGallery}
            startIcon={<PlaylistAddOutlined />}
            variant="outlined"
          >
            <Msg id={messageIds.buttonLabels.addNewFilter} />
          </Button>
        </Box>
      </Box>
      {hasSaveCancelButtons && (
        <DialogActions>
          <Box
            display="flex"
            justifyContent="flex-end"
            m={1}
            style={{ gap: '1rem' }}
          >
            {readOnly && (
              <Button
                color="primary"
                onClick={onCloseDialog}
                variant="outlined"
              >
                <Msg id={messageIds.buttonLabels.close} />
              </Button>
            )}
            {!readOnly && (
              <>
                <Button color="primary" onClick={onCloseDialog} variant="text">
                  <Msg id={messageIds.buttonLabels.cancel} />
                </Button>
                <Button
                  color="primary"
                  data-testid="QueryOverview-saveButton"
                  onClick={onSaveQuery}
                  variant="contained"
                >
                  <Msg id={messageIds.buttonLabels.save} />
                </Button>
              </>
            )}
          </Box>
        </DialogActions>
      )}
    </Box>
  );
};

export default QueryOverview;
