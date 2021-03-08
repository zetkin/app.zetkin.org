import { NextApiRequest, NextApiResponse } from 'next';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const globalAny : any = global;

export default (req : NextApiRequest, res : NextApiResponse) : void => {
    // TODO: Disable this in production
    res.status(200).json({
        coverage: globalAny.__coverage__ || null,
    });
};