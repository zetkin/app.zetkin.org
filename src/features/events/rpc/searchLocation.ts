import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinLocation } from 'utils/types/zetkin';

const paramsSchema = z.string();

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinLocation[];

export const searchLocationDef = {
  handler: handle,
  name: 'searchLocation',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(searchLocationDef.name);

type NominatimResult = {
  address: {
    city?: string;
    house_number?: string;
    [key: string]: unknown;
    postcode?: string;
    road?: string;
    town?: string;
    village?: string;
  };
  class: string;
  display_name: string;
  lat: string;
  lon: string;
  name: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
  type: string;
};

async function searchAddress(query: string) {
  const nominatimAPI = process.env.NOMINATIM_API;
  if (!nominatimAPI) {
    return [];
  }

  const url = new URL(`${nominatimAPI}/search`);
  url.searchParams.append('q', query);
  url.searchParams.append('format', 'json');
  url.searchParams.append('addressdetails', '1');
  url.searchParams.append('limit', '40');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'Zetkin/3.0' },
  });
  const addresses: NominatimResult[] = await res.json();

  const uniqueAddresses: Record<string, NominatimResult> = {};
  for (const addr of addresses) {
    const { house_number, road, city, town, village, postcode } = addr.address;
    // key = normalized full address
    const key = [house_number, road, city || town || village, postcode]
      .filter(Boolean)
      .join('|');

    if (!uniqueAddresses[key]) {
      uniqueAddresses[key] = addr;
    }
  }

  return Object.values(uniqueAddresses);
}

async function handle(params: Params): Promise<Result> {
  let addresses: NominatimResult[] = [];
  try {
    addresses = await searchAddress(params);
  } catch (e) {
    // ignored
  }
  return addresses.map((address) => {
    const { house_number, road, city, town, village, postcode } =
      address.address;

    let infoText = '';
    if (road) {
      infoText += road;
    }
    if (road && house_number) {
      infoText += ' ' + house_number;
    }

    const cityName = city || town || village;
    if (postcode && cityName) {
      if (infoText) {
        infoText += ', ';
      }

      infoText += postcode + ' ' + cityName;
    }

    if (!infoText) {
      infoText = [house_number, road, city, town, village, postcode].join(' ');
    }

    return {
      id: -1,
      info_text: infoText,
      lat: parseFloat(address.lat),
      lng: parseFloat(address.lon),
      title: address.name,
    };
  });
}
