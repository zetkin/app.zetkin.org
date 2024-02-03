import Fuse from 'fuse.js';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

type ListType = ZetkinEventParticipant | ZetkinEventResponse;

export default function filterParticipants(
  list: ZetkinEventResponse[] | ZetkinEventParticipant[],
  filterString: string
) {
  const tokens = filterString.trim().split(/\s+/);

  //when list is a sign up list
  if (list.some((obj) => Object.keys(obj).includes('person'))) {
    const signUpFuseList = new Fuse(list as ListType[], {
      includeScore: true,
      keys: [
        { name: 'person.first_name', weight: 1.0 },
        { name: 'person.last_name', weight: 0.8 },
        { name: 'person.phone', weight: 0.8 },
        { name: 'person.email', weight: 0.8 },
      ],
      threshold: 0.4,
    });

    return signUpFuseList
      .search({
        $and: tokens.map((searchToken: string) => {
          const orFields: Fuse.Expression[] = [
            { $path: ['person', 'first_name'], $val: searchToken },
            { $path: ['person', 'last_name'], $val: searchToken },
            { $path: ['person', 'phone'], $val: searchToken },
            { $path: ['person', 'email'], $val: searchToken },
          ];

          return {
            $or: orFields,
          };
        }),
      })
      .map((fuseResult) => fuseResult.item);
  }

  //when list is a participant list
  const participantsFuseList = new Fuse(list as ListType[], {
    includeScore: true,
    keys: [
      { name: 'first_name', weight: 1.0 },
      { name: 'last_name', weight: 0.8 },
      { name: 'phone', weight: 0.8 },
      { name: 'email', weight: 0.8 },
    ],
    threshold: 0.4,
  });

  return participantsFuseList
    .search({
      $and: tokens.map((searchToken: string) => {
        const orFields: Fuse.Expression[] = [
          { first_name: searchToken },
          { last_name: searchToken },
          { phone: searchToken },
          { email: searchToken },
        ];

        return {
          $or: orFields,
        };
      }),
    })
    .map((fuseResult) => fuseResult.item);
}
