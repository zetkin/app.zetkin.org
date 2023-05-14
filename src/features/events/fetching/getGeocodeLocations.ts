// import defaultFetch from '../../../utils/fetching/defaultFetch';

export interface NominatimLocation {
    place_id: string,
    licence: string,
    osm_type: string,
    osm_id: string,
    boundingbox: string[],
    lat: string,
    lon: string,
    display_name: string,
    class: string,
    type: string,
    importance: number,
    icon: string | null,
    address: {
        "ISO3166-2-lvl4": string | null,
        city: string | null,
        country: string,
        country_code: string
        postcode: string,
        state: string | null,
        state_district: string | null, 
    } | null,
    extratags: {
        [key: string]: string
    } | null
}

export default function getGeocodeLocations(query: string) {
    return async (): Promise<NominatimLocation[]> => {
        console.log(query)
        const locationRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        const locationBody = await locationRes.json()
        return locationBody
    }
}