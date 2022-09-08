import React, { useState } from 'react';

import { ZetkinUser } from '../types/zetkin';

export const UserContext = React.createContext<ZetkinUser | null>(null);

export const useUser = (): ZetkinUser | null => {
  return React.useContext(UserContext);
};

type focusDateState = {
  focusDate: Date;
  setFocusDate: (date: Date) => void;
};

export const useFocusDate = (): focusDateState => {
  const [focusDate, setFocusDate] = useState(new Date(Date.now()));
  return { focusDate, setFocusDate };
};
