import { NextApiRequest, NextApiResponse } from "next";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const globalAny: any = global;

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (process.env.NODE_ENV === "production") {
        res.status(404);
    } else {
        res.status(200).json({
            coverage: globalAny.__coverage__ || null,
        });
    }
};
