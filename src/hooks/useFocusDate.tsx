import { useState } from 'react';

type focusDateState = {
    focusDate: Date;
    setFocusDate: (date: Date) => void;
};

const useFocusDate = (): focusDateState => {
    const [focusDate, setFocusDate] = useState(new Date(Date.now()));
    return { focusDate, setFocusDate };
};

export default useFocusDate;
