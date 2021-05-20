import apiUrl from '../utils/apiUrl';

export default async function deleteUserFollowing(orgId : number) : Promise<void> {
    await fetch(apiUrl(`/users/me/following/${orgId}`), {
        method: 'DELETE',
    });
}