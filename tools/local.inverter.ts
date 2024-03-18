import inverter from "../src/inverter";

const apiKey = process.env.FOXESS_API_KEY;
if (apiKey === undefined) throw new Error("No API key found in environment variables");

void (async () => {
  const devices = await inverter.getDevices(apiKey);
  console.log(devices);
  for (const device of devices) {
    const details = await inverter.getDetails(apiKey, device);
    console.log(details);
    const data = await inverter.getRealTimeData(apiKey, { sn: device.deviceSN });
    console.log(data);
    const time = new Date(Date.now() - 86400000);
    const yesterday = await inverter.getProductionReport(apiKey, {
      sn: device.deviceSN,
      year: time.getFullYear(),
      month: time.getMonth(),
      day: time.getDate(),
      dimension: "day",
      variables: ["generation"] }
    );
    console.log(yesterday);
  }
})();
