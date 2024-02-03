import type { NextApiRequest } from 'next';

const OPERATORS = ['==', '>=', '<=', '>', '<', '!=', '*='];

const getFilters = (
  req: NextApiRequest
): Array<[string, string, string]> | undefined => {
  const filters = req.query.filter;

  if (filters) {
    const filterArray = typeof filters === 'string' ? [filters] : filters;
    return filterArray.map((filter) => {
      const operator = OPERATORS.find((o) => filter.includes(o));
      if (!operator) {
        throw new Error('Bad filter query');
      }
      // Get parts on either side of the operator
      const parts = filter.split(operator);
      if (parts.length < 2) {
        throw new Error('Bad filter query');
      }
      return [parts[0], operator, parts[1]];
    });
  }
  return;
};

export default getFilters;
