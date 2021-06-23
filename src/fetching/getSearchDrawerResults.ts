import { defaultFetch } from ".";
import apiUrl from "../utils/apiUrl";

export default async function getSearchDrawerResults(
    searchQuery: string,
    orgId: string,
    fetch = defaultFetch
) {
    const body = JSON.stringify({
        "q": searchQuery,
    });

    const res = await fetch(`/orgs/${orgId}/search/campaign`, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body,
    });
    const data = await res.json();
    return data;
}
