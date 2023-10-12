import createStore from 'core/store';
import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { NextRouter } from 'next/router';
import { instance, mock, reset } from 'ts-mockito';
import { remoteItem, remoteList } from 'utils/storeUtils';
import SurveyDataModel, { SurveyState } from './SurveyDataModel';
import {
  ZetkinSurveyExtended,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';

function mockList<DataType extends { id: number }>(items?: DataType[]) {
  const list = remoteList<DataType>(items);
  if (items) {
    list.items = items.map((data) => mockItem(data));
  }

  return list;
}

function mockItem<DataType extends { id: number }>(data: DataType) {
  const item = remoteItem<DataType>(data.id, { data });
  item.loaded = new Date().toISOString();
  return item;
}

describe('SurveyDataModel', () => {
  const mockClient = mock<IApiClient>();
  const mockRouter = mock<NextRouter>();

  beforeEach(() => {
    reset(mockClient);
    reset(mockRouter);
    jest.useRealTimers();
  });

  describe('state', () => {
    const mockStoreData = (
      published: string | null,
      expires: string | null
    ) => ({
      surveys: {
        elementsBySurveyId: {},
        statsBySurveyId: {},
        submissionList: mockList<ZetkinSurveySubmission>([]),
        surveyIdsByCampaignId: {},
        surveyList: mockList<ZetkinSurveyExtended>([
          {
            access: 'open',
            callers_only: false,
            campaign: null,
            elements: [],
            expires: expires,
            id: 1,
            info_text: 'Semla',
            org_access: 'sameorg',
            organization: {
              id: 1,
              title: 'Semla lovers',
            },
            published: published,
            signature: 'require_signature',
            title: 'Semla lovers assemble',
          },
        ]),
      },
    });

    it('is SCHEDULED when publish date is in future', () => {
      jest.useFakeTimers().setSystemTime(new Date('2022-03-01'));
      const mockData = mockStoreData('2022-03-23', '2022-04-01');
      const store = createStore(mockData);

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new SurveyDataModel(env, 1, 1);
      expect(model.state).toBe(SurveyState.SCHEDULED);
    });

    it('is DRAFT when publish date and expire date are null', () => {
      jest.useFakeTimers().setSystemTime(new Date('2022-03-02'));
      const mockData = mockStoreData(null, null);
      const store = createStore(mockData);

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new SurveyDataModel(env, 1, 1);
      expect(model.state).toBe(SurveyState.DRAFT);
    });

    it('is UNPUBLISHED when publish date and expire date are in the past', () => {
      jest.useFakeTimers().setSystemTime(new Date('2022-04-10'));
      const mockData = mockStoreData('2022-03-23', '2022-04-01');
      const store = createStore(mockData);

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new SurveyDataModel(env, 1, 1);
      expect(model.state).toBe(SurveyState.UNPUBLISHED);
    });

    it('is PUBLISHED when publish date is past and expire date is in the future', () => {
      jest.useFakeTimers().setSystemTime(new Date('2022-04-23'));
      const mockData = mockStoreData('2022-03-23', '2022-06-23');
      const store = createStore(mockData);

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new SurveyDataModel(env, 1, 1);
      expect(model.state).toBe(SurveyState.PUBLISHED);
    });
  });
});
