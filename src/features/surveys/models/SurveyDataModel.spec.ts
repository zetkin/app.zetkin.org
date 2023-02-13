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

    describe('state', () => {
      const mockStoreData = (
        expires: string | null,
        published: string | null
      ) => ({
        surveys: {
          submissionList: mockList<ZetkinSurveySubmission>([]),
          surveyList: mockList<ZetkinSurveyExtended>([
            {
              access: 'open',
              allow_anonymous: true,
              callers_only: false,
              elements: [],
              expires: expires,
              id: 1,
              info_text: 'Semla',
              organization: {
                id: 1,
                title: 'Semla lovers',
              },
              published: published,
              title: 'Semla lovers assemble',
            },
          ]),
        },
      });
      it('is PUBLISHED', () => {
        const mockData = mockStoreData('2023-06-28', '1991-08-23');
        const store = createStore(mockData);
        const apiClient = instance(mockClient);
        const env = new Environment(store, apiClient, instance(mockRouter));
        const model = new SurveyDataModel(env, 1, 1);
        expect(model.state).toBe(SurveyState.PUBLISHED);
      });
    });
  });
});
