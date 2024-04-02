/**
 * @file Power Station API
 * This is a utility class to assist with pulling basic information on power stations.
 */

import { header, BaseUrl } from "./util";
import createClient from "openapi-fetch";
import { type paths } from "./v1";

/* **************** GET POWER STATION LIST **************** */
const plantListPath = "/op/v0/plant/list";
export type PowerStation = paths[typeof plantListPath]["post"]["responses"]["200"]["content"]["application/json"]["result"]["data"][0];

/**
 * Obtain the list of inverters owned by this account
 * @param apiKey Account API key
 * @returns All inverters
 */
export async function getDevices(apiKey: string): Promise<PowerStation[]> {
  const results: PowerStation[] = [];
  let page = 0;
  let total = 0;
  do {
    const { data } = await createClient<paths>({ baseUrl: BaseUrl }).POST(plantListPath, {
      params: {
        header: header(plantListPath, apiKey)
      },
      body: {
        currentPage: ++page,
        pageSize: 100
      }
    });

    if (data === undefined) throw new Error(`Did not receive back any data.`);
    if (data.errno !== 0) throw new Error(`Invalid response code: ${data.errno.toString()}: (page: ${page.toString()})`);

    // Append the results.  Return if at the end of pagination.
    total = data.result.total;
    results.push(...data.result.data);
  } while (results.length < total);
  return results;
}

/* **************** GET POWER STATION DETAIL **************** */
const plantDetailPath = "/op/v0/plant/detail";
export type PowerStationDetails = paths[typeof plantDetailPath]["get"]["responses"]["200"]["content"]["application/json"]["result"];

/**
 * Get details about a specific power station.
 *
 * @param apiKey Account API key
 * @param powerStation Specific power station to query.
 * @returns More detailed power station information.
 */
export async function getDetails(apiKey: string, powerStation: Pick<PowerStation, "stationID">): Promise<PowerStationDetails | undefined> {
  const { data } = await createClient<paths>({ baseUrl: BaseUrl }).GET(plantDetailPath, {
    params: {
      header: header(plantDetailPath, apiKey),
      query: { id: powerStation.stationID }
    }
  });
  if (data === undefined) throw new Error(`Did not receive back any data.`);
  if (data.errno !== 0) throw new Error(`Invalid response code: ${data.errno.toString()}`);
  return data.result;
}

export default { getDetails, getDevices };
