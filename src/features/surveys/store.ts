import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { personUpdated } from 'features/profile/store';
import { SurveyStats } from './rpc/getSurveyStats';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurvey,
  ZetkinSurveyElement,
  ZetkinSurveyElementOrder,
  ZetkinSurveyExtended,
  ZetkinSurveyOption,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

export interface SurveysStoreSlice {
  elementsBySurveyId: Record<number, RemoteList<ZetkinSurveyElement>>;
  submissionList: RemoteList<ZetkinSurveySubmission>;
  submissionsBySurveyId: Record<number, RemoteList<ZetkinSurveySubmission>>;
  statsBySurveyId: Record<number, RemoteItem<SurveyStats>>;
  surveyIdsByCampaignId: Record<number, RemoteList<{ id: string | number }>>;
  surveyList: RemoteList<ZetkinSurvey>;
  surveysWithElementsList: RemoteList<ZetkinSurveyExtended>;
}

const initialState: SurveysStoreSlice = {
  elementsBySurveyId: {},
  statsBySurveyId: {},
  submissionList: remoteList(),
  submissionsBySurveyId: {},
  surveyIdsByCampaignId: {},
  surveyList: remoteList(),
  surveysWithElementsList: remoteList(),
};

const surveysSlice = createSlice({
  extraReducers: (builder) =>
    builder.addCase(personUpdated, (state, action) => {
      const person = action.payload;
      const item = state.submissionList.items.find(
        (item) => item?.data?.respondent?.id === person.id
      );

      if (item?.data?.respondent) {
        const respondent = item.data.respondent;

        if (person.email) {
          respondent.email = person.email;
        }
        if (person.first_name) {
          respondent.first_name = person.first_name;
        }
        if (person.last_name) {
          respondent.last_name = person.last_name;
        }
      }
      const submissionsUpdated = state.submissionList.items
        .map((item) => item.data)
        .filter((data): data is ZetkinSurveySubmission => data !== null);

      addSubmissionToState(state, submissionsUpdated);
    }),

  initialState,
  name: 'surveys',
  reducers: {
    campaignSurveyIdsLoad: (state, action: PayloadAction<number>) => {
      const campaignId = action.payload;
      if (!state.surveyIdsByCampaignId[campaignId]) {
        state.surveyIdsByCampaignId[campaignId] = remoteList();
      }
      state.surveyIdsByCampaignId[campaignId].isLoading = true;
    },
    campaignSurveyIdsLoaded: (
      state,
      action: PayloadAction<[number, { id: string | number }[]]>
    ) => {
      const [campaignId, surveyIds] = action.payload;
      const timestamp = new Date().toISOString();

      state.surveyIdsByCampaignId[campaignId] = remoteList(surveyIds);
      state.surveyIdsByCampaignId[campaignId].loaded = timestamp;
    },
    elementAdded: (
      state,
      action: PayloadAction<[number, ZetkinSurveyElement]>
    ) => {
      const [surveyId, newElement] = action.payload;
      if (!state.elementsBySurveyId[surveyId]) {
        state.elementsBySurveyId[surveyId] = remoteList();
      }
      state.elementsBySurveyId[surveyId].items = [
        ...state.elementsBySurveyId[surveyId].items,
        remoteItem(newElement.id, { data: newElement }),
      ];
    },
    elementDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [surveyId, elemId] = action.payload;
      const curItems = state.elementsBySurveyId[surveyId]?.items || [];

      const elementItem = curItems.find((elem) => elem.id === elemId);

      if (elementItem) {
        elementItem.deleted = true;
        state.elementsBySurveyId[surveyId].isStale = true;
      }
    },
    elementOptionAdded: (
      state,
      action: PayloadAction<[number, number, ZetkinSurveyOption]>
    ) => {
      const [surveyId, elemId, newOption] = action.payload;
      const elementItem = state.elementsBySurveyId[surveyId].items.find(
        (item) => item.id == elemId
      );
      if (
        elementItem?.data?.type === ELEMENT_TYPE.QUESTION &&
        elementItem?.data?.question.response_type === RESPONSE_TYPE.OPTIONS
      ) {
        elementItem.data.question.options?.push(newOption);
      }
    },
    elementOptionDeleted: (
      state,
      action: PayloadAction<[number, number, number]>
    ) => {
      const [surveyId, elemId, optionId] = action.payload;
      const elementItem = state.elementsBySurveyId[surveyId].items.find(
        (item) => item.id == elemId
      );
      if (
        elementItem?.data?.type === ELEMENT_TYPE.QUESTION &&
        elementItem?.data?.question.response_type === RESPONSE_TYPE.OPTIONS
      ) {
        elementItem.data.question.options =
          elementItem.data.question.options?.filter(
            (option) => option.id !== optionId
          );
      }
    },
    elementOptionUpdated: (
      state,
      action: PayloadAction<[number, number, number, ZetkinSurveyOption]>
    ) => {
      const [surveyId, elemId, optionId, updatedOption] = action.payload;
      const elementItem = state.elementsBySurveyId[surveyId].items.find(
        (item) => item.id == elemId
      );
      if (
        elementItem?.data?.type === ELEMENT_TYPE.QUESTION &&
        elementItem?.data?.question.response_type === RESPONSE_TYPE.OPTIONS
      ) {
        elementItem.data.question.options =
          elementItem.data.question.options?.map((oldOption) =>
            oldOption.id == optionId ? updatedOption : oldOption
          );
      }
    },
    elementOptionsReordered: (
      state,
      action: PayloadAction<[number, number, ZetkinSurveyElementOrder]>
    ) => {
      const [surveyId, elemId, newOrder] = action.payload;
      const elementItem = state.elementsBySurveyId[surveyId].items.find(
        (item) => item.id == elemId
      );

      if (
        elementItem?.data?.type == ELEMENT_TYPE.QUESTION &&
        elementItem?.data?.question.response_type == RESPONSE_TYPE.OPTIONS
      ) {
        elementItem.data.question.options = elementItem.data.question.options
          ?.concat()
          .sort(
            (o0, o1) =>
              newOrder.default.indexOf(o0.id) - newOrder.default.indexOf(o1.id)
          );
      }
    },
    elementUpdated: (
      state,
      action: PayloadAction<[number, number, ZetkinSurveyElement]>
    ) => {
      const [surveyId, elemId, updatedElement] = action.payload;
      state.elementsBySurveyId[surveyId].items = state.elementsBySurveyId[
        surveyId
      ].items.map((item) =>
        item.id == elemId ? remoteItem(elemId, { data: updatedElement }) : item
      );
    },
    elementsLoad: (state, action: PayloadAction<number>) => {
      const surveyId = action.payload;
      if (!state.elementsBySurveyId[surveyId]) {
        state.elementsBySurveyId[surveyId] = remoteList();
      }
      state.elementsBySurveyId[surveyId].isLoading = true;
    },
    elementsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinSurveyElement[]]>
    ) => {
      const [surveyId, elements] = action.payload;
      state.elementsBySurveyId[surveyId] = remoteList(elements);
      state.elementsBySurveyId[surveyId].loaded = new Date().toISOString();
    },
    elementsReordered: (
      state,
      action: PayloadAction<[number, ZetkinSurveyElementOrder]>
    ) => {
      const [surveyId, newOrder] = action.payload;
      const elementList = state.elementsBySurveyId[surveyId];
      elementList.items = elementList.items
        .concat()
        .sort(
          (el0, el1) =>
            newOrder.default.indexOf(el0.data?.id ?? 0) -
            newOrder.default.indexOf(el1.data?.id ?? 0)
        );
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const surveyId = action.payload;
      if (!state.statsBySurveyId[surveyId]) {
        state.statsBySurveyId[surveyId] = remoteItem(surveyId);
      }
      state.statsBySurveyId[surveyId].isLoading = true;
    },
    statsLoaded: (state, action: PayloadAction<[number, SurveyStats]>) => {
      const [surveyId, stats] = action.payload;
      state.statsBySurveyId[surveyId].data = stats;
      state.statsBySurveyId[surveyId].isLoading = false;
      state.statsBySurveyId[surveyId].loaded = new Date().toISOString();
      state.statsBySurveyId[surveyId].isStale = false;
    },
    submissionLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.submissionList.items.find((item) => item.id == id);
      state.submissionList.items = state.submissionList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    submissionLoaded: (
      state,
      action: PayloadAction<ZetkinSurveySubmission>
    ) => {
      // TODO: Segregate submission content from submission list
      const submission = action.payload;
      const item = state.submissionList.items.find(
        (item) => item.id == submission.id
      );
      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }
      addSubmissionToState(state, [submission]);
      state.submissionsBySurveyId[submission.survey.id].isLoading = false;
      item.data = submission;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    surveyCreate: (state) => {
      state.surveyList.isLoading = true;
    },
    surveyCreated: (state, action: PayloadAction<ZetkinSurveyExtended>) => {
      const survey = action.payload;
      state.surveyList.isLoading = false;
      state.surveyList.items.push(remoteItem(survey.id, { data: survey }));
      state.elementsBySurveyId[survey.id] = remoteList();

      if (survey.campaign) {
        if (!state.surveyIdsByCampaignId[survey.campaign.id]) {
          state.surveyIdsByCampaignId[survey.campaign.id] = remoteList();
        }
        state.surveyIdsByCampaignId[survey.campaign.id].items.push(
          remoteItem(survey.id)
        );
      }
    },
    surveyDeleted: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.surveyList.items.find((item) => item.id == id);
      if (item) {
        item.deleted = true;
      }
    },
    surveyLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.surveyList.items.find((item) => item.id == id);
      state.elementsBySurveyId[id] == remoteList();
      state.surveyList.items = state.surveyList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    surveyLoaded: (state, action: PayloadAction<ZetkinSurveyExtended>) => {
      const survey = action.payload;
      const item = state.surveyList.items.find((item) => item.id == survey.id);
      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = survey;
      item.isLoading = false;
      item.loaded = new Date().toISOString();

      state.elementsBySurveyId[survey.id] = remoteList(survey.elements);
    },
    surveySubmissionUpdate: (
      state,
      action: PayloadAction<[number, string[]]>
    ) => {
      const [submissionId, mutating] = action.payload;
      const item = state.submissionList.items.find(
        (item) => item.id == submissionId
      );
      if (item) {
        item.mutating = mutating;
      }
    },
    surveySubmissionUpdated: (
      state,
      action: PayloadAction<ZetkinSurveySubmission>
    ) => {
      const submission = action.payload;
      const item = state.submissionList.items.find(
        (item) => item.id == submission.id
      );
      if (item) {
        item.data = { ...item.data, ...submission };
        item.mutating = [];
        state.statsBySurveyId[submission.survey.id].isStale = true;
      }
      const submissions = state.submissionsBySurveyId[submission.survey.id];
      if (submissions) {
        const itemCopy = submissions.items.find(
          (item) => item.id == submission.id
        );
        if (itemCopy) {
          itemCopy.data = { ...itemCopy.data, ...submission };
          itemCopy.mutating = [];
        }
      }
    },
    surveysLoad: (state) => {
      state.surveyList.isLoading = true;
    },
    surveysLoaded: (state, action: PayloadAction<ZetkinSurvey[]>) => {
      const surveys = action.payload;
      const timestamp = new Date().toISOString();
      state.surveyList = remoteList(surveys);
      state.surveyList.loaded = timestamp;
      state.surveyList.items.forEach((item) => (item.loaded = timestamp));
    },
    /* eslint-disable-next-line */
    surveySubmissionsLoad: (state, action: PayloadAction<number>) => {
      state.submissionsBySurveyId[action.payload] = remoteList();
      state.submissionsBySurveyId[action.payload].isLoading = true;
      state.submissionList.isLoading = true;
    },
    surveySubmissionsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinSurveySubmission[]]>
    ) => {
      const [surveyId, submissions] = action.payload;
      addSubmissionToState(state, submissions);
      state.submissionList.loaded = new Date().toISOString();
      state.submissionsBySurveyId[surveyId].isLoading = false;
      state.submissionsBySurveyId[surveyId].loaded = new Date().toISOString();
    },
    surveyUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [surveyId, mutating] = action.payload;
      const item = state.surveyList.items.find((item) => item.id == surveyId);
      if (item) {
        item.mutating = mutating;
      }
    },
    surveyUpdated: (state, action: PayloadAction<ZetkinSurvey>) => {
      const survey = action.payload;
      const item = state.surveyList.items.find((item) => item.id == survey.id);
      if (item) {
        item.data = { ...item.data, ...survey };
        item.mutating = [];
      }
    },
    surveysWithElementsLoad: (state) => {
      state.surveysWithElementsList.isLoading = true;
    },
    surveysWithElementsLoaded: (
      state,
      action: PayloadAction<ZetkinSurveyExtended[]>
    ) => {
      state.surveysWithElementsList = remoteList(action.payload);
      state.surveysWithElementsList.loaded = new Date().toISOString();
    },
  },
});

