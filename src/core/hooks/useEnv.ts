import { useContext } from 'react';

import { EnvContext } from 'core/env/EnvContext';

/**
 * Used by components to access an API client instance and [environment
 * variables](../documents/Environment_Variables.html).
 *
 * ```typescript
 * const Component = () => {
 *   const env = useEnv();
 *   return (
 *     <a href={env.vars.ZETKIN_GEN2_ORGANIZE_URL}>
 *       Go to the old interface
 *     </a>
 *   )
 * }
 * ```
 *
 * @category Environment Variables
 */
export default function useEnv() {
  const env = useContext(EnvContext);
  if (!env) {
    throw new Error('EnvContext missing');
  }

  return env;
}
