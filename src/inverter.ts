/**
 * @file Inverter API
 * This is a utility class to assist with pulling basic information on inverters and their real-time data.
 */

import { header, BaseUrl } from "./util";
import createClient from "openapi-fetch";
import { type paths } from "./v1";

/* **************** GET DEVICE LIST **************** */
const inverterPath = "/op/v0/device/list";
export type Inverter = paths[typeof inverterPath]["post"]["responses"]["200"]["content"]["application/json"]["result"]["data"][0];

/**
 * Obtain the list of inverters owned by this account
 * @param apiKey Account API key
 * @returns All inverters
 */
export async function getDevices(apiKey: string): Promise<Inverter[]> {
  const results: Inverter[] = [];
  let page = 0;
  let total = 0;
  do {
    const { data } = await createClient<paths>({ baseUrl: BaseUrl }).POST(inverterPath, {
      params: {
        header: header(inverterPath, apiKey)
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

/* **************** GET DEVICE DETAIL **************** */
const detailPath = "/op/v0/device/detail";
export type InverterDetails = paths[typeof detailPath]["get"]["responses"]["200"]["content"]["application/json"]["result"];

/**
 * Get details about a specific inverter.
 *
 * @param apiKey Account API key
 * @param inverter Specific inverter to query.
 * @returns More detailed inverter information.
 */
export async function getDetails(apiKey: string, inverter: Pick<Inverter, "deviceSN">): Promise<InverterDetails | undefined> {
  const { data } = await createClient<paths>({ baseUrl: BaseUrl }).GET(detailPath, {
    params: {
      header: header(detailPath, apiKey),
      query: { sn: inverter.deviceSN }
    }
  });

  if (data === undefined) throw new Error(`Did not receive back any data.`);
  if (data.errno !== 0) throw new Error(`Invalid response code: ${data.errno.toString()}`);
  return data.result;
}

/* **************** GET REALTIME DATA **************** */
const realTimePath = "/op/v0/device/real/query";
export type GetDeviceRealTimeDataRequest = paths[typeof realTimePath]["post"]["requestBody"]["content"]["application/json"];
export type RealTimeData = paths[typeof realTimePath]["post"]["responses"]["200"]["content"]["application/json"]["result"][0];

/**
 * Get realtime data for the account.
 * @param apiKey Account API key
 * @param options (Optional) Specific variables and/or inverters to query. All inverters if not specified.
 * @returns All requested real-time data.
 */
export async function getRealTimeData(apiKey: string, options?: GetDeviceRealTimeDataRequest): Promise<RealTimeData[] | undefined> {
  const { data } = await createClient<paths>({ baseUrl: BaseUrl }).POST(realTimePath, {
    params: { header: header(realTimePath, apiKey) },
    body: options ?? {}
  });
  if (data === undefined) throw new Error(`Did not receive back any data.`);
  if (data.errno !== 0) throw new Error(`Invalid response code: ${data.errno.toString()}`);
  return data.result;
}

/* **************** GET PRODUCTION REPORT **************** */
const reportPath = "/op/v0/device/report/query";
export type GetDeviceProductionReportRequest = paths[typeof reportPath]["post"]["requestBody"]["content"]["application/json"];
export type ReportData = paths[typeof reportPath]["post"]["responses"]["200"]["content"]["application/json"]["result"][0];

/**
 * Obtain the inverter electricity consumption report
 *
 * Calculated according to the time zone of the power station to which the inverter belongs.
 * The monthly electricity consumption of the year is obtained, the daily electricity consumption of the month is obtained, and the hourly electricity consumption of the day is obtained.
 *
 * @param apiKey Account API key
 * @param options Query parameters.
 * @returns Data for the requested report.
 */
export async function getProductionReport(apiKey: string, options: GetDeviceProductionReportRequest): Promise<ReportData[] | undefined> {
  const { data } = await createClient<paths>({ baseUrl: BaseUrl }).POST(reportPath, {
    params: { header: header(reportPath, apiKey) },
    body: options
  });
  if (data === undefined) throw new Error(`Did not receive back any data.`);
  if (data.errno !== 0) throw new Error(`Invalid response code: ${data.errno.toString()}`);
  return data.result;
}

export default { getDetails, getDevices, getProductionReport, getRealTimeData };