function addSubmissionToState(
  state: SurveysStoreSlice,
  submissions: ZetkinSurveySubmission[]
) {
  submissions.forEach((submission) => {
    const submissionListItem = state.submissionList.items.find(
      (item) => item.id == submission.id
    );
    const submissionBySurveyId = state.submissionsBySurveyId[
      submission.survey.id
    ]?.items.find((item) => item.id == submission.id);

    if (submissionListItem) {
      submissionListItem.data = { ...submissionListItem.data, ...submission };
    } else {
      state.submissionList.items.push(
        remoteItem(submission.id, { data: submission })
      );
    }

    if (submissionBySurveyId) {
      submissionBySurveyId.data = {
        ...submissionBySurveyId.data,
        ...submission,
      };
    } else {
      if (!state.submissionsBySurveyId[submission.survey.id]) {
        state.submissionsBySurveyId[submission.survey.id] = remoteList();
      }
      state.submissionsBySurveyId[submission.survey.id].items.push(
        remoteItem(submission.id, { data: submission })
      );
    }
  });
}

export default surveysSlice;
export const {
  campaignSurveyIdsLoad,
  campaignSurveyIdsLoaded,
  elementAdded,
  elementDeleted,
  elementOptionAdded,
  elementOptionDeleted,
  elementOptionUpdated,
  elementOptionsReordered,
  elementUpdated,
  elementsLoad,
  elementsLoaded,
  elementsReordered,
  submissionLoad,
  submissionLoaded,
  statsLoad,
  statsLoaded,
  surveyCreate,
  surveyCreated,
  surveyDeleted,
  surveyLoad,
  surveyLoaded,
  surveySubmissionUpdate,
  surveySubmissionUpdated,
  surveySubmissionsLoad,
  surveySubmissionsLoaded,
  surveysLoad,
  surveysLoaded,
  surveyUpdate,
  surveyUpdated,
  surveysWithElementsLoad,
  surveysWithElementsLoaded,
} = surveysSlice.actions;
