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
      finishedCalls: remoteList(),
      lanes: [],
      myAssignmentsList: remoteList(),
      queueError: null,
      unfinishedCalls: remoteList(),
      upcomingEventsList: remoteList(),
    },
    callAssignments: {
      assignmentList: remoteList(),
      callAssignmentIdsByProjectId: {},
      callList: remoteList(),
      callersById: {},
      simpleStatsById: {},
      statsById: {},
      userAssignmentList: remoteList(),
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
      eventsByDate: {},
      eventsByProjectId: {},
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
      orgList: remoteList(),
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
    projects: {
      filters: {
        customDatesToFilterBy: [null, null],
        dateFilterState: null,
        eventTypesToFilterBy: [],
        geojsonToFilterBy: [],
      },
      projectList: remoteList(),
      projectsByOrgId: {},
      recentlyCreatedProject: null,
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
      surveyIdsByProjectId: {},
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
      taskIdsByProjectId: {},
      tasksList: remoteList(),
    },
    user: {
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
      viewsByOrgId: {},
    },
  };

  return {
    ...emptyState,
    ...overrides,
  };
}
