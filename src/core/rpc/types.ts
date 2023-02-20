import { NextApiRequest } from 'next';
import { ZodSchema } from 'zod';

import IApiClient from 'core/api/client/IApiClient';

export type RPCRouteDef<ParamsType, ResultType> = {
  handler: (
    params: ParamsType,
    apiClient: IApiClient,
    req: NextApiRequest
  ) => Promise<ResultType>;
  name: string;
  schema: ZodSchema<ParamsType>;
};

export type RPCDef<ParamsType, ResultType> = {
  _identity: (p: ParamsType) => ResultType;
  name: string;
};

export type RPCRequestBody<ParamsType> = {
  func: string;
  params: ParamsType;
};

export type RPCResponseBody<ResultType> = {
  result: ResultType;
};

export function makeRPCDef<ParamsType, ResultType>(
  name: string
): RPCDef<ParamsType, ResultType> {
  return {
    /*
     * The _identity() function is never used. It's just there as a carrier
     * of the ParamsType and ResultType, to aid type inference when using the
     * definition with IAPIClient.rpc().
     */
    _identity: (p: ParamsType) => p as unknown as ResultType,
    name,
  };
}
