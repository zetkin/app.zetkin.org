/**
 * These are the available actions. Name the values
 * in the enum to match the filename in `./actions`.
 *
 * The modules in `./actions` need to export an object `config`
 * and a React functional component `DialogContent`. See
 * `./actions/types.ts` for the expected shape of the data and
 * the `DialogContent` component's base props.
 */
export enum ACTIONS {
  CREATE_CAMPAIGN = 'createCampaign',
  CREATE_EVENT = 'createEvent',
  CREATE_TASK = 'createTask',
}
