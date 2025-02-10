import { useState } from 'react';

type focusDateState = {
  focusDate: Date;
  setFocusDate: (date: Date) => void;
};

export const useFocusDate = (): focusDateState => {
  const [focusDate, setFocusDate] = useState(new Date(Date.now()));
  return { focusDate, setFocusDate };
};
