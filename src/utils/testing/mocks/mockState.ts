import { RootState } from 'core/store';
import { remoteItem, remoteList } from 'utils/storeUtils';

export default function mockState(overrides?: RootState) {
  const emptyState: RootState = {
    areaAssignments: {
      areaAssignmentList: remoteList(),
      areaGraphByAssignmentId: {},
      areaStatsByAssignmentId: {},
      areasByAssignmentId: {},
      assigneesByAssignmentId: {},
      locationsByAssignmentId: {},
      metricsByAssignmentId: {},
      statsByAreaAssId: {},
      visitsByHouseholdId: {},
    },
    areas: {
      areaList: remoteList(),
      tagsByAreaId: {},
    },
    breadcrumbs: {
      crumbsByPath: {},
    },
    call: {
      currentCallId: null,
      eventsByTargetId: {},
      outgoingCalls: remoteList(),
      stateByCallId: {},
    },
    callAssignments: {
      assignmentList: remoteList(),
      callAssignmentIdsByCampaignId: {},
      callList: remoteList(),
      callersById: {},
      simpleStatsById: {},
      statsById: {},
      userAssignmentList: remoteList(),
    },
    campaigns: {
      campaignList: remoteList(),
      campaignsByOrgId: {},
      filters: {
        customDatesToFilterBy: [null, null],
        dateFilterState: null,
      },
      recentlyCreatedCampaign: null,
    },
    canvass: {
      householdsByLocationId: {},
      myAssignmentsList: remoteList(),
      visitsByAssignmentId: {},
    },
    duplicates: {
      potentialDuplicatesList: remoteList(),
    },
    emails: {
      configList: remoteList(),
      emailList: remoteList(),
      insightsByEmailId: {},
      linksByEmailId: {},
      statsById: {},
      themeList: remoteList(),
    },
    events: {
      allEventsList: remoteList(),
      eventList: remoteList(),
      eventsByCampaignId: {},
      eventsByDate: {},
      filters: {
        selectedActions: [],
        selectedStates: [],
        selectedTypes: [],
        text: '',
      },
      locationList: remoteList(),
      participantsByEventId: {},
      pendingParticipantOps: [],
      remindingByEventId: {},
      respondentsByEventId: {},
      selectedEventIds: [],
      statsByEventId: {},
      typeList: remoteList(),
      userEventList: remoteList(),
    },
    files: {
      fileList: remoteList(),
    },
    import: {
      importResult: null,
      pendingFile: {
        selectedSheetIndex: 0,
        sheets: [],
        title: '',
      },
      preflightSummary: null,
    },
    joinForms: {
      formList: remoteList(),
      submissionList: remoteList(),
    },
    journeys: {
      journeyInstanceList: remoteList(),
      journeyInstancesByJourneyId: {},
      journeyInstancesBySubjectId: {},
      journeyList: remoteList(),
      milestonesByInstanceId: {},
      timelineUpdatesByInstanceId: {},
    },
    organizations: {
      eventsByOrgId: {},
      filters: {
        customDatesToFilterBy: [null, null],
        dateFilterState: null,
        orgIdsToFilterBy: [],
      },
      orgData: remoteItem(0),
      subOrgsByOrgId: {},
      treeDataList: remoteList(),
      userMembershipList: remoteList(),
    },
    profiles: {
      fieldsList: remoteList(),
      orgsByPersonId: {},
      personById: {},
    },
    search: {
      matchesByQuery: {},
    },
    settings: {
      officialMembershipsList: remoteList(),
    },
    smartSearch: {
      queryList: remoteList(),
      statsByFilterSpec: {},
    },
    surveys: {
      elementsBySurveyId: {},
      statsBySurveyId: {},
      submissionList: remoteList(),
      submissionsBySurveyId: {},
      surveyIdsByCampaignId: {},
      surveyList: remoteList(),
      surveysWithElementsList: remoteList(),
    },
    tags: {
      tagGroupList: remoteList(),
      tagList: remoteList(),
      tagsByPersonId: {},
    },
    tasks: {
      assignedTasksByTaskId: {},
      statsById: {},
      taskIdsByCampaignId: {},
      tasksList: remoteList(),
    },
    user: {
      membershipList: remoteList(),
      orgUserList: remoteList(),
      userItem: remoteItem('me'),
    },
    views: {
      accessByViewId: {},
      columnsByViewId: {},
      folderList: remoteList(),
      officialList: remoteList(),
      recentlyCreatedFolder: null,
      rowsByViewId: {},
      viewList: remoteList(),
    },
  };

  return {
    ...emptyState,
    ...overrides,
  };
}
