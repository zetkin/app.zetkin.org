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
      locationsByAssignmentIdAndAreaId: {},
      metricsByAssignmentId: {},
      statsByAreaAssId: {},
    },
    areas: {
      areaList: remoteList(),
      tagsByAreaId: {},
    },
    breadcrumbs: {
      crumbsByPath: {},
    },
    call: {
      activeLaneIndex: 0,
      lanes: [],
      myAssignmentsList: remoteList(),
      outgoingCalls: remoteList(),
      queueHasError: null,
      upcomingEventsList: remoteList(),
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
        eventTypesToFilterBy: [],
        geojsonToFilterBy: [],
      },
      recentlyCreatedCampaign: null,
    },
    canvass: {
      householdsByLocationId: {},
      myAssignmentsList: remoteList(),
      visitsByAssignmentAndLocationId: {},
      visitsByAssignmentId: {},
    },
    duplicates: {
      detailedPersonsList: {},
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
      unverifiedParticipantsByEventId: {},
      userEventList: remoteList(),
    },
    files: {
      fileList: remoteList(),
    },
    import: {
      importID: null,
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
        eventTypesToFilterBy: [],
        geojsonToFilterBy: [],
        orgIdsToFilterBy: [],
      },
      orgData: remoteItem(0),
      statsBySuborgId: {},
      subOrgsByOrgId: {},
      suborgsWithStats: remoteList(),
      treeDataList: remoteList(),
      userMembershipList: remoteList(),
    },
    profiles: {
      fieldsList: remoteList(),
      notesByPersonId: {},
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
      extendedSurveyBySurveyId: {},
      responseStatsBySurveyId: {},
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
