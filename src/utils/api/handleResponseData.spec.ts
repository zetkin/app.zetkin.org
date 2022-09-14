import APIError from 'utils/apiError';
import handleResponseData from './handleResponseData';
import mockFetchResponse from 'utils/testing/mocks/mockFetchResponse';

describe('handleResponseData()', () => {
  it('Returns the value at the property "data" of the response object', async () => {
    const resBody = {
      data: { id: 1, title: 'Coffee Table book about coffee tables' },
    };
    const mock200Res = mockFetchResponse(resBody);
    const data = await handleResponseData(mock200Res, 'GET');
    expect(data).toEqual(resBody.data);
  });

  describe('Throws errors', () => {
    it('when there is a non-OK status code', async () => {
      const mock404Res = mockFetchResponse({}, { ok: false, status: 404 });
      const handle = () => handleResponseData(mock404Res, 'GET');
      expect.assertions(1);
      return handle().catch((e) =>
        expect(e.message).toEqual(new APIError('GET', mock404Res.url).message)
      );
    });

    it('when the response object does not contain the property "data"', async () => {
      const mock404Res = mockFetchResponse({
        notBody: 'this is not the property body',
      });
      const handle = () => handleResponseData(mock404Res, 'GET');
      expect.assertions(1);
      return handle().catch((e) =>
        expect(e.message).toEqual(
          new APIError(
            'GET',
            mock404Res.url,
            'Response object did not contain property "data"'
          ).message
        )
      );
    });
  });
});
