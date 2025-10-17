import { ZetkinQuery } from '../components/types';

export type ZetkinQueryPatchBody = Partial<Pick<ZetkinQuery, 'filter_spec'>>;
