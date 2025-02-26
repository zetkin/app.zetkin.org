import { useContext } from 'react';

import { UserContext } from 'core/env/UserContext';

export default function useUser() {
  return useContext(UserContext);
}
