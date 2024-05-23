import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { duplicatesLoad, duplicatesLoaded, ZetkinDuplicate } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useDuplicates(orgId: number) {
  const dispatch = useAppDispatch();
  const duplicatesList = useAppSelector(
    (state) => state.duplicates.duplicatesList
  );

  return loadListIfNecessary(duplicatesList, dispatch, {
    actionOnLoad: () => duplicatesLoad(),
    actionOnSuccess: (duplicates) => duplicatesLoaded(duplicates),
    loader: () =>
      new Promise(function (resolve, reject) {
        const data: ZetkinDuplicate[] = [
          {
            dismissed: null,
            duplicatePersons: [
              {
                alt_phone: '',
                city: 'Oakland',
                co_address: '',
                country: 'USA',
                email: 'angela@blackpanthers.org',
                ext_id: '74',
                first_name: 'Angel',
                gender: 'f',
                id: 2,
                is_user: false,
                last_name: 'Davidsson',
                phone: '0018493298448',
                street_address: '45 Main Street',
                zip_code: '34910',
              },
              {
                alt_phone: '',
                city: 'Linköping',
                co_address: '',
                country: 'USA',
                email: 'haeju@blackpanthers.org',
                ext_id: '74',
                first_name: 'Haeju',
                gender: 'f',
                id: 2,
                is_user: false,
                last_name: 'Eom',
                phone: '0018493298448',
                street_address: '45 Main Street',
                zip_code: '34910',
              },
              {
                alt_phone: '',
                city: 'Oakland',
                co_address: '',
                country: 'USA',
                email: 'angela@blackpanthers.org',
                ext_id: '74',
                first_name: 'Angela',
                gender: 'f',
                id: 2,
                is_user: false,
                last_name: 'Davis',
                phone: '0018493298449',
                street_address: '45 Main Street',
                zip_code: '34910',
              },
            ],
            id: 100,
            merged: null,
            organization: {
              id: 1,
              title: 'My Organization',
            },
            status: 'pending',
          },
        ];

        if (data) {
          resolve(data);
        } else {
          reject('error');
        }
      }),
  });
}

//do not remove this comment :)
/* apiClient.get<ZetkinDuplicate[]>(`/orgs/${orgId}/people/duplicates`) */
