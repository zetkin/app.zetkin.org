import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { RPCRouteDef } from './types';

export class RPCRouter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _defsByName: Record<string, RPCRouteDef<any, any>> = {};

  async handle(req: NextApiRequest, res: NextApiResponse) {
    // TODO: Handle auth here?

    if (req.method != 'POST') {
      return res.status(400).end();
    }

    const { func, params } = req.body;

    if (!func || !params) {
      return res.status(400).end();
    }

    const def = this._defsByName[func];

    if (!def) {
      return res.status(404).end();
    }

    const inputParams = def.schema.safeParse(params);
    if (!inputParams.success) {
      return res.status(400).json(inputParams.error);
    }

    const apiClient = new BackendApiClient(req.headers);

    const result = await def.handler(inputParams.data, apiClient, req);

    res.status(200).json({
      result,
    });
  }

  register<ParamsType, ResultType>(
    funcDef: RPCRouteDef<ParamsType, ResultType>
  ) {
    this._defsByName[funcDef.name] = funcDef;
  }
}
